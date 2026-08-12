from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "category-videos"
FRAME_DIR = ROOT / ".category-video-frames"
WIDTH = 1280
HEIGHT = 720
FPS = 24
DURATION_SECONDS = 5
FRAME_COUNT = FPS * DURATION_SECONDS


THEMES = {
    "restaurants-dining": {
        "title": "Restaurants & Dining",
        "palette": ("#261414", "#6f1d1b", "#f4a261", "#fff4e6"),
        "scene": "dining",
    },
    "cafes-bakeries": {
        "title": "Cafes & Bakeries",
        "palette": ("#1f1712", "#6b4226", "#d4a373", "#fff1d6"),
        "scene": "cafe",
    },
    "nature-outdoors": {
        "title": "Nature & Outdoors",
        "palette": ("#071c19", "#14532d", "#52b788", "#d8f3dc"),
        "scene": "nature",
    },
    "heritage-culture": {
        "title": "Heritage & Culture",
        "palette": ("#1c1714", "#6f4e37", "#c19a6b", "#f5eadc"),
        "scene": "heritage",
    },
    "adventure-sports": {
        "title": "Sports & Activities",
        "palette": ("#071827", "#0f766e", "#f59e0b", "#e0f2fe"),
        "scene": "sports",
    },
    "stays-hotels": {
        "title": "Stays & Hotels",
        "palette": ("#07111f", "#1d4d43", "#38bdf8", "#e0f2fe"),
        "scene": "stays",
    },
    "shopping-markets": {
        "title": "Shopping & Markets",
        "palette": ("#18111f", "#6d28d9", "#f97316", "#fff7ed"),
        "scene": "shopping",
    },
    "wellness-relaxation": {
        "title": "Wellness & Relaxation",
        "palette": ("#0f172a", "#0f766e", "#a7f3d0", "#ecfeff"),
        "scene": "wellness",
    },
    "chouf-default": {
        "title": "Explore Chouf",
        "palette": ("#07111f", "#134e4a", "#2abf9e", "#ecfeff"),
        "scene": "chouf",
    },
}


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[index : index + 2], 16) for index in (0, 2, 4))


def lerp(a: int, b: int, amount: float) -> int:
    return int(a + (b - a) * amount)


def background(draw: ImageDraw.ImageDraw, palette: tuple[str, str, str, str], drift: float) -> None:
    top = hex_to_rgb(palette[0])
    bottom = hex_to_rgb(palette[1])

    for y in range(HEIGHT):
        amount = y / max(HEIGHT - 1, 1)
        color = tuple(lerp(top[i], bottom[i], amount) for i in range(3))
        draw.line([(0, y), (WIDTH, y)], fill=color)

    accent = hex_to_rgb(palette[2])
    for index, scale in enumerate((0.78, 1.0, 1.2)):
        x = int(WIDTH * (0.68 + 0.04 * math.sin(drift + index)))
        y = int(HEIGHT * (0.26 + 0.08 * math.cos(drift * 0.8 + index)))
        radius = int(220 * scale)
        color = (*accent, 34 - index * 8)
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)


def draw_mountains(draw: ImageDraw.ImageDraw, offset: float, base: int = 600) -> None:
    layers = [
        ("#0b202b", 0, 260),
        ("#143b3a", 80, 210),
        ("#1d6154", 180, 160),
    ]
    for color, y_shift, amp in layers:
        points = [(-80, HEIGHT)]
        for x in range(-80, WIDTH + 120, 130):
            y = base - y_shift - amp * (0.4 + 0.6 * abs(math.sin((x + offset) * 0.007)))
            points.append((x, int(y)))
        points.append((WIDTH + 80, HEIGHT))
        draw.polygon(points, fill=color)


def draw_dining(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    cx = WIDTH // 2 + int(28 * math.sin(t * math.tau))
    cy = HEIGHT // 2 + 40
    draw.ellipse((cx - 178, cy - 178, cx + 178, cy + 178), fill="#fff7ed", outline="#f4a261", width=12)
    draw.ellipse((cx - 98, cy - 98, cx + 98, cy + 98), fill="#2a1818", outline="#fed7aa", width=4)
    for i in range(5):
        angle = t * math.tau + i * 1.25
        x = cx + int(math.cos(angle) * 54)
        y = cy + int(math.sin(angle) * 38)
        draw.ellipse((x - 16, y - 10, x + 16, y + 10), fill="#ef4444")
        draw.rectangle((x - 4, y - 26, x + 4, y - 6), fill="#22c55e")

    fork_x = cx - 300
    knife_x = cx + 300
    draw.rounded_rectangle((fork_x - 10, cy - 150, fork_x + 10, cy + 145), radius=8, fill="#fff4e6")
    for prong in range(4):
        draw.rounded_rectangle((fork_x - 48 + prong * 25, cy - 170, fork_x - 35 + prong * 25, cy - 70), radius=7, fill="#fff4e6")
    draw.rounded_rectangle((knife_x - 14, cy - 170, knife_x + 14, cy + 145), radius=12, fill="#fff4e6")
    draw.pieslice((knife_x - 42, cy - 174, knife_x + 42, cy - 70), start=270, end=90, fill="#fff4e6")


def draw_cafe(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    cx = WIDTH // 2
    cy = HEIGHT // 2 + 55
    draw.rounded_rectangle((cx - 205, cy - 40, cx + 165, cy + 145), radius=42, fill="#fff1d6")
    draw.rounded_rectangle((cx - 160, cy - 6, cx + 125, cy + 104), radius=28, fill="#6b4226")
    draw.arc((cx + 105, cy - 5, cx + 250, cy + 105), 282, 78, fill="#fff1d6", width=22)
    draw.ellipse((cx - 230, cy + 122, cx + 215, cy + 178), fill="#d4a373")
    for i in range(3):
        x = cx - 100 + i * 92
        wave = int(20 * math.sin(t * math.tau + i))
        draw.arc((x - 36, cy - 185 + wave, x + 36, cy - 55 + wave), 105, 250, fill="#fff1d6", width=9)
    for i in range(5):
        x = 130 + i * 210
        y = 520 + int(8 * math.sin(t * math.tau + i))
        draw.ellipse((x, y, x + 86, y + 56), fill="#f59e0b")


def draw_nature(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    draw_mountains(draw, t * 90)
    sun_x = 930 + int(18 * math.sin(t * math.tau))
    sun_y = 190 + int(14 * math.cos(t * math.tau))
    draw.ellipse((sun_x - 62, sun_y - 62, sun_x + 62, sun_y + 62), fill="#fbbf24")
    for x in range(90, WIDTH, 145):
        y = 500 + int(10 * math.sin(t * math.tau + x))
        draw.rectangle((x - 8, y + 68, x + 8, y + 140), fill="#6b3f22")
        draw.polygon([(x, y), (x - 58, y + 92), (x + 58, y + 92)], fill="#22c55e")
        draw.polygon([(x, y + 42), (x - 72, y + 132), (x + 72, y + 132)], fill="#15803d")


def draw_heritage(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    y = 220
    draw.rectangle((220, y + 245, 1060, y + 305), fill="#c19a6b")
    for i in range(5):
        x = 290 + i * 165
        draw.rectangle((x, y + 95, x + 70, y + 250), fill="#f5eadc")
        draw.rectangle((x - 18, y + 70, x + 88, y + 104), fill="#c19a6b")
        draw.rectangle((x - 14, y + 248, x + 84, y + 278), fill="#c19a6b")
    draw.rectangle((200, y + 54, 1080, y + 92), fill="#f5eadc")
    draw.polygon([(170, y + 54), (640, y - 48), (1110, y + 54)], fill="#c19a6b")
    for i in range(10):
        x = 230 + i * 85 + int(7 * math.sin(t * math.tau + i))
        draw.rectangle((x, y + 305, x + 52, y + 338), fill="#7c5a3a")


def draw_sports(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    draw.rounded_rectangle((130, 170, 1150, 590), radius=28, outline="#e0f2fe", width=10)
    draw.line((WIDTH // 2, 170, WIDTH // 2, 590), fill="#e0f2fe", width=8)
    draw.ellipse((WIDTH // 2 - 92, 288, WIDTH // 2 + 92, 472), outline="#e0f2fe", width=8)
    ball_x = int(230 + 760 * t)
    ball_y = int(370 + 90 * math.sin(t * math.tau * 2))
    draw.ellipse((ball_x - 58, ball_y - 58, ball_x + 58, ball_y + 58), fill="#f59e0b", outline="#1f2937", width=7)
    draw.arc((ball_x - 58, ball_y - 58, ball_x + 58, ball_y + 58), 70, 290, fill="#1f2937", width=5)
    draw.arc((ball_x - 58, ball_y - 58, ball_x + 58, ball_y + 58), -110, 110, fill="#1f2937", width=5)
    draw.line((ball_x - 58, ball_y, ball_x + 58, ball_y), fill="#1f2937", width=5)


def draw_stays(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    draw_mountains(draw, t * 60, base=650)
    moon_x = 990
    moon_y = 150
    draw.ellipse((moon_x - 58, moon_y - 58, moon_x + 58, moon_y + 58), fill="#e0f2fe")
    draw.ellipse((moon_x - 25, moon_y - 68, moon_x + 80, moon_y + 45), fill="#07111f")
    x = WIDTH // 2 - 245
    y = 330
    draw.rectangle((x, y, x + 490, y + 230), fill="#f8fafc")
    draw.polygon([(x - 50, y + 5), (x + 245, y - 185), (x + 540, y + 5)], fill="#1f2937")
    for i in range(3):
        wx = x + 65 + i * 145
        glow = int(28 + 18 * math.sin(t * math.tau + i))
        draw.rounded_rectangle((wx, y + 70, wx + 82, y + 142), radius=10, fill=(251, 191, 36, 205), outline=(251, 191, 36, 120), width=glow // 8)
    draw.rectangle((x + 218, y + 95, x + 282, y + 230), fill="#334155")


def draw_shopping(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    draw.rectangle((190, 260, 1090, 565), fill="#fff7ed")
    draw.rectangle((190, 220, 1090, 265), fill="#7c3aed")
    for i in range(8):
        x0 = 190 + i * 112
        color = "#f97316" if i % 2 == 0 else "#fff7ed"
        draw.polygon([(x0, 265), (x0 + 112, 265), (x0 + 92, 338), (x0 + 20, 338)], fill=color)
    for i in range(4):
        x = 300 + i * 170
        y = 395 + int(8 * math.sin(t * math.tau + i))
        draw.rounded_rectangle((x, y, x + 90, y + 110), radius=12, fill="#f97316")
        draw.arc((x + 18, y - 45, x + 72, y + 35), 0, 180, fill="#111827", width=7)


def draw_wellness(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    cx = WIDTH // 2
    for i, width in enumerate((330, 250, 175)):
        y = 510 - i * 70 + int(6 * math.sin(t * math.tau + i))
        draw.ellipse((cx - width, y - 42, cx + width, y + 42), fill=["#334155", "#64748b", "#94a3b8"][i])
    for i in range(4):
        x = cx - 155 + i * 95
        draw.arc((x - 28, 220 + i * 8, x + 28, 390 + i * 8), 100, 245, fill="#ecfeff", width=7)
    leaf_x = 900 + int(14 * math.sin(t * math.tau))
    draw.ellipse((leaf_x - 85, 320 - 38, leaf_x + 85, 320 + 38), fill="#a7f3d0")
    draw.line((leaf_x - 70, 350, leaf_x + 62, 292), fill="#0f766e", width=6)


def draw_chouf(draw: ImageDraw.ImageDraw, t: float, palette: tuple[str, str, str, str]) -> None:
    draw_mountains(draw, t * 80, base=610)
    road = [(610, HEIGHT), (680, HEIGHT), (770, 530), (745, 500)]
    draw.polygon(road, fill="#94a3b8")
    for i in range(9):
        x = 160 + i * 122
        y = 470 + int(12 * math.sin(t * math.tau + i))
        draw.polygon([(x, y), (x - 42, y + 85), (x + 42, y + 85)], fill="#14b8a6")


SCENE_DRAWERS = {
    "dining": draw_dining,
    "cafe": draw_cafe,
    "nature": draw_nature,
    "heritage": draw_heritage,
    "sports": draw_sports,
    "stays": draw_stays,
    "shopping": draw_shopping,
    "wellness": draw_wellness,
    "chouf": draw_chouf,
}


def draw_frame(theme: dict[str, str], frame_index: int) -> Image.Image:
    t = frame_index / FRAME_COUNT
    palette = theme["palette"]
    image = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(image, "RGBA")

    background(draw, palette, t * math.tau)
    SCENE_DRAWERS[theme["scene"]](draw, t, palette)

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay, "RGBA")
    overlay_draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 75))
    overlay_draw.rectangle((0, 0, int(WIDTH * 0.58), HEIGHT), fill=(0, 0, 0, 55))
    image = Image.alpha_composite(image, overlay)

    return image.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1, percent=105))


def render_video(name: str, theme: dict[str, str]) -> None:
    frames = FRAME_DIR / name
    if frames.exists():
        shutil.rmtree(frames)
    frames.mkdir(parents=True)

    for frame_index in range(FRAME_COUNT):
        draw_frame(theme, frame_index).save(frames / f"frame-{frame_index:04d}.jpg", quality=88)

    output_path = OUTPUT_DIR / f"{name}.mp4"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-framerate",
            str(FPS),
            "-i",
            str(frames / "frame-%04d.jpg"),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-crf",
            "24",
            str(output_path),
        ],
        check=True,
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    FRAME_DIR.mkdir(parents=True, exist_ok=True)

    for name, theme in THEMES.items():
        render_video(name, theme)

    shutil.rmtree(FRAME_DIR)


if __name__ == "__main__":
    main()
