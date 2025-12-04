from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import shutil
import os
from venv import schemas, crud, auth, database
from passlib.context import CryptContext
import re
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

UPLOAD_DIR = "static/profile_pics"
os.makedirs(UPLOAD_DIR, exist_ok=True)

from fastapi import UploadFile
import os
import shutil

@router.post("/signup")
async def signup(
    email: str = Form(...),
    password: str = Form(...),
    profile_picture: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # Ensure directory exists
    upload_path = "static/profile_pics"
    os.makedirs(upload_path, exist_ok=True)

    

    def secure_filename(filename):
        filename = os.path.basename(filename)  # Remove path info
        filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)  # only allow safe chars
        return filename

    filename = secure_filename(profile_picture.filename)
    file_location = os.path.join(upload_path, filename)


    # Save file to disk
    # file_location = os.path.join(upload_path, profile_picture.filename)
    print(f"Saving upload to: {file_location}")
    print(f"Uploaded file original filename: {profile_picture.filename}")
    if os.path.isfile(file_location):
        print("File saved successfully")
    else:
        print("File not saved!")
    
    print(f"Absolute save path: {os.path.abspath(file_location)}")



    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(profile_picture.file, buffer)

    # Continue with hashing password and user creation
    hashed_password = auth.get_password_hash(password)
    user = crud.create_user(
        db,
        email=email,
        hashed_password=hashed_password,
        profile_pic_filename=profile_picture.filename,
        )
    print("Created user profile_pic_filename:", user.profile_pic_filename)
            

    return {"msg": "User created successfully"}

@router.post("/login")
def login(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, user_in.email)
    if not user or not pwd_context.verify(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    # Token-based auth recommended here
    return {"msg": "Login successful"}
