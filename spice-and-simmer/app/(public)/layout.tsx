import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// This layout wraps all public-facing pages:
// /, /recipes, /blog, /about, /contact, /privacy-policy, /search, /tags

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
