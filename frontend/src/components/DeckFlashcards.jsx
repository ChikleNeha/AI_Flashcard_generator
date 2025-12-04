import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeckFlashcards = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/flashcards/deck/${deckId}`)
      .then(response => {
        setFlashcards(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch flashcards", err);
        setLoading(false);
      });
  }, [deckId]);

  if (loading) return <div className="text-center mt-10">Loading flashcards...</div>;
  if (!flashcards.length) return <div className="text-center mt-10">No flashcards found in this deck.</div>;

  const currentCard = flashcards[currentIndex];

  const toggleAnswer = () => setShowAnswer(!showAnswer);

  const goPrevious = () => {
    setCurrentIndex(i => Math.max(i - 1, 0));
    setShowAnswer(false);
  };

  const goNext = () => {
    setCurrentIndex(i => Math.min(i + 1, flashcards.length - 1));
    setShowAnswer(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">
        &larr; Back to Dashboard
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Flashcard {currentIndex + 1} of {flashcards.length}</h2>
        
        {/* Card Container with perspective */}
        <div className="relative w-96 h-56 mx-auto perspective">
          {/* Card inner with flip transform */}
          <div className={`relative w-full h-full duration-700 transform-style-preserve-3d ${showAnswer ? "rotate-y-180" : ""}`}>
            {/* Front side: question */}
            <div className="absolute w-full h-full backface-hidden bg-white border border-gray-300 rounded-xl shadow-lg flex items-center justify-center p-6">
              <p className="text-lg font-semibold">{currentCard.question || currentCard.front}</p>
            </div>
            {/* Back side: answer */}
            <div className="absolute w-full h-full backface-hidden bg-green-100 border border-gray-300 rounded-xl shadow-lg flex items-center justify-center p-6 rotate-y-180">
              <p className="text-lg font-semibold text-green-700">{currentCard.answer || currentCard.back}</p>
            </div>
          </div>
        </div>

        {!showAnswer && (
          <button
            onClick={toggleAnswer}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show Answer
          </button>
        )}
      </div>

      <div className="mt-6 flex justify-between max-w-3xl mx-auto px-4">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === flashcards.length - 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeckFlashcards;
