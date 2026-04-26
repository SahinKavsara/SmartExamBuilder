import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import OutcomeSelector from "./components/OutcomeSelector";
import DifficultySelector from "./components/DifficultySelector";
import LoadingSpinner from "./components/LoadingSpinner";
import QuestionDisplay from "./components/QuestionDisplay";
import AnswerInput from "./components/AnswerInput";
import EvaluationResult from "./components/EvaluationResult";

import { fetchOutcomes, generateQuestion, evaluateAnswer, checkHealth } from "./api/examApi";

// ─── App States ──────────────────────────────────────────────
const STEPS = {
  SELECT_OUTCOME: 1,
  SELECT_DIFFICULTY: 2,
  VIEW_QUESTION: 3,
  WRITE_ANSWER: 4,
  VIEW_RESULT: 5,
};

export default function App() {
  // Data state
  const [categories, setCategories] = useState([]);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // UI state
  const [currentStep, setCurrentStep] = useState(STEPS.SELECT_OUTCOME);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAgent, setLoadingAgent] = useState("writer");
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  // ─── Load outcomes on mount ────────────────────────────────
  useEffect(() => {
    async function init() {
      const online = await checkHealth();
      setBackendOnline(online);

      if (online) {
        try {
          const data = await fetchOutcomes();
          setCategories(data.categories);
        } catch (err) {
          setError("Kazanımlar yüklenemedi: " + err.message);
        }
      }
    }
    init();
  }, []);

  // ─── Handlers ──────────────────────────────────────────────
  const handleOutcomeSelect = (outcome) => {
    setSelectedOutcome(outcome);
    setCurrentStep(STEPS.SELECT_DIFFICULTY);
    setError(null);
  };

  const handleDifficultySelect = async (difficulty) => {
    setSelectedDifficulty(difficulty);
    setIsLoading(true);
    setLoadingAgent("writer");
    setError(null);
    setCurrentStep(STEPS.VIEW_QUESTION);

    try {
      const data = await generateQuestion(selectedOutcome.id, difficulty);
      setQuestionData(data);
    } catch (err) {
      setError(err.message);
      setCurrentStep(STEPS.SELECT_DIFFICULTY);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (answer) => {
    setIsLoading(true);
    setLoadingAgent("evaluator");
    setError(null);
    setCurrentStep(STEPS.VIEW_RESULT);

    try {
      const result = await evaluateAnswer(questionData.question, answer);
      setEvaluationResult(result);
    } catch (err) {
      setError(err.message);
      setCurrentStep(STEPS.WRITE_ANSWER);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewExam = () => {
    setSelectedOutcome(null);
    setSelectedDifficulty(null);
    setQuestionData(null);
    setEvaluationResult(null);
    setError(null);
    setCurrentStep(STEPS.SELECT_OUTCOME);
  };

  const handleBackToOutcome = () => {
    setSelectedOutcome(null);
    setCurrentStep(STEPS.SELECT_OUTCOME);
    setError(null);
  };

  const handleBackToDifficulty = () => {
    setQuestionData(null);
    setCurrentStep(STEPS.SELECT_DIFFICULTY);
    setError(null);
  };

  const handleBackToQuestion = () => {
    setCurrentStep(STEPS.VIEW_QUESTION);
    setError(null);
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="app" id="smart-exam-app">
      <Header />

      {!backendOnline && (
        <div className="error-banner" id="error-backend-offline">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Backend bağlantısı kurulamadı</strong>
              <p>
                Lütfen Express.js sunucusunun çalıştığından emin olun:{" "}
                <code>cd backend &amp;&amp; npm start</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner" id="error-message">
          <div className="error-content">
            <span className="error-icon">❌</span>
            <div>
              <strong>Hata</strong>
              <p>{error}</p>
            </div>
            <button
              className="error-dismiss"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <StepIndicator currentStep={currentStep} />

      <main className="main-content">
        {/* Step 1: Outcome Selection */}
        {currentStep === STEPS.SELECT_OUTCOME && categories.length > 0 && (
          <OutcomeSelector
            categories={categories}
            onSelect={handleOutcomeSelect}
          />
        )}

        {/* Step 2: Difficulty Selection */}
        {currentStep === STEPS.SELECT_DIFFICULTY && selectedOutcome && (
          <DifficultySelector
            selectedOutcome={selectedOutcome}
            onSelect={handleDifficultySelect}
            onBack={handleBackToOutcome}
          />
        )}

        {/* Step 3: Question Display (or Loading) */}
        {currentStep === STEPS.VIEW_QUESTION && (
          isLoading ? (
            <LoadingSpinner agent="writer" />
          ) : (
            questionData && (
              <QuestionDisplay
                question={questionData.question}
                criticFeedback={questionData.critic_feedback}
                onContinue={() => setCurrentStep(STEPS.WRITE_ANSWER)}
                onBack={handleBackToDifficulty}
              />
            )
          )
        )}

        {/* Step 4: Answer Input */}
        {currentStep === STEPS.WRITE_ANSWER && questionData && (
          <AnswerInput
            question={questionData.question}
            onSubmit={handleAnswerSubmit}
            onBack={handleBackToQuestion}
          />
        )}

        {/* Step 5: Evaluation Result (or Loading) */}
        {currentStep === STEPS.VIEW_RESULT && (
          isLoading ? (
            <LoadingSpinner agent="evaluator" />
          ) : (
            evaluationResult && (
              <EvaluationResult
                result={evaluationResult}
                onNewExam={handleNewExam}
              />
            )
          )
        )}
      </main>
    </div>
  );
}
