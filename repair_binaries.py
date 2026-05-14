import os

def repair_file(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    
    with open(path, 'rb') as f:
        data = f.read()
    
    # Check if we have 0D 0A sequences
    if b'\r\n' in data:
        print(f"Found CRLF in {path}, attempting repair...")
        new_data = data.replace(b'\r\n', b'\n')
        with open(path + '.repaired', 'wb') as f:
            f.write(new_data)
        print(f"Repaired file saved to {path}.repaired")
    else:
        print(f"No CRLF found in {path}")

files_to_check = [
    'upload-keystore.jks',
    'android/latest_download/signing.keystore',
    'app-release-bundle.aab'
]

for f in files_to_check:
    repair_file(f)
