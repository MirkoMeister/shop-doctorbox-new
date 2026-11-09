"""Writes the QR codes for the PREVENTURE stand (URLs: qrUrl and movemberQrUrl in src/content/preventure.ts).

Run: python3 scripts/preventure-qr.py
"""
import re
from pathlib import Path

import qrcode
import qrcode.image.svg

root = Path(__file__).resolve().parent.parent
source = (root / "src/content/preventure.ts").read_text()

for key, name in (("qrUrl", "qr.svg"), ("movemberQrUrl", "qr-movember.svg")):
    url = re.search(key + r':\s*"([^"]+)"', source).group(1)
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=0)
    qr.add_data(url)
    qr.make(fit=True)
    svg = qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).to_string(encoding="unicode")
    # moss instead of black, no fixed size: the page sizes it
    svg = svg.replace('fill="#000000"', 'fill="#0e4d2f"')
    svg = re.sub(r'\swidth="[^"]+"\sheight="[^"]+"', "", svg, count=1)
    out = root / "public/preventure" / name
    out.write_text(svg)
    print(f"{out.relative_to(root)}: version {qr.version}, {url}")
