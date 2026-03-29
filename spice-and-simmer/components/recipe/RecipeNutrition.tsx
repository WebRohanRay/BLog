import type { Nutrition } from "@/types";

interface RecipeNutritionProps {
  nutrition: Nutrition;
  servings: number;
}

export default function RecipeNutrition({ nutrition, servings }: RecipeNutritionProps) {
  const cells = [
    { label: "Calories", value: nutrition.calories, unit: "kcal" },
    { label: "Protein",  value: nutrition.protein,  unit: "g" },
    { label: "Carbs",    value: nutrition.carbs,     unit: "g" },
    { label: "Fat",      value: nutrition.fat,       unit: "g" },
    { label: "Fiber",    value: nutrition.fiber,     unit: "g" },
    { label: "Sodium",   value: nutrition.sodium,    unit: "mg" },
  ];

  return (
    <section className="mt-10 p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100"
      aria-labelledby="nutrition-heading"
    >
      <h2 id="nutrition-heading" className="font-display text-lg sm:text-xl font-bold text-gray-900 mb-1">
        Nutrition Facts
      </h2>
      <p className="text-xs text-gray-400 mb-5">Per serving · {servings} servings total</p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {cells.map((cell) => (
          <div key={cell.label} className="nutrition-cell">
            <span className="nutrition-value">
              {cell.value}
              <span className="text-xs font-normal text-gray-400 ml-0.5">{cell.unit}</span>
            </span>
            <span className="nutrition-label">{cell.label}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
        * Nutritional values are estimates. Actual values may vary based on ingredients used and portion sizes.
      </p>
    </section>
  );
}
