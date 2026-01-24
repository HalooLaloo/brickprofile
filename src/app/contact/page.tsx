"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, CheckCircle, Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="card p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Message Sent!</h1>
            <p className="text-dark-400 mb-6">
              Thanks for reaching out. We'll get back to you as soon as possible.
            </p>
            <Link href="/" className="btn-primary btn-md">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-dark-400">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="card p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-400" />
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="label">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="label">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input min-h-[120px] resize-none"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-md w-full"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-400" />
                Email Us Directly
              </h2>
              <p className="text-dark-400 text-sm mb-3">
                Prefer email? Reach out to us at:
              </p>
              <a
                href="mailto:contact@brickprofile.com"
                className="text-brand-400 hover:text-brand-300 transition-colors"
              >
                contact@brickprofile.com
              </a>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold mb-4">Common Questions</h2>
              <ul className="space-y-3 text-sm text-dark-400">
                <li>
                  <strong className="text-white">How do I upgrade to Pro?</strong>
                  <p>Go to Settings → Subscription → Upgrade to Pro</p>
                </li>
                <li>
                  <strong className="text-white">Can I use my own domain?</strong>
                  <p>Yes! Pro users can connect custom domains in Settings.</p>
                </li>
                <li>
                  <strong className="text-white">How do I cancel?</strong>
                  <p>Go to Settings → Manage Subscription → Cancel</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
