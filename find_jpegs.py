import os

def find_jpegs(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or '.gradle' in root:
            continue
        for file in files:
            path = os.path.join(root, file)
            try:
                with open(path, 'rb') as f:
                    header = f.read(2)
                if header == b'\xff\xd8':
                    print(f"JPEG found: {path}")
            except:
                pass

find_jpegs('.')
