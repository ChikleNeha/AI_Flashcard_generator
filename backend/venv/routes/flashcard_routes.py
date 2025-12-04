# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# import re
# import json

# import schemas
# import crud
# import database
# import ollama_client
# from dependencies import get_current_user  # For auth dependency

# router = APIRouter()


# import re

# import re

# import re

# def strip_code_block_markers(text: str) -> str:
#     text = text.strip()
#     # Remove the starting ``` or ```
#     text = re.sub(r"^```(?:json)?\s*\n?", "", text, flags=re.IGNORECASE)
#     # Remove ending ```
#     text = re.sub(r"\n?```$", "", text)
#     return text


# def sanitize_json_string(json_str: str) -> str:
#     """
#     Remove or escape control characters that break JSON parsing.
#     """
#     json_str = json_str.replace('\n', '\\n').replace('\r', '\\r')
#     json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
#     return json_str


# def repair_json(json_str: str) -> str:
#     """
#     Fix common JSON issues like trailing commas before closing braces/brackets.
#     """
#     json_str = re.sub(r',\s*([}\]])', r'\1', json_str)
#     return json_str


# @router.post("/generate_flashcards", response_model=List[schemas.FlashcardOut])
# async def generate_flashcards(
#     email: str,
#     deck_title: str,
#     study_material: str,
#     db: Session = Depends(database.get_db)
# ):
#     user = crud.get_user_by_email(db, email)
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")

#     deck = crud.get_deck(db, user.id, deck_title)
#     if not deck:
#         deck = crud.create_deck(db, user.id, deck_title)
#         crud.commit_changes(db)

#     content = await ollama_client.generate_flashcards(study_material)
#     print("The content before : ", content)
#     content = strip_code_block_markers(content)
#     print("The content after strip : ", content)
#     # content = sanitize_json_string(content)
#     # print("The content after sanitize : ", content)

#     try:
#         flashcards_data = json.loads(content)
#     except json.JSONDecodeError as e:
#         raise HTTPException(status_code=500, detail=f"Failed to parse flashcard JSON: {e}")

#     flashcards = []
#     for card in flashcards_data:
#         question = card.get("question", "").strip()
#         answer = card.get("answer", "").strip()
#         if question and answer:
#             crud.create_flashcard(db, deck.id, question, answer)
#             flashcards.append({"question": question, "answer": answer})

#     crud.commit_changes(db)
#     return flashcards


# class MCQOut(schemas.BaseModel):
#     question: str
#     options: List[str]
#     answer_index: int


# @router.post("/generate_mcq", response_model=List[MCQOut])
# async def generate_mcq_endpoint(
#     email: str,
#     deck_title: str,
#     study_material: str,
#     db: Session = Depends(database.get_db),
# ):
#     user = crud.get_user_by_email(db, email)
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")

#     deck = crud.get_deck(db, user.id, deck_title)
#     if not deck:
#         deck = crud.create_deck(db, user.id, deck_title)
#         crud.commit_changes(db)

#     prompt = (
#         "Generate 10 multiple-choice questions (MCQs) from the text below. Each MCQ must include:\n"
#         "- the question string\n"
#         "- exactly 4 answer options as strings (no letter prefixes like \"A. \", just plain text)\n"
#         "- the index (0-3) of the correct option in the 'answer_index' field, which indicates the correct answer\n\n"
#         "Respond with strictly valid JSON ONLY, in this format:\n\n"
#         "[\n"
#         "  {\n"
#         "    \"question\": \"Example question?\",\n"
#         "    \"options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"],\n"
#         "    \"answer_index\": 0\n"
#         "  },\n"
#         "  ...\n"
#         "]\n\n"
#         "Do not include any text outside the JSON or formatting characters such as triple backticks.\n"
#         f"Study material:\n{study_material}"
#     )

#     raw_content = await ollama_client.generate_mcq(prompt)
#     content = strip_code_block_markers(raw_content)
#     content = sanitize_json_string(content)
#     content = repair_json(content)

#     if not content.strip():
#         raise HTTPException(status_code=500, detail="Empty JSON response from LLM")

#     try:
#         mcqs_data = json.loads(content)
#     except json.JSONDecodeError as e:
#         raise HTTPException(status_code=500, detail=f"Failed to parse MCQs JSON: {e}")

#     mcqs = []
#     for mcq in mcqs_data:
#         db_mcq = crud.create_mcq(
#             db=db,
#             user_id=user.id,
#             deck_id=deck.id,
#             question=mcq["question"],
#             options=mcq["options"],
#             answer_index=mcq["answer_index"]
#         )
#         mcqs.append({
#             "question": db_mcq.question,
#             "options": db_mcq.options,
#             "answer_index": db_mcq.answer_index
#         })

#     crud.commit_changes(db)
#     return mcqs


# @router.get("/flashcards/{email}/{deck_title}", response_model=List[schemas.FlashcardOut])
# def get_flashcards(email: str, deck_title: str, db: Session = Depends(database.get_db)):
#     user = crud.get_user_by_email(db, email)
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")

#     deck = crud.get_deck(db, user.id, deck_title)
#     if not deck:
#         raise HTTPException(status_code=404, detail="Deck not found")

#     return deck.flashcards


# @router.get("/api/profile")
# def get_profile(current_user=Depends(get_current_user)):
#     # Example placeholder data; update as needed
#     decks_count = 3
#     mcqs_count = 5
#     cards_mastered = 12
#     progress = [2, 4, 7, 10, 12]

#     return {
#         "id": current_user.id,
#         "email": current_user.email,
#         "decks_count": decks_count,
#         "mcqs_count": mcqs_count,
#         "cards_mastered": cards_mastered,
#         "progress": progress
#     }


# @router.get("/deck/{deck_id}", response_model=List[schemas.FlashcardOut])
# def read_flashcards_by_deck(deck_id: int, db: Session = Depends(database.get_db)):
#     flashcards = db.query(crud.models.Flashcard).filter_by(deck_id=deck_id).all()
#     return flashcards


from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import re
import json
import io
import os
import pandas as pd
from PyPDF2 import PdfReader
import docx  # python-docx

import schemas
import crud
import database
import ollama_client
from dependencies import get_current_user  # For auth dependency

router = APIRouter()

# Utility functions to clean and parse model JSON responses

def strip_code_block_markers(text: str) -> str:
    text = text.strip()
    # Remove the starting ``` or ```
    text = re.sub(r"^```(?:json)?\s*\n?", "", text, flags=re.IGNORECASE)
    # Remove ending ```
    text = re.sub(r"\n?```$", "", text)
    return text

def sanitize_json_string(json_str: str) -> str:
    json_str = json_str.replace('\n', '\\n').replace('\r', '\\r')
    json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
    return json_str

def repair_json(json_str: str) -> str:
    json_str = re.sub(r',\s*([}\]])', r'\1', json_str)
    return json_str

# --- New: Extract text from uploaded files ---

def extract_text_from_file(file: UploadFile) -> str:
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()

    content = file.file.read()

    if ext == ".pdf":
        pdf_reader = PdfReader(io.BytesIO(content))
        pages = [page.extract_text() or "" for page in pdf_reader.pages]
        text = "\n".join(pages)
        return text.strip()

    elif ext == ".docx":
        doc = docx.Document(io.BytesIO(content))
        paragraphs = [p.text for p in doc.paragraphs]
        return "\n".join(paragraphs).strip()

    elif ext == ".txt":
        return content.decode("utf-8", errors="ignore").strip()

    elif ext == ".xlsx":
        excel_file = io.BytesIO(content)
        xls = pd.ExcelFile(excel_file)
        parts = []
        for sheet_name in xls.sheet_names:
            df = xls.parse(sheet_name)
            parts.append(f"Sheet: {sheet_name}")
            parts.append(df.to_string(index=False))
        return "\n\n".join(parts).strip()

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Use PDF, DOCX, TXT, or XLSX."
        )

# --- Core shared helper to generate flashcards from text ---

async def generate_flashcards_from_text(
    db: Session,
    email: str,
    deck_title: str,
    study_material: str,
):
    if not study_material.strip():
        raise HTTPException(status_code=400, detail="Empty study material")

    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    deck = crud.get_deck(db, user.id, deck_title)
    if not deck:
        deck = crud.create_deck(db, user.id, deck_title)
        crud.commit_changes(db)

    content = await ollama_client.generate_flashcards(study_material)
    content = strip_code_block_markers(content)

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

# --- Existing text-based endpoint ---

@router.post("/generate_flashcards", response_model=List[schemas.FlashcardOut])
async def generate_flashcards(
    email: str,
    deck_title: str,
    study_material: str,
    db: Session = Depends(database.get_db),
):
    return await generate_flashcards_from_text(db, email, deck_title, study_material)

# --- New file upload endpoint ---

@router.post("/generate_from_file", response_model=List[schemas.FlashcardOut])
async def generate_flashcards_from_file(
    email: str = Form(...),
    deck_title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
):
    text = extract_text_from_file(file)
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    return await generate_flashcards_from_text(db, email, deck_title, text)

# --- Existing MCQ generation, flashcard retrieval, and profile endpoints ---


class MCQOut(schemas.BaseModel):
    question: str
    options: List[str]
    answer_index: int


@router.post("/generate_mcq", response_model=List[MCQOut])
async def generate_mcq_endpoint(
    email: str,
    deck_title: str,
    study_material: str,
    db: Session = Depends(database.get_db),
):
    # Find user by email or create anonymous user on the fly
    user = crud.get_user_by_email(db, email)
    if not user:
        user = crud.create_user(db, email=email, hashed_password="anonymous")
        crud.commit_changes(db)

    # Find or create deck
    deck = crud.get_deck(db, user.id, deck_title)
    if not deck:
        deck = crud.create_deck(db, user.id, deck_title)
        crud.commit_changes(db)

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
    content = repair_json(content)

    if not content.strip():
        raise HTTPException(status_code=500, detail="Empty JSON response from LLM")

    try:
        mcqs_data = json.loads(content)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse MCQs JSON: {e}")

    mcqs = []
    for mcq in mcqs_data:
        # Create MCQs in DB if you want (optional), or skip persistence for anon users
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

# Add this new endpoint after the existing file upload endpoint

@router.post("/generate_mcq_from_file", response_model=List[MCQOut])
async def generate_mcq_from_file(
    email: str = Form(...),
    deck_title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
):
    """
    Extract text from uploaded file and generate MCQs, just like generate_from_file but for MCQs.
    """
    # Extract text from file (reuse existing function)
    text = extract_text_from_file(file)
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    # Find/create user and deck
    user = crud.get_user_by_email(db, email)
    if not user:
        user = crud.create_user(db, email=email, hashed_password="anonymous")
        crud.commit_changes(db)

    deck = crud.get_deck(db, user.id, deck_title)
    if not deck:
        deck = crud.create_deck(db, user.id, deck_title)
        crud.commit_changes(db)

    # Same MCQ generation prompt as existing endpoint
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
        f"Study material:\n{text}"
    )

    # Generate MCQs using your existing Ollama client
    raw_content = await ollama_client.generate_mcq(prompt)
    content = strip_code_block_markers(raw_content)
    content = repair_json(content)

    if not content.strip():
        raise HTTPException(status_code=500, detail="Empty JSON response from LLM")

    try:
        mcqs_data = json.loads(content)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse MCQs JSON: {e}")

    # Create MCQs in database and return
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


@router.get("/flashcards/{email}/{deck_title}", response_model=List[schemas.FlashcardOut])
def get_flashcards(email: str, deck_title: str, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    deck = crud.get_deck(db, user.id, deck_title)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    return deck.flashcards


@router.get("/api/profile")
def get_profile(current_user=Depends(get_current_user)):
    decks_count = 3
    mcqs_count = 5
    cards_mastered = 12
    progress = [2, 4, 7, 10, 12]

    # profile_pic_filename = getattr(current_user, "profile_pic_filename", None)
    # if profile_pic_filename ? profile_pic_filename : "avatar.png"
    profile_pic_filename = "avatar.png"

    return {
    "id": current_user.id,
    "email": current_user.email,
    "decks_count": decks_count,
    "mcqs_count": mcqs_count,
    "cards_mastered": cards_mastered,
    "progress": progress,
    "profile_pic_filename": profile_pic_filename,  # <- important
}



@router.get("/deck/{deck_id}", response_model=List[schemas.FlashcardOut])
def read_flashcards_by_deck(deck_id: int, db: Session = Depends(database.get_db)):
    flashcards = db.query(crud.models.Flashcard).filter_by(deck_id=deck_id).all()
    return flashcards
