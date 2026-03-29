"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Recipe } from "@/types";

interface RecipeActionsProps {
  recipe: Recipe;
  recipeUrl: string;
}

const SCALES = [1, 2, 3] as const;
type Scale = (typeof SCALES)[number];

export default function RecipeActions({ recipe, recipeUrl }: RecipeActionsProps) {
  const [scale, setScale] = useState<Scale>(1);

  // Update ingredient amounts shown on page
  const applyScale = (newScale: Scale) => {
    setScale(newScale);
    // Update all .ingredient-amount spans via DOM
    const amounts = document.querySelectorAll<HTMLElement>(".ingredient-amount");
    amounts.forEach((el, i) => {
      const ing = recipe.ingredients[i];
      if (ing) {
        el.textContent = `${ing.amount * newScale} ${ing.unit}`;
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.metaDescription,
          url: recipeUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(recipeUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handlePDF = async () => {
    toast("Generating PDF…");
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const content = document.getElementById("recipe-content");
      if (!content) return;

      const canvas  = await html2canvas(content, { scale: 1.5, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      const pdf     = new jsPDF("p", "mm", "a4");
      const pdfW    = pdf.internal.pageSize.getWidth();
      const pdfH    = (canvas.height * pdfW) / canvas.width;

      // Split into pages
      let position = 0;
      const pageH = pdf.internal.pageSize.getHeight();
      while (position < pdfH) {
        pdf.addImage(imgData, "JPEG", 0, -position, pdfW, pdfH);
        position += pageH;
        if (position < pdfH) pdf.addPage();
      }

      pdf.save(`${recipe.slug}.pdf`);
      toast.success("PDF downloaded!");
    } catch (err) {
      toast.error("PDF generation failed. Try printing instead.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Serving scale */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <span className="text-xs text-gray-500 px-2 font-medium">Servings:</span>
        {SCALES.map((s) => (
          <button
            key={s}
            onClick={() => applyScale(s)}
            className={`min-w-[36px] min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              scale === s
                ? "bg-brand-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            aria-pressed={scale === s}
            aria-label={`Scale to ${s}x (${recipe.servings * s} servings)`}
          >
            {s}×
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 hidden sm:block" />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handlePrint}
          className="btn-secondary btn-sm gap-1.5 no-print"
          aria-label="Print recipe"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>

        <button
          onClick={handlePDF}
          className="btn-secondary btn-sm gap-1.5 no-print"
          aria-label="Download PDF"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          PDF
        </button>

        <button
          onClick={handleShare}
          className="btn-secondary btn-sm gap-1.5 no-print"
          aria-label="Share recipe"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
