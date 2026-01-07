"use client";
import React from "react";

export default function Eventreview() {
  return (
    <div className="w-full flex flex-col items-center">

      {/* ===== SINGLE EVENT REVIEW BANNER ===== */}
      <section className="w-full max-w-6xl mt-16 px-4">
        <div className="w-full h-48 bg-gray-300 rounded-xl flex items-center justify-center">
          <span className="text-gray-600 text-lg">
            Event Review Banner (Limited Offer)
          </span>
        </div>
      </section>

      {/* ===== CREATE EVENT REVIEW SECTION ===== */}
      <section className="w-full max-w-6xl mt-16 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-8">
          Create Event Review
        </h2>

        <button className="border px-8 py-4 bg-blue-800 text-white rounded-lg w-fit mx-auto">
          Create Event Review
        </button>
      </section>

      <div className="h-20" /> {/* Spacer bawah */}
    </div>
  );
}
