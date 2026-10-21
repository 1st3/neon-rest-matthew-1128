"""Builds the 1200x630 Open Graph social preview card (docs: ~/dev/docs/social-previews.md).

    python3 art/make_og.py

Writes og-image.png (1200x630, under 200 KB) in the repository root. Needs Google Chrome.
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

og = ROOT / "og-image.png"
subprocess.run(
    [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--virtual-time-budget=2000",
        "--window-size=1200,630",
        f"--screenshot={og}",
        (ROOT / "art" / "og-card.html").as_uri(),
    ],
    check=True,
    capture_output=True,
)
print(f"wrote {og.name} ({og.stat().st_size} bytes)")
