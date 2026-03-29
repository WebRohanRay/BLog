"use client";

import { useState } from "react";
import type { FAQ } from "@/types";

interface RecipeFAQProps {
  faqs: FAQ[];
}

export default function RecipeFAQ({ faqs }: RecipeFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-10" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left min-h-[56px] hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-5 pb-4 pt-1 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
