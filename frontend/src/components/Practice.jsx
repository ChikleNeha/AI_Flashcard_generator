import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const TIMER_SECONDS = 30;

export default function Practice() {
  const [mcqs, setMcqs] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    async function fetchMcqs() {
      const email = localStorage.getItem("email") || "user@example.com";
      const deck_title = "SampleDeck"; // Adjust or get from context/route
      const study_material = localStorage.getItem("study_material") || "Generative AI is a type of artificial intelligence...";
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/flashcards/generate_mcq",
          null,
          {
            params: { email, deck_title, study_material },
            headers: { "Content-Type": "application/json" }
          }
        );
        setMcqs(response.data);
      } catch (e) {
        setFeedback("Failed to fetch MCQs. " + (e.response?.data?.detail || e.message));
      }
    }
    fetchMcqs();
  }, []);

  useEffect(() => {
    if (!mcqs.length) return;
    if (timer === 0) {
      handleNext();
      return;
    }
    intervalRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    setProgress(((current * TIMER_SECONDS + (TIMER_SECONDS - timer)) / (mcqs.length * TIMER_SECONDS)) * 100);
    return () => clearTimeout(intervalRef.current);
  }, [timer, current, mcqs.length]);

  function handleSelect(index) {
    setSelected(index);
    if (index === mcqs[current].answer_index) {
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect. The correct answer was: " + mcqs[current].options[mcqs[current].answer_index]);
    }
  }

  function handleNext() {
    if (current < mcqs.length - 1) {
      setCurrent(current + 1);
      setTimer(TIMER_SECONDS);
      setSelected(null);
      setFeedback("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-5 text-center">Practice MCQs</h2>
      {mcqs.length === 0 ? (
        <div>Loading MCQs...</div>
      ) : (
        <>
          <div className="mb-4 flex justify-between">
            <span>Progress: {current + 1} / {mcqs.length}</span>
            <span>Time remaining: {timer} seconds</span>
          </div>
          <div className="h-2 w-full mb-4 bg-gray-200 rounded">
            <div
              style={{ width: `${progress}%` }}
              className="h-2 bg-indigo-500 rounded"
            />
          </div>
          <div className="border rounded p-4 mb-4">
            <div className="font-semibold mb-3">
              Q{current + 1}: {mcqs[current].question}
            </div>
            {mcqs[current].options.map((option, idx) => (
              <button
                key={idx}
                className={`block w-full text-left mb-2 px-4 py-2 border rounded ${selected === idx ? "bg-indigo-200" : "bg-gray-50"} hover:bg-indigo-100`}
                disabled={selected !== null}
                onClick={() => handleSelect(idx)}
              >
                {String.fromCharCode(65 + idx)}) {option}
              </button>
            ))}
            <div className="mt-2 text-green-700">{feedback}</div>
            {selected !== null && current < mcqs.length - 1 && (
              <button
                onClick={handleNext}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
              >
                Next
              </button>
            )}
            {selected !== null && current === mcqs.length - 1 && (
              <div className="mt-4 text-xl font-bold">Practice Complete!</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
