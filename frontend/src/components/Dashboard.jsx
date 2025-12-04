import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch, FaHome, FaChartPie, FaBookOpen } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const API_URL = "http://127.0.0.1:8000/flashcards/api/profile";

const CARD_PER_DECK = 12;

  

const Dashboard = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/decks/")
      .then((response) => {
        setDecks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching decks:", error);
        setLoading(false);
      });
  }, []);

  // Show decks matching search (in All Decks area)
  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // activity chart 

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
      });
  }, []);

  if (!profile) {
    return <div className="p-8">Loading profile...</div>;
  }

  const { email, decks_count, mcqs_count, cards_mastered, progress } = profile;

  const totalCards = decks_count * CARD_PER_DECK;
  const percentage = totalCards > 0 ? (cards_mastered / totalCards) * 100 : 0;

  const pieData = [
    { name: "Mastered", value: cards_mastered },
    { name: "Remaining", value: totalCards - cards_mastered },
  ];

  const COLORS = ["#3b82f6", "#d6d6d6"];

  // Convert progress to chart data points
  const chartData = progress.map((value, index) => ({
    name: `Step ${index + 1}`,
    mastered: value,
  }));


  // Deck card
  const DeckCard = ({ deck }) => (
    <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl p-6 text-white shadow-lg m-3 flex flex-col justify-between min-w-[250px] max-w-xs ">
      <span className="font-semibold text-xl mb-2">{deck.title}</span>
      <button
        onClick={() => navigate(`/deck/${deck.id}`)}
        className="bg-white text-blue-500 font-bold px-4 py-2 rounded-xl mt-4 hover:bg-gray-200"
      >
        Open
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6ff] flex w-full">
      {/* Sidebar */}
      <aside className="w-24 bg-white shadow-xl rounded-r-3xl flex flex-col items-center py-8 space-y-8">
        <FaUserCircle size={40} className="text-purple-500" />
        <div className="space-y-6">
          <FaHome size={24} className="text-gray-300 hover:text-purple-500 cursor-pointer" />
          <FaBookOpen size={24} className="text-gray-300 hover:text-blue-400 cursor-pointer" />
          <FaChartPie size={24} className="text-gray-300 hover:text-orange-400 cursor-pointer" />
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 px-10 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
          <div className="flex items-center bg-white shadow px-4 py-2 rounded-xl w-96">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search Decks…"
              className="outline-none bg-transparent text-gray-600 w-full"
            />
          </div>
        </div>
        
        {/* Top Quick Access Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl p-4 text-white shadow-lg">
            <div className="font-medium text-lg">Your Decks</div>
            <div className="text-3xl font-bold mt-2">{decks.length}</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 text-white shadow-lg">
            <div className="font-medium text-lg">Recent</div>
            <div className="text-3xl font-bold mt-2">
              {decks[0]?.title || "—"}
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-400 to-red-400 rounded-2xl p-4 text-white shadow-lg">
            <div className="font-medium text-lg">Review</div>
            <div className="text-3xl font-bold mt-2">Flashcards</div>
          </div>
          <div className="bg-gradient-to-r from-indigo-400 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="font-medium text-lg">Progress Rate</div>
            <div className="text-3xl font-bold mt-2">72%</div>
          </div>
        </div>

        {/* Chart and Recent Decks section */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Activity Chart area */}
          <div className="col-span-2 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl shadow-lg p-8 flex flex-col">
            <h2 className="text-white font-bold mb-4">Activity Chart</h2>
            {/* <svg width="100%" height="120">
              <polyline
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                points="0,100 30,80 60,90 90,60 120,30 150,70 180,30 210,80 240,60"
              />
            </svg> */}
            <ResponsiveContainer width="80%" height={200}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid stroke="#9e9e9e" strokeDasharray="5 5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="mastered"
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
          </div>

          {/* Recent Decks section (unchanged, showing top 3) */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Recent Decks</h3>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : decks.length === 0 ? (
              <div className="text-gray-500">No decks found.</div>
            ) : (
              <ul>
                {decks
                  .slice(0, 3)
                  .map(deck => (
                    <li
                      key={deck.id}
                      className="mb-4 flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-800">{deck.title}</span>
                      <button
                        onClick={() => navigate(`/deck/${deck.id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Open
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* All Decks displayed as card grid below chart + recent decks */}
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4">All Decks</h3>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (searchTerm.trim() && filteredDecks.length === 0) ? (
            <div className="text-gray-500">No decks found for your search.</div>
          ) : (
            <div className="flex flex-wrap justify-start">
              {(searchTerm.trim() ? filteredDecks : decks).map(
                deck => <DeckCard key={deck.id} deck={deck} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
