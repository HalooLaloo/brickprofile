import Link from "next/link";
import {
  Sparkles,
  Camera,
  Palette,
  Globe,
  MessageSquare,
  BarChart3,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description:
      "Tell us about your business and our AI generates professional website copy instantly.",
  },
  {
    icon: Camera,
    title: "Smart Photo Organization",
    description:
      "Upload your project photos and AI automatically categorizes them into portfolios.",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description:
      "Choose from 4 construction-themed templates designed to showcase your work.",
  },
  {
    icon: Globe,
    title: "Instant Publishing",
    description:
      "Get a free subdomain or connect your custom domain. Go live in minutes.",
  },
  {
    icon: MessageSquare,
    title: "QuoteSnap Integration",
    description:
      "Add a 'Get Quote' button that connects directly to your QuoteSnap account.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track visitors, quote requests, and phone clicks to measure your impact.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Perfect for getting started",
    features: [
      "Up to 20 portfolio photos",
      "Free subdomain (company.brickprofile.com)",
      "All 4 templates",
      "AI content generation",
      "AI photo categorization",
      "5 testimonials",
      "QuoteSnap integration",
      "Basic analytics",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Unlimited portfolio photos",
      "Custom domain support",
      "All 4 templates",
      "AI content generation",
      "AI photo categorization",
      "Unlimited testimonials",
      "QuoteSnap integration",
      "Full analytics dashboard",
      "Remove BrickProfile branding",
      "Priority in directory",
    ],
    cta: "Start Pro Trial",
    featured: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">BrickProfile</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="btn-ghost btn-md">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary btn-md">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-brand-400">
              Part of the Snap Ecosystem
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Portfolio Websites for{" "}
            <span className="text-gradient">Contractors</span>
          </h1>
          <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-8">
            Create a stunning portfolio website in minutes with AI assistance.
            Showcase your work, attract new clients, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="btn-primary btn-lg w-full sm:w-auto"
            >
              Create Your Portfolio
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/site/demo"
              className="btn-secondary btn-lg w-full sm:w-auto"
            >
              View Demo Site
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Go from zero to a professional portfolio website in just 4 simple
              steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Tell Us About You",
                description:
                  "Answer a few questions about your business and services",
              },
              {
                step: "2",
                title: "Upload Photos",
                description:
                  "Drag and drop your project photos, AI organizes them",
              },
              {
                step: "3",
                title: "Choose Template",
                description:
                  "Pick from 4 beautiful templates designed for contractors",
              },
              {
                step: "4",
                title: "Publish",
                description:
                  "Go live instantly with your free subdomain or custom domain",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-dark-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Showcase Your Work
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Powerful features designed specifically for contractors and
              tradespeople
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card p-6 hover:border-dark-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Start for free, upgrade when you need more
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 ${
                  plan.featured
                    ? "border-brand-500 ring-1 ring-brand-500"
                    : ""
                }`}
              >
                {plan.featured && (
                  <div className="badge-primary mb-4">Most Popular</div>
                )}
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-dark-400">{plan.period}</span>
                </div>
                <p className="text-dark-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-dark-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center ${
                    plan.featured ? "btn-primary" : "btn-secondary"
                  } btn-lg w-full`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-900/50 to-dark-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Showcase Your Work?
          </h2>
          <p className="text-dark-400 mb-8">
            Join thousands of contractors who use BrickProfile to attract new
            clients and grow their business.
          </p>
          <Link href="/register" className="btn-primary btn-lg">
            Create Your Free Portfolio
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">BrickProfile</span>
            </div>
            <p className="text-dark-500 text-sm">
              Part of the Snap Ecosystem: SiteSnap • QuoteSnap • BrickProfile
            </p>
            <p className="text-dark-500 text-sm">
              &copy; {new Date().getFullYear()} BrickProfile. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
