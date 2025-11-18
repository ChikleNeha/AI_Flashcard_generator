import React, { useState } from "react";

export default function Review() {
  const flashcards = JSON.parse(localStorage.getItem("flashcards") || "[]");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!flashcards.length) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow text-center">
        No flashcards found. Please generate flashcards first.
      </div>
    );
  }

  const card = flashcards[currentIndex];

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-5 text-center">Review Flashcards</h2>
      <div className="flex items-center justify-between mb-6">
        <button
          disabled={currentIndex === 0}
          onClick={() => {
            setCurrentIndex(i => Math.max(0, i - 1));
            setShowAnswer(false);
          }}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          &lt; Prev
        </button>
        <span>{currentIndex + 1} / {flashcards.length}</span>
        <button
          disabled={currentIndex === flashcards.length - 1}
          onClick={() => {
            setCurrentIndex(i => Math.min(flashcards.length - 1, i + 1));
            setShowAnswer(false);
          }}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Next &gt;
        </button>
      </div>
      <div className="border rounded p-4 min-h-[100px] mb-4">
        <div className="text-lg font-semibold mb-3">Q: {card.question}</div>
        {showAnswer ? (
          <div className="text-green-700 font-semibold">A: {card.answer}</div>
        ) : (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </button>
        )}
      </div>
    </div>
  );
}
