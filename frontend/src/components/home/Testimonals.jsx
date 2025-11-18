const testimonials = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/35.jpg",
  "https://randomuser.me/api/portraits/women/21.jpg",
  "https://randomuser.me/api/portraits/men/42.jpg",
  "https://randomuser.me/api/portraits/women/23.jpg",
  "https://randomuser.me/api/portraits/men/47.jpg",
  "https://randomuser.me/api/portraits/women/33.jpg",
  "https://randomuser.me/api/portraits/men/36.jpg",
  "https://randomuser.me/api/portraits/women/16.jpg",
  "https://randomuser.me/api/portraits/men/38.jpg",
  "https://randomuser.me/api/portraits/women/24.jpg",
  "https://randomuser.me/api/portraits/men/43.jpg",
  "https://randomuser.me/api/portraits/women/30.jpg"
];

const floatStyles = [
  "top-2 left-6 rotate-[7deg] z-10 [animation:float_4s_ease-in-out_infinite]",
  "top-4 left-28 rotate-[-5deg] z-10 [animation:float_2.8s_ease-in-out_infinite]",
  "top-4 left-56 rotate-[-8deg] z-10 [animation:float_3.2s_ease-in-out_infinite]",
  "top-0 left-80 rotate-[8deg] z-10 [animation:float_3.7s_ease-in-out_infinite]",
  "top-6 left-1/2 rotate-[-7deg] z-10 [animation:float_2.5s_ease-in-out_infinite]",
  "top-6 right-80 rotate-[3deg] z-20 [animation:float_3.8s_ease-in-out_infinite]",
  "top-4 right-56 rotate-[5deg] z-20 [animation:float_3s_ease-in-out_infinite]",
  "top-2 right-28 rotate-[-3deg] z-20 [animation:float_4.2s_ease-in-out_infinite]",
  "bottom-10 left-7 rotate-[6deg] z-10 [animation:float_3.4s_ease-in-out_infinite]",
  "bottom-8 left-1/3 rotate-[0deg] z-10 [animation:float_2.9s_ease-in-out_infinite]",
  "bottom-8 right-1/4 rotate-[-8deg] z-10 [animation:float_3.3s_ease-in-out_infinite]",
  "bottom-10 right-7 rotate-[8deg] z-10 [animation:float_2.7s_ease-in-out_infinite]",
  "bottom-12 left-1/2 rotate-[2deg] z-20 [animation:float_4.5s_ease-in-out_infinite]",
  "bottom-12 right-1/2 rotate-[-6deg] z-20 [animation:float_3.7s_ease-in-out_infinite]",
];

export default function FooterWithFloatingTestimonials() {
  return (
    <div className="relative py-20 px-2 border-toverflow-hidden flex flex-col items-center justify-center">
      {/* Floating images */}
      <div className="absolute w-full h-full pointer-events-none select-none left-0 top-0">
        {testimonials.map((src, idx) => (
          <div
            key={idx}
            className={`absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl shadow-lg overflow-hidden bg-gray-100 ${floatStyles[idx]}`}
            style={{
              boxShadow: "0 10px 32px rgba(40,40,40,0.15)",
              animationDelay: `${idx * 0.35}s`,
            }}
          >
            <img src={src} alt="" className="object-cover w-full h-full" />
          </div>
        ))}
        {/* Custom keyframes for Tailwind v4 arbitrary floating animation */}
        <style>
          {`@keyframes float {0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);}}`}
        </style>
      </div>

      {/* Centered content */}
      <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center pt-20 pb-14">
        <h2 className="text-base font-semibold tracking-wide text-gray-400 mb-1">
          Testimonials
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-700 text-center mb-2">
          Trusted by leaders<br />from various industries
        </h3>
        <p className="mt-3 text-gray-500 text-center mb-5">
          Learn why professionals trust our solutions to<br className="hidden md:block" /> complete their customer journeys.
        </p>
        <button className="px-6 py-2 bg-black text-white rounded-full font-semibold shadow hover:bg-gray-800 transition mb-10">
          Read Success Stories
        </button>
      </div>
    </div>
  );
}
