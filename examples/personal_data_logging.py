import logging

logger = logging.getLogger(__name__)

def update_user_profile(user):
    # UNSAFE: Logging raw email and phone personal data
    logger.info("Updating profile for email: %s", email)
    logging.warning("User phone number changed to %s", phone)
    print(user.email)
