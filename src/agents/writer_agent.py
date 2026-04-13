"""
SmartExamBuilder – Writer Agent

Ders kazanımı ve RAG bağlamını alarak GPT-4o-mini ile
açık uçlu sınav sorusu ve puanlama rubriği üretir.
"""

import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from src.schemas.exam_schema import (
    Question, QuestionType, DifficultyLevel, RubricCriteria
)
from src.rag.retriever import retrieve_context


def _extract_json(text: str) -> dict:
    """LLM çıktısından JSON bloğunu güvenli şekilde çıkarır."""
    text = text.strip()
    if "```" in text:
        parts = text.split("```")
        for i, part in enumerate(parts):
            if i % 2 == 1:
                content = part.lstrip("json").strip()
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    continue
    return json.loads(text)


def _build_system_prompt(outcome_id: int, difficulty: str) -> str:
    return (
        "Sen deneyimli bir eğitim uzmanısın. Verilen ders kazanımına ve bağlamına göre "
        "yüksek kaliteli, Türkçe açık uçlu bir sınav sorusu ve detaylı puanlama rubriği üretiyorsun.\n\n"
        "SADECE aşağıdaki JSON yapısında yanıt ver, başka hiçbir şey yazma:\n\n"
        "{\n"
        '  "question_text": "Soru metni buraya (Türkçe, açık ve anlaşılır)",\n'
        '  "question_type": "acik_uclu",\n'
        f'  "learning_outcome_id": {outcome_id},\n'
        f'  "difficulty": "{difficulty}",\n'
        '  "expected_keywords": ["anahtar1", "anahtar2", "anahtar3", "anahtar4"],\n'
        '  "rubric": {\n'
        '    "excellent": "Mükemmel cevabın ne içermesi gerektiğinin açıklaması (90-100 puan)",\n'
        '    "good": "İyi cevabın ne içermesi gerektiğinin açıklaması (70-89 puan)",\n'
        '    "satisfactory": "Yeterli cevabın ne içermesi gerektiğinin açıklaması (50-69 puan)",\n'
        '    "insufficient": "Yetersiz cevabın tanımı (0-49 puan)",\n'
        '    "max_points": 100\n'
        "  }\n"
        "}\n\n"
        "Önemli kurallar:\n"
        "- Soru doğrudan kazanımı ölçmeli\n"
        "- Rubrik somut ve ölçülebilir kriterler içermeli\n"
        "- Beklenen anahtar kelimeler teknik ve anlamlı olmalı\n"
        "- Zorluk seviyesine uygun bir derinlik kullan"
    )


def generate_question(
    learning_outcome: str,
    outcome_id: int,
    difficulty: str = "orta"
) -> Question:
    """
    Verilen kazanım için Writer Agent'ı kullanarak soru üretir.

    Args:
        learning_outcome: Ders kazanımı metni
        outcome_id:       Kazanım numarası (1-4)
        difficulty:       Zorluk seviyesi ('kolay', 'orta', 'zor')

    Returns:
        Oluşturulan Question nesnesi
    """
    llm = ChatOpenAI(
        model="local-model", # LM Studio'da yüklü olan modeli kullanır
        temperature=0.7,
        base_url="http://localhost:1234/v1",
        api_key="lm-studio"
    )

    # RAG'dan ilgili bağlamı çek
    context = retrieve_context(learning_outcome, k=3)

    system_msg = _build_system_prompt(outcome_id, difficulty)
    human_msg = (
        f"Ders Bağlamı (RAG'dan çekildi):\n{context}\n\n"
        f"Kazanım: {learning_outcome}\n"
        f"Zorluk: {difficulty}\n\n"
        "Bu kazanıma uygun bir soru ve rubrik üret."
    )

    messages = [
        SystemMessage(content=system_msg),
        HumanMessage(content=human_msg),
    ]

    response = llm.invoke(messages)
    data = _extract_json(response.content)

    # Enum alanlarını güvenli şekilde dönüştür (küçük modeller geçersiz değer üretebilir)
    try:
        q_type = QuestionType(data.get("question_type", "acik_uclu"))
    except ValueError:
        q_type = QuestionType.OPEN_ENDED

    try:
        diff_level = DifficultyLevel(data.get("difficulty", difficulty))
    except ValueError:
        diff_level = DifficultyLevel(difficulty)

    return Question(
        question_text=data["question_text"],
        question_type=q_type,
        learning_outcome_id=data.get("learning_outcome_id", outcome_id),
        difficulty=diff_level,
        expected_keywords=data.get("expected_keywords", []),
        rubric=RubricCriteria(**data["rubric"]),
    )
