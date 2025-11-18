import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      setError("Email and password required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Login failed");
      }

      onLoginSuccess(email);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-5 text-center">Login</h2>
      <form onSubmit={handleLogin} className="grid gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Login
        </button>
      </form>
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </div>
  );
}

export default function App() {
  const [userEmail, setUserEmail] = useState(null);

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    alert(`Login successful for ${email}`);
    // You can redirect to Upload page or show logged in UI here
  };

  if (!userEmail) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userEmail}</h1>
      <p>You are logged in. You can now generate flashcards.</p>
      <Link to='/upload'>Upload Page</Link>
    </div>
  );
}
