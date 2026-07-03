'use client';
import React, { FormEvent, JSX } from "react";
import { useState } from "react";

const FeedbackForm = (): JSX.Element => {
  const [feedback, setFeedback] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle feedback submission logic here
    console.log('Feedback submitted:', { name, feedback });
    setFeedback('');
    setName('');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">We Value Your Feedback</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 ease-in-out"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 ease-in-out"
            placeholder="Share your thoughts..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;