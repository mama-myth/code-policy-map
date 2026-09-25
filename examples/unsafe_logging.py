import logging

logger = logging.getLogger(__name__)

def login(username, password):
    # UNSAFE: Logging raw password credential
    print("User password:", password)
    logger.info("Login attempt for %s with password %s", username, password)
    logger.warning("Failed login attempt with token: %s", token)

def connect_api(api_key):
    # UNSAFE: Logging API key secret
    logging.error("Failed to connect using api_key: %s", api_key)
