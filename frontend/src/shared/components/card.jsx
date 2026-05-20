import React from "react";

function Card({ title, value, className = "", loading = false }) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 
      shadow-[0_0_20px_rgba(0,255,213,0.15)] 
      hover:shadow-[0_0_30px_rgba(120,115,245,0.4)] 
      transition duration-300 hover:-translate-y-1 ${className}`}
    >
      <h2 className="text-sm text-white/70 mb-2">{title}</h2>

      {value !== undefined && (
        <p className="text-3xl font-bold mt-3 text-cyan-400">
          {loading ? "Loading..." : value}
        </p>
      )}
    </div>
  );
}

export default Card;