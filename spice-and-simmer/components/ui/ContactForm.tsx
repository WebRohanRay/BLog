"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) { toast.error("Please complete the captcha"); return; }

    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    fd.get("name"),
          email:   fd.get("email"),
          message: fd.get("message"),
          captchaToken,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setDone(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-6xl mb-4" role="img" aria-hidden>✅</div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Message sent!</h2>
        <p className="text-gray-500 text-sm">We typically respond within 1-2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-flat p-6 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="label">Name *</label>
          <input id="contact-name" name="name" type="text" required minLength={2} maxLength={100} className="input" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="label">Email *</label>
          <input id="contact-email" name="email" type="email" required className="input" placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="label">Message *</label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={2000} rows={5} className="textarea" placeholder="What's on your mind?" />
      </div>
      <div className="flex justify-center">
        <HCaptcha
          ref={captchaRef}
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
          onVerify={setCaptchaToken}
        />
      </div>
      <button type="submit" disabled={loading || !captchaToken} className="btn-primary w-full">
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
