"""
SmartExamBuilder – Evaluator Agent

Öğrencinin cevabını, üretilen sorunun rubriğine göre değerlendirir.
GPT-4o-mini kullanarak puan, not kademesi ve detaylı geri bildirim üretir.
"""

import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from src.schemas.exam_schema import Question, EvaluationResult


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


EVALUATOR_SYSTEM = (
    "Sen bir eğitim değerlendirme uzmanısın. Öğrencinin verdiği cevabı, "
    "sorunun puanlama rubriğine göre adil ve detaylı biçimde değerlendiriyorsun.\n\n"
    "Değerlendirirken:\n"
    "- Rubriği tam olarak uygula\n"
    "- Beklenen anahtar kelimelerin cevaba yansımasına bak\n"
    "- Öğrencinin anladığı ve anlamadığı yönleri analiz et\n"
    "- Yapıcı ve motive edici bir dil kullan\n\n"
    "SADECE aşağıdaki JSON formatında yanıt ver:\n\n"
    "{\n"
    '  "score": 75,\n'
    '  "grade_level": "İyi",\n'
    '  "feedback": "Detaylı geri bildirim metni (Türkçe)",\n'
    '  "strong_points": ["güçlü yön 1", "güçlü yön 2"],\n'
    '  "improvement_areas": ["geliştirilecek alan 1"]\n'
    "}\n\n"
    # Değerlendirme kriterlerinin (skorlama aralıkları) LLM'e belirtildiği kısım
    "Puan-Kademe eşleşmesi: 90-100→Mükemmel | 70-89→İyi | 50-69→Yeterli | 0-49→Yetersiz"
)


def evaluate_student_answer(question: Question, student_answer: str) -> EvaluationResult:
    """
    Öğrencinin cevabını rubriğe göre puanlar.

    Args:
        question:       Üretilen ve onaylanan soru
        student_answer: Öğrencinin yazdığı cevap metni

    Returns:
        EvaluationResult – puan, kademe, geri bildirim, güçlü/zayıf yönler
    """
    llm = ChatOpenAI(
        model="local-model", # LM Studio'da yüklü olan modeli kullanır
        temperature=0.2,
        base_url="http://localhost:1234/v1",
        api_key="lm-studio"
    )

    human_msg = (
        f"SORU: {question.question_text}\n\n"
        f"BEKLENEN ANAHTAR KELİMELER: {', '.join(question.expected_keywords)}\n\n"
        "PUANLAMA RUBRİĞİ:\n"
        f"  • Mükemmel (90-100): {question.rubric.excellent}\n"
        f"  • İyi      (70-89):  {question.rubric.good}\n"
        f"  • Yeterli  (50-69):  {question.rubric.satisfactory}\n"
        f"  • Yetersiz  (0-49):  {question.rubric.insufficient}\n\n"
        f"ÖĞRENCİNİN CEVABI:\n{student_answer}\n\n"
        "Bu cevabı değerlendir ve JSON formatında döndür."
    )

    # LLM, öğrencinin cevabını rubriğe göre puanlaması ve geri bildirim vermesi için çağrılır
    response = llm.invoke([
        SystemMessage(content=EVALUATOR_SYSTEM),
        HumanMessage(content=human_msg),
    ])

    data = _extract_json(response.content)

    score = int(data.get("score", 0))
    if score >= 90:
        grade = "Mükemmel"
    elif score >= 70:
        grade = "İyi"
    elif score >= 50:
        grade = "Yeterli"
    else:
        grade = "Yetersiz"

    return EvaluationResult(
        question=question,
        student_answer=student_answer,
        score=score,
        grade_level=grade,
        feedback=data.get("feedback", ""),
        strong_points=data.get("strong_points", []),
        improvement_areas=data.get("improvement_areas", []),
    )
