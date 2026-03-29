import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Spice & Simmer",
  description: "Get in touch with the Spice & Simmer team. Recipe questions, collaborations, or just to say hello.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="container-base py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Get in Touch
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Recipe question? Collaboration idea? Just want to share how a dish turned out?
            We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "📧", label: "Email", value: "hello@spiceandsimmer.com", href: "mailto:hello@spiceandsimmer.com" },
            { icon: "📸", label: "Instagram", value: "@spiceandsimmer", href: "https://instagram.com/spiceandsimmer" },
            { icon: "📌", label: "Pinterest", value: "@spiceandsimmer", href: "https://pinterest.com/spiceandsimmer" },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel={c.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="card-flat p-4 flex flex-col items-center text-center hover:shadow-card-hover transition-shadow group"
            >
              <span className="text-3xl mb-2" role="img" aria-hidden>{c.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{c.label}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-600 transition-colors">{c.value}</span>
            </a>
          ))}
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}
