import React, { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value.trim();
    const deck_title = e.target.flashcardSetName.value.trim();
    const study_material = e.target.textData.value.trim();
    const file = e.target.file?.files[0];

    if (!email || !deck_title) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    // Require either text OR file
    if (!study_material && !file) {
      setError("Paste some text or upload a file.");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (file) {
        // Send file via FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", email);
        formData.append("deck_title", deck_title);

        response = await axios.post(
          "http://127.0.0.1:8000/flashcards/generate_from_file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Existing text-based flow
        response = await axios.post(
          "http://127.0.0.1:8000/flashcards/generate_flashcards",
          null,
          {
            params: { email, deck_title, study_material },
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const flashcards = response.data;

      if (!Array.isArray(flashcards) || !flashcards.length) {
        throw new Error("No flashcards returned");
      }

      localStorage.setItem("flashcards", JSON.stringify(flashcards));
      window.location.href = "/review";
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to generate flashcards"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-transparent rounded z-10">
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Generate Flashcards
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 z-10">
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          className="border rounded px-3 py-2"
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
          placeholder="Paste study material here (or upload a file below)"
          className="border rounded px-3 py-2 resize-none"
        />
        <input
          name="file"
          type="file"
          accept=".pdf,.docx,.txt,.xlsx"
          className="border rounded px-3 py-2"
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
