from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import init_db
from routes import user_routes, flashcard_routes
from ollama_client import get_ollama_llm  # Import the proper function

# Placeholder for your Ollama LLM model instance
llm_model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global llm_model
    print("Starting up application and loading Ollama Gemma3 model...")
    llm_model = get_ollama_llm()  # Proper model load here

    # Initialize the database tables
    init_db()

    yield  # Application runs after this point

    print("Shutting down application and cleaning up resources...")
    llm_model = None  # Release model resources if needed

app = FastAPI(title="AI Flashcard Generator", lifespan=lifespan, debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router, prefix="/users", tags=["users"])
app.include_router(flashcard_routes.router, prefix="/flashcards", tags=["flashcards"])
# app.include_router(profile_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Flashcard Generator API"}
