# from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, JSON
# from sqlalchemy.orm import relationship, declarative_base

# Base = declarative_base()

# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     hashed_password = Column(String, nullable=False)

#     # A user has many decks
#     decks = relationship("Deck", back_populates="user")
#     mcqs = relationship("MCQ", back_populates="user")
#     mcqs = relationship("MCQ", back_populates="deck")


# class Deck(Base):
#     __tablename__ = "decks"
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     # Relationship fields
#     user = relationship("User", back_populates="decks")
#     flashcards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")
#     mcqs = relationship("MCQ", back_populates="user")
#     mcqs = relationship("MCQ", back_populates="deck")


# class Flashcard(Base):
#     __tablename__ = "flashcards"
#     id = Column(Integer, primary_key=True, index=True)
#     question = Column(Text, nullable=False)
#     answer = Column(Text, nullable=False)
#     deck_id = Column(Integer, ForeignKey("decks.id"), nullable=False)

#     deck = relationship("Deck", back_populates="flashcards")

# class MCQ(Base):
#     __tablename__ = "mcqs"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     deck_id = Column(Integer, ForeignKey("decks.id"))
#     question = Column(String, nullable=False)
#     options = Column(JSON, nullable=False)
#     answer_index = Column(Integer, nullable=False)
#     user = relationship("User", back_populates="mcqs")
#     deck = relationship("Deck", back_populates="mcqs")


from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, JSON
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # One-to-many: User to Decks
    decks = relationship("Deck", back_populates="user")
    # One-to-many: User to MCQs
    mcqs = relationship("MCQ", back_populates="user")

class Deck(Base):
    __tablename__ = "decks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Many-to-one: Deck to User
    user = relationship("User", back_populates="decks")
    # One-to-many: Deck to Flashcards
    flashcards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")
    # One-to-many: Deck to MCQs
    mcqs = relationship("MCQ", back_populates="deck")

class Flashcard(Base):
    __tablename__ = "flashcards"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    deck_id = Column(Integer, ForeignKey("decks.id"), nullable=False)

    # Many-to-one: Flashcard to Deck
    deck = relationship("Deck", back_populates="flashcards")

class MCQ(Base):
    __tablename__ = "mcqs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    deck_id = Column(Integer, ForeignKey("decks.id"))
    question = Column(String, nullable=False)
    options = Column(JSON, nullable=False)
    answer_index = Column(Integer, nullable=False)

    # Many-to-one: MCQ to User and Deck
    user = relationship("User", back_populates="mcqs")
    deck = relationship("Deck", back_populates="mcqs")
