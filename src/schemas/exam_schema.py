"""
SmartExamBuilder – JSON Schema Tanımları (Pydantic Modeller)

Soru, Rubrik, Critic Geri Bildirimi ve Değerlendirme Sonucu için
veri yapıları burada tanımlanır.
"""

from pydantic import BaseModel, Field
from typing import List
from enum import Enum


class QuestionType(str, Enum):
    OPEN_ENDED = "acik_uclu"
    MULTIPLE_CHOICE = "coktan_secmeli"


class DifficultyLevel(str, Enum):
    EASY = "kolay"
    MEDIUM = "orta"
    HARD = "zor"


class RubricCriteria(BaseModel):
    """Puanlama rubriği – 4 seviyeli değerlendirme kriterleri."""
    excellent: str = Field(description="Mükemmel cevap açıklaması (90-100 puan)")
    good: str = Field(description="İyi cevap açıklaması (70-89 puan)")
    satisfactory: str = Field(description="Yeterli cevap açıklaması (50-69 puan)")
    insufficient: str = Field(description="Yetersiz cevap açıklaması (0-49 puan)")
    max_points: int = Field(default=100, description="Bu soru için maksimum puan")


class Question(BaseModel):
    """Üretilen soru ve ona ait rubrik."""
    question_text: str = Field(description="Soru metni")
    question_type: QuestionType = Field(description="Soru türü")
    learning_outcome_id: int = Field(description="İlgili kazanım numarası (1-4)")
    difficulty: DifficultyLevel = Field(description="Zorluk seviyesi")
    expected_keywords: List[str] = Field(description="Cevapte beklenen anahtar kelimeler")
    rubric: RubricCriteria = Field(description="Puanlama rubriği")


class CriticFeedback(BaseModel):
    """Critic Agent'ın kalite değerlendirmesi."""
    quality_score: int = Field(description="Kalite puanı (1-10)", ge=1, le=10)
    is_approved: bool = Field(description="Soru onaylandı mı? (7+ ise True)")
    issues: List[str] = Field(default_factory=list, description="Tespit edilen sorunlar")
    suggestions: List[str] = Field(default_factory=list, description="İyileştirme önerileri")


class EvaluationResult(BaseModel):
    """Evaluator Agent'ın öğrenci cevabı üzerindeki değerlendirmesi."""
    question: Question
    student_answer: str
    score: int = Field(description="Öğrencinin aldığı puan (0-100)")
    grade_level: str = Field(description="Mükemmel / İyi / Yeterli / Yetersiz")
    feedback: str = Field(description="Detaylı yazılı geri bildirim")
    strong_points: List[str] = Field(description="Cevabın güçlü yönleri")
    improvement_areas: List[str] = Field(description="Geliştirilmesi gereken alanlar")
