import { useState } from "react";
import ResultsModal from "../components/ResultsModal";

const QUESTIONS = [
  {
    q: "What does EQ stand for?",
    options: [
      "Equalizer",
      "Equal Quality",
      "Electronic Quantizer",
      "Echo Quality",
    ],
    answer: 0,
  },
  {
    q: "What is a DAW",
    options: [
      "Digital Audio Workstation",
      "Dynamic Audio Wave",
      "Direct Audio Writer",
      "Digital Audio Wave",
    ],
    answer: 0,
  },
  {
    q: "What does BPM stand for",
    options: [
      "Beats Per Minute",
      "Bass Per Mix",
      "Beat Pattern Mode",
      "Bounce Per Master",
    ],
    answer: 0,
  },
  {
    q: "What is sidechain compression?",
    options: [
      "Compression triggered by another signal",
      "Compressing only the bass",
      "A type of reverb",
      "Compressing the master bus",
    ],
    answer: 0,
  },
  {
    q: "What is a VST?",
    options: [
      "Virtual Studio Technology",
      "Volume Stereo Track",
      "Virtual Sound Tool",
      "Variable Studio Tone",
    ],
    answer: 0,
  },
];

export default function ProductionQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(null);

  const accuracyScore = Math.round((correct / QUESTIONS.length) * 100);

  const handleAnswer = (index) => {
    setAnswered(index);
    if (index === QUESTIONS[currentQ].answer) {
      setCorrect((prev) => prev + 1);
    }
    setTimeout(() => {
      setAnswered(null);
      if (currentQ + 1 >= QUESTIONS.length) {
        setShowResults(true);
      } else {
        setCurrentQ((prev) => prev + 1);
      }
    }, 800);
  };

  return (
    <div className="instrument-detector">
      <h2>🎚️ Production Quiz</h2>
      <p>
        Question {currentQ + 1} of {QUESTIONS.length}
      </p>
      <div style={{ margin: "24px 0" }}>
        <h3 style={{ marginBottom: "16px" }}>{QUESTIONS[currentQ].q}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {QUESTIONS[currentQ].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered !== null}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid",
                borderColor:
                  answered === null
                    ? "#3b3b6b"
                    : i === QUESTIONS[currentQ].answer
                      ? "#4caf7d"
                      : answered === i
                        ? "#ff6b6b"
                        : "#3b3b6b",
                backgroundColor:
                  answered === null
                    ? "#0d0d1a"
                    : i === QUESTIONS[currentQ].answer
                      ? "#0a2e1a"
                      : answered === i
                        ? "#2e0a0a"
                        : "0d0d1a",
                color: "#ffffff",
                cursor: answered !== null ? "default" : "pointer",
                textAlign: "left",
                fontSize: "0.9rem",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {showResults && (
        <ResultsModal
          accuracy={accuracyScore}
          instrument="Production"
          skillCategory="Production"
          onClose={() => {
            setShowResults(false);
            setCurrentQ(0);
            setCorrect(0);
          }}
          onRetry={() => {
            setShowResults(false);
            setCurrentQ(0);
            setCorrect(0);
          }}
        />
      )}
    </div>
  );
}
