import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy — Spice & Simmer",
  description: "Privacy Policy for Spice & Simmer. Learn how we collect, use, and protect your data.",
  robots: { index: true },
};

export default function PrivacyPolicyPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spiceandsimmer.com";
  const email   = "hello@spiceandsimmer.com";
  const updated = "January 1, 2025";

  return (
    <div className="container-base py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: {updated}</p>

        <div className="prose prose-sm sm:prose max-w-none prose-headings:font-display prose-a:text-brand-500">
          <p>
            Welcome to Spice &amp; Simmer (<a href={siteUrl}>{siteUrl}</a>). We are committed to
            protecting your personal information and your right to privacy.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Newsletter subscriptions:</strong> email address only.</li>
            <li><strong>Comments:</strong> name, email address, and comment content.</li>
            <li><strong>Contact form:</strong> name, email address, and message.</li>
          </ul>
          <p>We also automatically collect:</p>
          <ul>
            <li><strong>Usage data:</strong> pages visited, time on site, browser type (via Google Analytics, if enabled).</li>
            <li><strong>Cookies:</strong> session cookies for functionality; advertising cookies if Google AdSense is active.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To send you newsletters you subscribed to (with your explicit consent).</li>
            <li>To display and moderate your comments.</li>
            <li>To respond to your contact form messages.</li>
            <li>To improve our website content and user experience.</li>
            <li>To display relevant advertisements via Google AdSense.</li>
          </ul>

          <h2>Google AdSense & Third-Party Advertising</h2>
          <p>
            We use Google AdSense to display advertisements. Google may use cookies to
            serve ads based on your prior visits to our website or other websites.
            You may opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ad Settings
            </a>.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies for essential site functionality (session management) and
            analytics. You can control cookies through your browser settings. Disabling
            cookies may affect site functionality.
          </p>

          <h2>Data Retention</h2>
          <ul>
            <li>Newsletter subscribers: until you unsubscribe.</li>
            <li>Comments: until deleted by admin or you request removal.</li>
            <li>Contact messages: 90 days after response.</li>
          </ul>

          <h2>Your Rights (GDPR / CAN-SPAM)</h2>
          <ul>
            <li><strong>Access:</strong> request a copy of your data.</li>
            <li><strong>Deletion:</strong> request deletion of your data.</li>
            <li><strong>Unsubscribe:</strong> every email includes an unsubscribe link.</li>
            <li><strong>Correction:</strong> request correction of inaccurate data.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href={`mailto:${email}`}>{email}</a>.
          </p>

          <h2>Data Security</h2>
          <p>
            We use Firebase (Google) for data storage, which implements
            industry-standard security measures. However, no internet transmission
            is 100% secure.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under 13. We do not knowingly
            collect personal information from children under 13.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of
            significant changes by updating the date at the top of this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions about this privacy policy? Email us at{" "}
            <a href={`mailto:${email}`}>{email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
