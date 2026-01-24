import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | BrickProfile",
  description: "Privacy Policy for BrickProfile - How we collect, use, and protect your data",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-dark-400 mb-8">Last updated: January 24, 2025</p>

        <div className="prose prose-invert prose-dark max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-dark-300 leading-relaxed">
              BrickProfile ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our portfolio
              website builder service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>

            <h3 className="text-lg font-medium mb-2 mt-4">Information You Provide</h3>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li>Account information (email address, password)</li>
              <li>Profile information (company name, phone number, address)</li>
              <li>Portfolio content (photos, descriptions, service information)</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Communications with us (support requests, feedback)</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 mt-4">Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, features used)</li>
              <li>IP address and approximate location</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p className="text-dark-300 leading-relaxed mb-3">
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li>Provide and maintain our Service</li>
              <li>Create and host your portfolio website</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send transactional emails (account verification, lead notifications)</li>
              <li>Provide customer support</li>
              <li>Improve our Service and develop new features</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Information Sharing</h2>
            <p className="text-dark-300 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li><strong className="text-white">Service Providers:</strong> Third parties that help us operate our Service (hosting, payment processing, email delivery)</li>
              <li><strong className="text-white">Public Portfolio:</strong> Information you include in your published portfolio is publicly visible</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
            <p className="text-dark-300 leading-relaxed mb-3">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li><strong className="text-white">Supabase:</strong> Database and authentication</li>
              <li><strong className="text-white">Stripe:</strong> Payment processing</li>
              <li><strong className="text-white">Vercel:</strong> Hosting and deployment</li>
              <li><strong className="text-white">OpenAI:</strong> AI-powered content generation</li>
              <li><strong className="text-white">Resend:</strong> Email delivery</li>
            </ul>
            <p className="text-dark-300 leading-relaxed mt-3">
              Each of these services has their own privacy policy governing their use of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
            <p className="text-dark-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your information, including
              encryption in transit and at rest, secure authentication, and regular security assessments. However,
              no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
            <p className="text-dark-300 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide our Service.
              If you delete your account, we will delete your personal information within 30 days, except where
              retention is required by law or for legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>
            <p className="text-dark-300 leading-relaxed mb-3">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Correction:</strong> Update or correct inaccurate information</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
              <li><strong className="text-white">Portability:</strong> Receive your data in a portable format</li>
              <li><strong className="text-white">Objection:</strong> Object to certain processing of your data</li>
              <li><strong className="text-white">Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-dark-300 leading-relaxed mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:contact@brickprofile.com" className="text-brand-400 hover:text-brand-300">
                contact@brickprofile.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Cookies</h2>
            <p className="text-dark-300 leading-relaxed">
              We use essential cookies to maintain your session and preferences. We do not use third-party tracking
              cookies for advertising purposes. You can control cookies through your browser settings, but disabling
              essential cookies may affect the functionality of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Children's Privacy</h2>
            <p className="text-dark-300 leading-relaxed">
              Our Service is not intended for children under 16 years of age. We do not knowingly collect personal
              information from children. If you believe we have collected information from a child, please contact
              us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. International Transfers</h2>
            <p className="text-dark-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure
              appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Changes to This Policy</h2>
            <p className="text-dark-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via
              email or through the Service. The updated policy will be effective upon posting with a new "Last
              updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
            <p className="text-dark-300 leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:{" "}
              <a href="mailto:contact@brickprofile.com" className="text-brand-400 hover:text-brand-300">
                contact@brickprofile.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
