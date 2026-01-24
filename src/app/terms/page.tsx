import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | BrickProfile",
  description: "Terms of Service for BrickProfile - Portfolio websites for contractors",
};

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-dark-400 mb-8">Last updated: January 24, 2025</p>

        <div className="prose prose-invert prose-dark max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
            <p className="text-dark-300 leading-relaxed">
              By accessing or using BrickProfile ("Service"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-dark-300 leading-relaxed">
              BrickProfile provides a platform for contractors and tradespeople to create professional
              portfolio websites. Our Service includes website creation tools, hosting, AI-assisted content
              generation, and related features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
            <p className="text-dark-300 leading-relaxed mb-3">
              To use certain features of the Service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
            <p className="text-dark-300 leading-relaxed mb-3">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload malicious code or harmful content</li>
              <li>Harass, abuse, or harm others</li>
              <li>Send spam or unauthorized advertising</li>
              <li>Impersonate others or provide false information</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Content Ownership</h2>
            <p className="text-dark-300 leading-relaxed mb-3">
              <strong className="text-white">Your Content:</strong> You retain ownership of all content you upload
              to BrickProfile, including photos, text, and other materials. By uploading content, you grant us a
              license to host, display, and distribute your content as necessary to provide the Service.
            </p>
            <p className="text-dark-300 leading-relaxed">
              <strong className="text-white">Our Content:</strong> BrickProfile and its licensors own all rights
              to the Service, including templates, designs, and software. You may not copy, modify, or distribute
              our proprietary content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Subscription and Payments</h2>
            <p className="text-dark-300 leading-relaxed mb-3">
              BrickProfile offers free and paid subscription plans. For paid plans:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 ml-4">
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions renew automatically unless cancelled</li>
              <li>You may cancel your subscription at any time</li>
              <li>Refunds are provided at our discretion</li>
              <li>Prices may change with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Service Availability</h2>
            <p className="text-dark-300 leading-relaxed">
              We strive to maintain high availability but do not guarantee uninterrupted access to the Service.
              We may modify, suspend, or discontinue features with reasonable notice. We are not liable for any
              downtime or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p className="text-dark-300 leading-relaxed">
              To the maximum extent permitted by law, BrickProfile and its affiliates shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages, including loss of profits,
              data, or business opportunities, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Indemnification</h2>
            <p className="text-dark-300 leading-relaxed">
              You agree to indemnify and hold harmless BrickProfile and its officers, directors, employees, and
              agents from any claims, damages, or expenses arising from your use of the Service or violation of
              these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
            <p className="text-dark-300 leading-relaxed">
              We may terminate or suspend your account at any time for violation of these Terms or for any other
              reason at our discretion. Upon termination, your right to use the Service ceases immediately. You
              may request export of your data before termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
            <p className="text-dark-300 leading-relaxed">
              We may update these Terms from time to time. We will notify you of significant changes via email or
              through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
            <p className="text-dark-300 leading-relaxed">
              If you have questions about these Terms, please contact us at{" "}
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
