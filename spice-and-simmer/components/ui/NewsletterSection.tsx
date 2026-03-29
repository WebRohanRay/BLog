"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail]       = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const captchaRef = useRef<HCaptcha>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Subscription failed");

      setDone(true);
      toast.success("Check your inbox to confirm!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="bg-gradient-to-br from-brand-500 to-spice-red py-16 sm:py-20"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-base">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="text-5xl mb-4" role="img" aria-hidden>🌶️</div>

          <h2
            id="newsletter-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3"
          >
            Get 10 Free Fusion Recipes
          </h2>
          <p className="text-brand-100 text-sm sm:text-base mb-8 leading-relaxed">
            Join 1,000+ home cooks. Get our free PDF guide + weekly bold recipes straight to your inbox.
          </p>

          {done ? (
            /* Success state */
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-white animate-fade-in">
              <div className="text-4xl mb-3" role="img" aria-hidden>📬</div>
              <h3 className="font-display font-bold text-xl mb-2">Almost there!</h3>
              <p className="text-brand-100 text-sm">
                We sent a confirmation email to <strong>{email}</strong>.
                Click the link to confirm and get your free PDF!
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="
                    flex-1 min-h-[52px] px-5 rounded-2xl
                    bg-white/95 border-0
                    text-gray-900 placeholder-gray-400 text-base
                    focus:outline-none focus:ring-4 focus:ring-white/40
                    transition-all duration-200
                  "
                  aria-label="Your email address"
                />
                <button
                  type="submit"
                  disabled={loading || !captchaToken}
                  className="
                    min-h-[52px] px-8
                    bg-gray-900 text-white font-bold text-base rounded-2xl
                    hover:bg-gray-800 active:bg-black
                    transition-colors duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed
                    whitespace-nowrap
                  "
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Subscribing…
                    </span>
                  ) : (
                    "Get Free PDF →"
                  )}
                </button>
              </div>

              {/* hCaptcha */}
              <div className="flex justify-center mb-3">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                  onVerify={setCaptchaToken}
                  theme="light"
                  size="normal"
                />
              </div>

              <p className="text-brand-200 text-xs">
                No spam, ever. Unsubscribe anytime. GDPR compliant.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
