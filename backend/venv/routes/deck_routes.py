from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from models import Deck  # Your SQLAlchemy model
from database import get_db  # Your DB session dependency

router = APIRouter(
    prefix="/decks",
    tags=["decks"],
)

class DeckOut(BaseModel):
    id: int
    title: str

    class Config:
        orm_mode = True

@router.get("/", response_model=List[DeckOut])
def read_decks(db: Session = Depends(get_db)):
    decks = db.query(Deck).all()
    return decks
