from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "scripts" / "category-video-sources"
OUTPUT_DIR = ROOT / "public" / "category-videos"
FRAME_DIR = ROOT / ".category-video-frames"

WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION_SECONDS = 6
FRAME_COUNT = FPS * DURATION_SECONDS

VIDEOS = [
    "eat-drink",
    "restaurants-dining",
    "cafes-bakeries",
    "basketball",
    "football",
    "gyms",
    "sunset-spots",
    "nature-outdoors",
    "heritage-culture",
    "adventure-sports",
    "stays-hotels",
    "shopping-markets",
    "wellness-relaxation",
    "chouf-default",
]


def cover_crop(image: Image.Image, width: int, height: int) -> Image.Image:
    source_ratio = image.width / image.height
    target_ratio = width / height

    if source_ratio > target_ratio:
        crop_width = int(image.height * target_ratio)
        left = (image.width - crop_width) // 2
        image = image.crop((left, 0, left + crop_width, image.height))
    else:
        crop_height = int(image.width / target_ratio)
        top = (image.height - crop_height) // 2
        image = image.crop((0, top, image.width, top + crop_height))

    return image.resize((width, height), Image.Resampling.LANCZOS)


def render_frame(source: Image.Image, frame_index: int, variant_index: int) -> Image.Image:
    progress = frame_index / FRAME_COUNT
    loop = math.sin(progress * math.tau)
    loop_offset = math.cos(progress * math.tau)

    zoom = 1.075 + 0.025 * loop
    pan_x = int(18 * loop_offset * (1 if variant_index % 2 == 0 else -1))
    pan_y = int(10 * loop * (1 if variant_index % 3 == 0 else -1))

    scaled_width = int(WIDTH * zoom)
    scaled_height = int(HEIGHT * zoom)
    scaled = source.resize((scaled_width, scaled_height), Image.Resampling.LANCZOS)

    left = (scaled_width - WIDTH) // 2 + pan_x
    top = (scaled_height - HEIGHT) // 2 + pan_y
    left = max(0, min(left, scaled_width - WIDTH))
    top = max(0, min(top, scaled_height - HEIGHT))

    frame = scaled.crop((left, top, left + WIDTH, top + HEIGHT))
    frame = ImageEnhance.Color(frame).enhance(1.04)
    frame = ImageEnhance.Contrast(frame).enhance(1.03)
    return frame.filter(ImageFilter.UnsharpMask(radius=0.8, percent=110, threshold=2))


def render_video(name: str, variant_index: int) -> None:
    source_path = SOURCE_DIR / f"{name}.png"

    if not source_path.exists():
        raise FileNotFoundError(f"Missing source image: {source_path}")

    source = cover_crop(Image.open(source_path).convert("RGB"), WIDTH, HEIGHT)
    frames = FRAME_DIR / name

    if frames.exists():
        shutil.rmtree(frames)

    frames.mkdir(parents=True)

    for frame_index in range(FRAME_COUNT):
        render_frame(source, frame_index, variant_index).save(
            frames / f"frame-{frame_index:04d}.jpg",
            quality=92,
            optimize=True,
        )

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
            "-preset",
            "slow",
            "-crf",
            "20",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(OUTPUT_DIR / f"{name}.mp4"),
        ],
        check=True,
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    FRAME_DIR.mkdir(parents=True, exist_ok=True)

    for index, name in enumerate(VIDEOS):
        render_video(name, index)

    shutil.rmtree(FRAME_DIR)


if __name__ == "__main__":
    main()
