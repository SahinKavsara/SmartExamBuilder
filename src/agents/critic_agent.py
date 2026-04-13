"""
SmartExamBuilder – Critic Agent

Writer Agent'ın ürettiği soruyu kalite açısından değerlendirir.
Puan 7'nin altındaysa onaylamaz → Writer'ın yeniden üretmesi tetiklenir.
"""

import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from src.schemas.exam_schema import Question, CriticFeedback


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


CRITIC_SYSTEM = (
    "Sen sınav kalitesi konusunda uzman bir eğitim değerlendirmecisisin.\n"
    "Sana verilen sınav sorusunu ve rubriğini aşağıdaki kriterlere göre eleştirel biçimde değerlendir:\n\n"
    "1. Soru, kazanımı doğrudan ve tam olarak ölçüyor mu?\n"
    "2. Soru metni açık, anlaşılır ve tek yorumlu mu?\n"
    "3. Rubrik somut, ölçülebilir kriterler içeriyor mu?\n"
    "4. Beklenen anahtar kelimeler kazanımla gerçekten ilgili mi?\n"
    "5. Zorluk seviyesi soruya yansımış mı?\n\n"
    "SADECE aşağıdaki JSON formatında yanıt ver:\n\n"
    '{\n'
    '  "quality_score": 7,\n'
    '  "is_approved": true,\n'
    '  "issues": ["sorun varsa yaz", "yoksa boş bırak"],\n'
    '  "suggestions": ["öneri varsa yaz"]\n'
    '}\n\n'
    "Not: quality_score 7 ve üzeriyse is_approved true olmalı."
)


def evaluate_question(question: Question) -> CriticFeedback:
    """
    Verilen soruyu kalite açısından değerlendirir.

    Args:
        question: Writer Agent'tan gelen Question nesnesi

    Returns:
        CriticFeedback – kalite puanı, onay durumu, sorunlar ve öneriler
    """
    llm = ChatOpenAI(
        model="local-model", # LM Studio'da yüklü olan modeli kullanır
        temperature=0.3,
        base_url="http://localhost:1234/v1",
        api_key="lm-studio"
    )

    human_msg = (
        f"SORU METNİ:\n{question.question_text}\n\n"
        f"ZORLUK SEVİYESİ: {question.difficulty.value}\n"
        f"KAZANIM NO: #{question.learning_outcome_id}\n"
        f"BEKLENEN ANAHTAR KELİMELER: {', '.join(question.expected_keywords)}\n\n"
        "RUBRİK:\n"
        f"  • Mükemmel (90-100): {question.rubric.excellent}\n"
        f"  • İyi      (70-89):  {question.rubric.good}\n"
        f"  • Yeterli  (50-69):  {question.rubric.satisfactory}\n"
        f"  • Yetersiz  (0-49):  {question.rubric.insufficient}\n\n"
        "Bu soruyu değerlendir."
    )

    response = llm.invoke([
        SystemMessage(content=CRITIC_SYSTEM),
        HumanMessage(content=human_msg),
    ])

    data = _extract_json(response.content)

    quality_score = int(data.get("quality_score", 5))
    is_approved = quality_score >= 7  # LLM'e güvenme, hesapla

    return CriticFeedback(
        quality_score=quality_score,
        is_approved=is_approved,
        issues=data.get("issues", []),
        suggestions=data.get("suggestions", []),
    )
