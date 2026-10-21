"""Builds every icon from one vector mark (docs: ~/dev/docs/web-manifest.md).

    python3 art/make_icons.py

Writes into the repository root: favicon.svg, favicon.ico (16/32/48 frames),
favicon-16x16.png, favicon-32x32.png, favicon-48x48.png, icon-192.png,
icon-512.png, icon-maskable-192.png, icon-maskable-512.png and apple-touch-icon.png.
Needs rsvg-convert.
"""
import os
import struct
import subprocess
import tempfile
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent
BG = "#080b0f"
HALO = "#163c54"
GLOW = "#51c5ff"
GAS = "#b1eeff"
CORE = "#effdff"
PATH_D = "M17 20h30M32 20v29"


def svg(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">{body}</svg>\n'


def neon_mark(scale=1.0):
    transform = f' transform="translate(32 32) scale({scale}) translate(-32 -32)"' if scale != 1.0 else ""
    return (
        f'<g{transform} fill="none" stroke-linecap="round" stroke-linejoin="round">'
        f'<path d="{PATH_D}" stroke="{HALO}" stroke-width="10"/>'
        f'<path d="{PATH_D}" stroke="{GLOW}" stroke-width="6.5"/>'
        f'<path d="{PATH_D}" stroke="{GAS}" stroke-width="3.8"/>'
        f'<path d="{PATH_D}" stroke="{CORE}" stroke-width="1.6"/>'
        f'</g>'
    )


# "any" icons: rounded dark neon tile.
ROUNDED = svg(f'<rect width="64" height="64" rx="14" fill="{BG}"/>{neon_mark(1.0)}')
# Full-bleed icons (maskable, apple-touch-icon): flat square with glyph scaled to 0.76
# so its farthest pixel sits at ~30% from center (well inside the 40% safe radius).
FULL_BLEED = svg(f'<rect width="64" height="64" fill="{BG}"/>{neon_mark(0.76)}')


def render(source, size, dest):
    with tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False) as f:
        f.write(source)
        tmp_name = f.name
    try:
        subprocess.run(
            ["rsvg-convert", "-w", str(size), "-h", str(size), tmp_name, "-o", str(dest)],
            check=True,
        )
    finally:
        if os.path.exists(tmp_name):
            os.remove(tmp_name)
    return dest.read_bytes()


def write_ico(frames, dest):
    """A multi-frame .ico made of PNG frames: header, one 16-byte entry per frame, then the PNGs."""
    header = struct.pack("<HHH", 0, 1, len(frames))
    offset = 6 + 16 * len(frames)
    entries, data = b"", b""
    for size, png in frames:
        entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(png), offset + len(data))
        data += png
    dest.write_bytes(header + entries + data)


def main():
    (OUT / "favicon.svg").write_text(ROUNDED, encoding="utf-8")

    frames = []
    for size in (16, 32, 48):
        frames.append((size, render(ROUNDED, size, OUT / f"favicon-{size}x{size}.png")))
    write_ico(frames, OUT / "favicon.ico")

    for size in (192, 512):
        render(ROUNDED, size, OUT / f"icon-{size}.png")
        render(FULL_BLEED, size, OUT / f"icon-maskable-{size}.png")
    render(FULL_BLEED, 180, OUT / "apple-touch-icon.png")

    for name in [
        "favicon.svg",
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon-48x48.png",
        "apple-touch-icon.png",
        "icon-192.png",
        "icon-512.png",
        "icon-maskable-192.png",
        "icon-maskable-512.png",
    ]:
        p = OUT / name
        print(f"{p.name:24} {p.stat().st_size:>6} bytes")


if __name__ == "__main__":
    main()
