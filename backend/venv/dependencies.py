def get_current_user():
    class DummyUser:
        id = 1
        email = "testuser@example.com"
        hashed_password = "notasecret"
    return DummyUser()
