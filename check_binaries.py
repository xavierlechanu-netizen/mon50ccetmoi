import os

def check_file(path):
    if not os.path.exists(path):
        return
    with open(path, 'rb') as f:
        data = f.read()
    count = data.count(b'\r\n')
    print(f"{path}: Found {count} CRLF sequences. Total size: {len(data)}")

check_file('tools/bundletool.jar')
