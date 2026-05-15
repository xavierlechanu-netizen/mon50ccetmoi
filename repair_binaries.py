import os

def repair_file(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    
    with open(path, 'rb') as f:
        data = f.read()
    
    if b'\r\n' in data:
        print(f"Found CRLF in {path}, attempting repair...")
        new_data = data.replace(b'\r\n', b'\n')
        with open(path, 'wb') as f:
            f.write(new_data)
        print(f"Repaired {path}")
    else:
        # print(f"No CRLF in {path}")
        pass

def scan_and_repair(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            ext = file.lower()
            if ext.endswith(('.png', '.jpg', '.jpeg', '.aab', '.jks', '.keystore')):
                repair_file(os.path.join(root, file))

repair_file('tools/bundletool.jar')
repair_file('upload-keystore.jks')
repair_file('app-release-bundle.aab.bak')

# Scan assets
scan_and_repair('assets')
