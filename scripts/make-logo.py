# Generates the MD Build logo mark as a PNG.
#
# Needed because Paddle's product icon field wants a real image URL, and the
# site's logo only ever existed as markup — a navy tile with "MD" beside the
# word "Build". This renders the tile on its own, which is what a square icon
# slot actually wants.
#
#   python scripts/make-logo.py
#
# Writes md-logo.png (512px, for Paddle and anywhere else an image is required)
# and md-logo-192.png (a smaller copy for favicons and small contexts).

from PIL import Image, ImageDraw, ImageFont
import os

INK = (27, 36, 52)        # #1B2434, the brand navy
WHITE = (255, 255, 255)
SIZE = 512
RADIUS = int(SIZE * 0.22)  # rounded square, matching the site's tile

def find_font(size):
    """Prefer a bold grotesque; fall back through what Windows and Linux ship."""
    candidates = [
        r"C:\Windows\Fonts\seguisb.ttf",   # Segoe UI Semibold
        r"C:\Windows\Fonts\segoeuib.ttf",  # Segoe UI Bold
        r"C:\Windows\Fonts\arialbd.ttf",   # Arial Bold
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

def build(size):
    # Render at 4x and downsample, so the rounded corners and letterforms
    # come out smooth rather than stepped.
    scale = 4
    big = size * scale
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [(0, 0), (big - 1, big - 1)],
        radius=int(RADIUS * (size / SIZE) * scale),
        fill=INK,
    )

    font = find_font(int(big * 0.38))
    text = "MD"
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    # Centre on the glyphs' actual bounding box, not the font's line box —
    # otherwise ascender and descender space pushes the text visibly high.
    x = (big - (right - left)) / 2 - left
    y = (big - (bottom - top)) / 2 - top
    draw.text((x, y), text, font=font, fill=WHITE)

    return img.resize((size, size), Image.LANCZOS)

root = os.path.join(os.path.dirname(__file__), "..")
build(SIZE).save(os.path.join(root, "md-logo.png"))
build(192).save(os.path.join(root, "md-logo-192.png"))
print("Wrote md-logo.png (512px) and md-logo-192.png")
