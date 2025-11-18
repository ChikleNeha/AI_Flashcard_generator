from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from venv import schemas, crud, auth, database
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


router = APIRouter()

@router.post("/signup")
def signup(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    print(f"Original password length: {len(user_in.password)}")
    hashed_password = auth.get_password_hash(user_in.password)
    print(f"Hashed password: {hashed_password}")

    user = crud.create_user(db, user_in.email, hashed_password)
    return {"msg": "User created successfully"}

@router.post("/login")
def login(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, user_in.email)
    if not user or not pwd_context.verify(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Return simple success message or JWT token here (token implementation recommended)
    return {"msg": "Login successful"}
