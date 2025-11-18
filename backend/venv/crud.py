from sqlalchemy.orm import Session
from . import models

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, email: str, hashed_password: str):
    user = models.User(email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_deck(db: Session, user_id: int, title: str):
    return db.query(models.Deck).filter(models.Deck.user_id == user_id, models.Deck.title == title).first()

def create_deck(db: Session, user_id: int, title: str):
    deck = models.Deck(user_id=user_id, title=title)
    db.add(deck)
    db.commit()
    db.refresh(deck)
    return deck

def create_flashcard(db: Session, deck_id: int, question: str, answer: str):
    card = models.Flashcard(deck_id=deck_id, question=question, answer=answer)
    db.add(card)
    return card


def create_mcq(db, user_id, deck_id, question, options, answer_index):
    mcq = models.MCQ(
        user_id=user_id,
        deck_id=deck_id,
        question=question,
        options=options,
        answer_index=answer_index
    )
    db.add(mcq)
    db.commit()
    db.refresh(mcq)
    return mcq


def commit_changes(db: Session):
    db.commit()
