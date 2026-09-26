import hashlib

# UNSAFE: Hardcoded Secret Key (SEC-CRY-001)
api_key = "sk_live_1234567890abcdef12345"
jwt_secret = "my_super_secret_jwt_key_123"

def hash_data(user_data):
    # UNSAFE: Weak MD5 Cryptographic Hash (SEC-CRY-002)
    md5_hash = hashlib.md5(user_data.encode()).hexdigest()
    # UNSAFE: Weak SHA1 Cryptographic Hash (SEC-CRY-002)
    sha1_hash = hashlib.sha1(user_data.encode()).hexdigest()
    return md5_hash, sha1_hash
