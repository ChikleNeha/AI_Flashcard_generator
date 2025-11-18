
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import PromptTemplate
from langchain_ollama import ChatOllama


def get_ollama_llm():
    return ChatOllama(model="gemma3:1b",temperature=1.0)

async def generate_flashcards(study_material: str) -> str:
    llm = get_ollama_llm()
    prompt_template = PromptTemplate.from_template(
    "You are a flashcard generator. Given a study passage, respond with a JSON array of 5 flashcards. "
    "Each flashcard must have a 'question' and a non-empty 'answer' field, and the answer must be a factual response based ONLY on the provided study material. "
    "Do NOT generate empty fields, and do NOT return instructional text. Format the output strictly like this:\n"
    "[{{\"question\": \"...\", \"answer\": \"...\"}}, ...]\n\n"
    "Passage:\n{material}"
)

    prompt = prompt_template.format(material=study_material)
    system_msg = SystemMessage(content="Generate clear, simple flashcards.")
    user_msg = HumanMessage(content=prompt)
    response = await llm.agenerate([[system_msg, user_msg]])
    return response.generations[0][0].message.content


async def generate_mcq(study_material: str) -> str:
    llm = get_ollama_llm()
    prompt_template = PromptTemplate.from_template(
        "Generate 10 multiple-choice questions (MCQs) from the text below. Each MCQ should include the question, "
        "exactly 4 options labeled A, B, C, D, and indicate the correct option as the answer index (0-3). "
        "Format strictly in JSON:\n"
        "[ {{\"question\": \"...\", \"options\": [\"\", \"\", \"\", \"\"], \"answer_index\": 0 }}, ... ]\n\n"
        "Text:\n{material}"
    )
    prompt = prompt_template.format(material=study_material)
    system_msg = SystemMessage(content="Generate clear and precise multiple-choice questions.")
    user_msg = HumanMessage(content=prompt)
    response = await llm.agenerate([[system_msg, user_msg]])
    return response.generations[0][0].message.content
