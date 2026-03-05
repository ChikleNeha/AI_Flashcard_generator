# AI Flashcard Generator

**AI Flashcard Generator** is an intelligent web app that automatically creates flashcards from study notes, PDFs, or text input using local AI models. Perfect for students optimizing learning through spaced repetition - generates questions, answers, and examples with one click.



## 🚀 Features

- **Smart Question Generation**: AI extracts key concepts and generates multiple-choice, and short-answer flashcards from any text
- **PDF Processing**: Upload study materials - auto-extracts content and creates flashcards
- **Customizable Formats**: Control difficulty, question types, and card styling
- **Local-First**: Runs entirely offline with Ollama LLMs (no API costs)
- **Batch Processing**: Convert entire lecture notes into flashcards instantly

## 🛠 Tech Stack

| Frontend | Backend | AI/ML | Export |
|----------|---------|-------|--------|
| React.js, TailwindCSS, Vite | FastAPI, Pydantic | Ollama (llama3.2), LangChain | Anki `.apkg` format |

## 🎯 Demo Workflow

```
1. Upload notes/PDF → "Photosynthesis uses chlorophyll to convert light → sugar"
↓
2. AI Processing → Generates:
   - Q: What pigment does photosynthesis use? → A: Chlorophyll
   - Q: Chlorophyll converts light into __ → A: sugar
   - Example cards with diagrams
↓
3. Preview & Edit → Download Anki deck
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+, Node.js 18+
- Ollama with `llama3.2`: `ollama pull llama3.2`

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add Ollama URL if custom
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### First Run
```
Backend: http://localhost:8000
Frontend: http://localhost:5173
Upload text → Generate → Download Anki deck!
```


## 📱 Usage Examples

**Input:** "React uses virtual DOM for efficient updates by diffing changes"
**Output Flashcards:**
```
Q: What does React use for efficient UI updates?
A: Virtual DOM

Q: Virtual DOM works by __ changes
A: diffing

Q: Fill in: React uses Virtual ___ for performance
A: DOM
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-question-type`
3. Commit changes: `git commit -m 'Add cloze deletion support'`
4. Push: `git push origin feature/new-question-type`
5. Open Pull Request


## 👥 Acknowledgments

- Built by Neha Chikle for efficient semester exam preparation
- Powered by [Ollama](https://ollama.com) for local AI processing
- [GitHub](https://github.com/ChikleNeha) | [LinkedIn](https://linkedin.com/in/neha-chikle)

***

*Transform your notes into decks 10x faster!* 🚀
