import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Spice & Simmer. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none prose-headings:font-serif text-muted-foreground">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <h2 className="text-foreground">1. Information We Collect</h2>
            <p>
              When you visit Spice & Simmer, we may collect certain information automatically, including:
            </p>
            <ul>
              <li>Your IP address and browser type</li>
              <li>Pages you visit and time spent on the site</li>
              <li>Referring website addresses</li>
              <li>Device and operating system information</li>
            </ul>
            <p>
              When you subscribe to our newsletter or submit a comment, we collect:
            </p>
            <ul>
              <li>Your email address</li>
              <li>Your name (if provided)</li>
              <li>Any other information you voluntarily provide</li>
            </ul>

            <h2 className="text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Send you our newsletter and recipe updates (if subscribed)</li>
              <li>Respond to your comments and inquiries</li>
              <li>Improve our website and content</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Display relevant advertisements</li>
            </ul>

            <h2 className="text-foreground">3. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our site. This includes:
            </p>
            <ul>
              <li><strong>Essential cookies:</strong> Required for the site to function properly</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site</li>
              <li><strong>Advertising cookies:</strong> Used to display relevant ads through Google AdSense</li>
            </ul>
            <p>
              You can control cookies through your browser settings, though disabling them may affect site functionality.
            </p>

            <h2 className="text-foreground">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Google AdSense:</strong> For displaying advertisements</li>
              <li><strong>Google Analytics:</strong> For website analytics</li>
              <li><strong>Firebase:</strong> For data storage and authentication</li>
              <li><strong>Cloudinary:</strong> For image hosting and optimization</li>
              <li><strong>Resend:</strong> For email delivery</li>
            </ul>
            <p>
              These services have their own privacy policies governing how they collect and use data.
            </p>

            <h2 className="text-foreground">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>

            <h2 className="text-foreground">6. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
            <ul>
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to delete your personal information</li>
              <li>The right to unsubscribe from marketing communications</li>
            </ul>
            <p>
              To exercise these rights, please contact us at hello@spiceandsimmer.com.
            </p>

            <h2 className="text-foreground">7. Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children.
            </p>

            <h2 className="text-foreground">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="text-foreground">9. Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact us at:
            </p>
            <p>
              Email: hello@spiceandsimmer.com<br />
              Website: spiceandsimmer.com/contact
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
