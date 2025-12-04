import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const TIMER_SECONDS = 30;

export default function Practice() {
  const [deckTitle, setDeckTitle] = useState("");
  const [studyMaterial, setStudyMaterial] = useState("");
  const [file, setFile] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const intervalRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Clear text if file selected
    if (e.target.files[0]) setStudyMaterial("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    setMcqs([]);
    setCurrent(0);
    setSelected(null);
    setTimer(TIMER_SECONDS);

    if (!deckTitle.trim()) {
      setFeedback("Please enter a deck title.");
      return;
    }
    if (!studyMaterial.trim() && !file) {
      setFeedback("Please provide study material text or upload a file.");
      return;
    }

    setLoading(true);

    const email = localStorage.getItem("email") || "user@example.com";

    try {
      let response;

      if (file) {
        // ✅ UPDATED: Use new MCQ file endpoint
        const formData = new FormData();
        formData.append("email", email);
        formData.append("deck_title", deckTitle);
        formData.append("file", file);

        response = await axios.post(
          "http://127.0.0.1:8000/flashcards/generate_mcq_from_file", // ← NEW ENDPOINT
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Text-based MCQ (unchanged)
        response = await axios.post(
          "http://127.0.0.1:8000/flashcards/generate_mcq",
          null,
          {
            params: {
              email,
              deck_title: deckTitle,
              study_material: studyMaterial,
            },
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      setMcqs(response.data);
      if (!response.data.length) {
        setFeedback("No MCQs were generated.");
      }
    } catch (error) {
      setFeedback(
        "Failed to generate MCQs: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mcqs.length === 0) return;

    if (timer === 0) {
      handleNext();
      return;
    }

    intervalRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(intervalRef.current);
  }, [timer, current, mcqs.length]);

  const handleSelect = (idx) => {
    setSelected(idx);
    if (idx === mcqs[current].answer_index) {
      setFeedback("Correct!");
    } else {
      setFeedback(
        "Incorrect. The correct answer was: " +
          mcqs[current].options[mcqs[current].answer_index]
      );
    }
  };

  const handleNext = () => {
    if (current < mcqs.length - 1) {
      setCurrent((c) => c + 1);
      setTimer(TIMER_SECONDS);
      setSelected(null);
      setFeedback("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-5 text-center">Practice MCQs</h2>

      {!mcqs.length ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Deck Title"
            className="border p-2 w-full rounded"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Paste study material here (or upload file)"
            rows={6}
            className="border p-2 w-full rounded resize-none"
            value={studyMaterial}
            onChange={(e) => setStudyMaterial(e.target.value)}
            disabled={file != null}
          />
          <input
            type="file"
            accept=".pdf,.docx,.txt,.xlsx"
            onChange={handleFileChange}
            disabled={studyMaterial.trim() !== ""}
            className="border p-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 w-full"
            disabled={loading}
          >
            {loading ? "Generating MCQs..." : "Generate MCQs from Text/File"}
          </button>
          {feedback && <p className="text-red-600 mt-2">{feedback}</p>}
        </form>
      ) : (
        <>
          <div className="mb-4 flex justify-between">
            <span>
              Progress: {current + 1} / {mcqs.length}
            </span>
            <span>Time remaining: {timer} seconds</span>
          </div>
          <div className="h-2 w-full mb-4 bg-gray-200 rounded">
            <div
              style={{ width: `${((current + 1) / mcqs.length) * 100}%` }}
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
                className={`block w-full text-left mb-2 px-4 py-2 border rounded ${
                  selected === idx ? "bg-indigo-200" : "bg-gray-50"
                } hover:bg-indigo-100`}
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
