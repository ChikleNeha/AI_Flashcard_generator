import React, { useState } from "react";
import axios from "axios";
import bg_full from "../assets/bg-full.png"

export default function Upload() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const deck_title = e.target.flashcardSetName.value.trim();
    const study_material = e.target.textData.value.trim();
    const email = e.target.email.value.trim();

    if (!deck_title || !study_material || !email) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/flashcards/generate_flashcards",
        null,
        {
          params: { email, deck_title, study_material },
          headers: { "Content-Type": "application/json" }
        }
      );

      const flashcards = response.data;

      if (!Array.isArray(flashcards) || !flashcards.length) {
        throw new Error("No flashcards returned");
      }

      localStorage.setItem("flashcards", JSON.stringify(flashcards));
      window.location.href = "/review";
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-transparent rounded  z-10">
      {/* <img src={bg_full} alt="bg 1" className='inset-0 z-0 max-w-2xl fixed mx-auto'/> */}
      <h2 className="text-2xl font-semibold mb-5 text-center">Generate Flashcards</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 z-10">
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          className="border rounded px-22 py-2"
          required
        />
        <input
          name="flashcardSetName"
          type="text"
          placeholder="Flashcard Set Name"
          className="border rounded px-3 py-2"
          required
        />
        <textarea
          name="textData"
          rows={6}
          placeholder="Paste study material here"
          className="border rounded px-3 py-2 resize-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Generating…" : "Generate Flashcards"}
        </button>
      </form>
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </div>
  );
}
