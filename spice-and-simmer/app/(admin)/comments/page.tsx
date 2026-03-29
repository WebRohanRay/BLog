import { getDocs, query, orderBy, where } from "firebase/firestore";
import { commentsCol } from "@/lib/firebase/collections";
import CommentsClient from "@/components/admin/CommentsClient";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = (searchParams.status as "pending" | "approved" | "rejected") || "pending";

  const q = query(
    commentsCol,
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  const comments = snap.docs.map((d) => d.data());

  return <CommentsClient comments={comments} currentStatus={status} />;
}
