from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from venv import schemas, crud, database, ollama_client, models  # Adjust to your project imports
from pydantic import BaseModel
import json
import re


router = APIRouter()


def strip_code_block_markers(text: str) -> str:
    """
    Remove ``` or ```
    """
    text = text.strip()
    # Remove leading ```json or ```
    text = re.sub(r"^```(?:json)?\s*", "", text)
    # Remove trailing ```
    text = re.sub(r"\s*```$", "", text)
    return text


def sanitize_json_string(json_str: str) -> str:
    """
    Sanitize JSON string from LLM by escaping or removing invalid control chars.
    """
    # Escape newlines and carriage returns inside strings
    json_str = json_str.replace('\n', '\\n').replace('\r', '\\r')
    # Remove other control characters that break JSON parsing
    json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
    return json_str


@router.post("/generate_flashcards", response_model=List[schemas.FlashcardOut])
async def generate_flashcards(email: str, deck_title: str, study_material: str, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    deck = crud.get_deck(db, user.id, deck_title)
    if not deck:
        deck = crud.create_deck(db, user.id, deck_title)

    content = await ollama_client.generate_flashcards(study_material)
    content = strip_code_block_markers(content)
    content = sanitize_json_string(content)

    try:
        flashcards_data = json.loads(content)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse flashcard JSON: {e}")

    flashcards = []
    for card in flashcards_data:
        question = card.get("question", "").strip()
        answer = card.get("answer", "").strip()
        if question and answer:
            crud.create_flashcard(db, deck.id, question, answer)
            flashcards.append({"question": question, "answer": answer})
    crud.commit_changes(db)
    return flashcards


@router.get("/flashcards/{email}/{deck_title}", response_model=List[schemas.FlashcardOut])
def get_flashcards(email: str, deck_title: str, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    deck = crud.get_deck(db, user.id, deck_title)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    return deck.flashcards

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import json
import re

from venv import schemas, crud, database, ollama_client  # Adjust imports as needed

class MCQOut(BaseModel):
    question: str
    options: List[str]
    answer_index: int

def strip_code_block_markers(text: str) -> str:
    """
    Remove ``` or ```
    """
    text = text.strip()
    # Remove leading ``` or ```
    text = re.sub(r"^```(?:json)?\s*", "", text)
    # Remove trailing ```
    text = re.sub(r"\s*```$", "", text)
    return text


def sanitize_json_string(json_str: str) -> str:
    """
    Sanitize JSON string from LLM by escaping/removing problematic characters.
    """
    json_str = json_str.replace('\n', '\\n').replace('\r', '\\r')
    json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
    return json_str

@router.post("/generate_mcq", response_model=List[MCQOut])
async def generate_mcq(
    email: str,
    deck_title: str,
    study_material: str,
    db: Session = Depends(database.get_db)
):
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    deck = crud.get_deck(db, user.id, deck_title)
    if not deck:
        deck = crud.create_deck(db, user.id, deck_title)

    prompt = (
        "Generate 10 multiple-choice questions (MCQs) from the text below. Each MCQ must include:\n"
        "- the question string\n"
        "- exactly 4 answer options as strings (no letter prefixes like \"A. \", just plain text)\n"
        "- the index (0-3) of the correct option in the 'answer_index' field, which indicates the correct answer\n\n"
        "Respond with strictly valid JSON ONLY, in this format:\n\n"
        "[\n"
        "  {\n"
        "    \"question\": \"Example question?\",\n"
        "    \"options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"],\n"
        "    \"answer_index\": 0\n"
        "  },\n"
        "  ...\n"
        "]\n\n"
        "Do not include any text outside the JSON or formatting characters such as triple backticks.\n"
        f"Study material:\n{study_material}"
    )

    raw_content = await ollama_client.generate_mcq(prompt)
    content = strip_code_block_markers(raw_content)
    content = sanitize_json_string(content)
    print(f"LLM response content: {content}")

    if not content.strip():
        raise HTTPException(status_code=500, detail="Empty JSON response from LLM")

    try:
        mcqs_data = json.loads(content)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse MCQs JSON: {e}")

    mcqs = []
    for mcq in mcqs_data:
        db_mcq = crud.create_mcq(
            db=db,
            user_id=user.id,
            deck_id=deck.id,
            question=mcq["question"],
            options=mcq["options"],
            answer_index=mcq["answer_index"]
        )
        mcqs.append({
            "question": db_mcq.question,
            "options": db_mcq.options,
            "answer_index": db_mcq.answer_index
        })
    crud.commit_changes(db)
    return mcqs



# from fastapi import APIRouter, Depends
from dependencies import get_current_user


@router.get("/api/profile")
def get_profile(current_user = Depends(get_current_user)):
    # Dummy values for testing
    decks_count = 3
    mcqs_count = 5
    cards_mastered = 12

    progress = [2, 4, 7, 10, 12]  # Example - adjust to frontend needs

    return {
        "id": current_user.id,
        "email": current_user.email,
        "decks_count": decks_count,
        "mcqs_count": mcqs_count,
        "cards_mastered": cards_mastered,
        "progress": progress
    }
