from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class DeckCreate(BaseModel):
    title: str

class FlashcardOut(BaseModel):
    question: str
    answer: str

    class Config:
        orm_mode = True
