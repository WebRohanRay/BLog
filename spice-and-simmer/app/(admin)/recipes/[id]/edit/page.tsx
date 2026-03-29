import { notFound }        from "next/navigation";
import { getRecipeById }   from "@/lib/firebase/recipes";
import RecipeEditor        from "@/components/admin/RecipeEditor";

export const dynamic = "force-dynamic";

interface EditRecipePageProps {
  params: { id: string };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const recipe = await getRecipeById(params.id).catch(() => null);
  if (!recipe) notFound();

  return <RecipeEditor recipe={recipe} isEdit />;
}
