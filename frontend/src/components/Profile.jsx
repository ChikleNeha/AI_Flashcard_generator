import React, { useEffect, useState } from "react";
import axios from "axios";
import bg_full from "../assets/bg-full.png";
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

const Profile = () => {
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

  return (
    <div className="max-w-6xl mx-auto p-8 mt-8 ml-36 grid grid-cols-2 gap-2">
      <div className="">
        <div className="flex items-center mb-6 gap-8">
          <img src={bg_full} alt="bg 1" className='inset-0 z-0 max-w-2xl fixed mx-auto'/>
          <div className="relative w-96 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={15}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-blue-600">
              {`${Math.round(percentage)}%`}
            </div>
          </div>
          <div className="space-y-2 w-4xl">
            <div className="text-lg font-semibold">{email}</div>
            <div className="text-md text-gray-600">Decks: {decks_count}</div>
            <div className="text-md text-gray-600">MCQ Sets: {mcqs_count}</div>
            <div className="text-blue-700 font-bold text-xl">
              Cards Mastered: {cards_mastered} / {totalCards}
            </div>
          </div>
        </div>
        <div className="mb-6 bg-blue-50 px-4 py-2 rounded max-w-xs">
          <span className="italic text-gray-700">
            Today is the day you reach your goals!
          </span>
        </div>
      </div>

      <div >
        <div className="font-medium mb-2">Progress</div>
        <ResponsiveContainer width="80%" height={200}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mastered"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Profile;
