from passlib.context import CryptContext
from sqlalchemy.orm import Session
from . import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    # Encode first to bytes, truncate to 72 bytes
    password_bytes = password.encode('utf-8')[:72]

    # Decode back safely to str ignoring partial multibyte chars
    safe_password = password_bytes.decode('utf-8', errors='ignore')

    # Hash the safely truncated password string
    return pwd_context.hash(safe_password)



def verify_password(plain_password: str, hashed: str) -> bool:
    return pwd_context.verify(plain_password, hashed)

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
