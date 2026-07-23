from utils.auth import hash_password

print("Starting test")

try:
    hashed = hash_password("123456")
    print("Success:", hashed)
except Exception as e:
    print("Error:", e)