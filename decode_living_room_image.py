from pathlib import Path
import base64

base64_path = Path('public/images/living_room_added.base64.txt')
image_path = Path('public/images/living_room_added.jpg')

if not base64_path.exists():
    raise FileNotFoundError(f'Missing base64 file: {base64_path}')

data = base64_path.read_text(encoding='utf-8').strip()
image_bytes = base64.b64decode(data)
image_path.write_bytes(image_bytes)
print('saved', image_path.resolve())
print('size', image_path.stat().st_size)
