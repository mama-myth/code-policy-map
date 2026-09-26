import requests
from urllib.request import urlopen

def fetch_url(target_url):
    # UNSAFE: Unvalidated Outbound Request / SSRF (SEC-NET-001)
    response = requests.get(target_url)
    res2 = urlopen(target_url)
    return response

def read_user_file(user_path):
    # UNSAFE: Unsanitized File Path Concatenation / Path Traversal (SEC-PTH-001)
    with open(f"/var/www/uploads/{user_path}") as f:
        return f.read()

def process_transaction():
    try:
        do_transaction()
    except Exception:
        # UNSAFE: Silent Exception Handling (SEC-LOG-003)
        pass
