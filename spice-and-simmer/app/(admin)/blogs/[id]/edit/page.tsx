import { notFound }      from "next/navigation";
import { getBlogById }   from "@/lib/firebase/queries";
import BlogEditor        from "@/components/admin/BlogEditor";

export const dynamic = "force-dynamic";

interface EditBlogPageProps {
  params: { id: string };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const blog = await getBlogById(params.id).catch(() => null);
  if (!blog) notFound();
  return <BlogEditor blog={blog} isEdit />;
}
