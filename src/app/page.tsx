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
  Share2,
  Star,
  Users,
  Clock,
  Shield,
  X,
  FileText,
  Calculator,
  ClipboardList,
  ChevronRight,
  Quote,
  BrickWall,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description:
      "Answer a few questions and AI generates your entire website copy - headlines, about text, and service descriptions.",
  },
  {
    icon: Camera,
    title: "Smart Photo Gallery",
    description:
      "Upload project photos and AI automatically categorizes them. Create stunning before/after comparisons.",
  },
  {
    icon: Share2,
    title: "Social Media Generator",
    description:
      "Generate engaging Facebook & Instagram posts with one click. 9 post types optimized for engagement.",
    pro: true,
  },
  {
    icon: Globe,
    title: "Instant Publishing",
    description:
      "Go live instantly with your free subdomain or connect your own custom domain.",
  },
  {
    icon: MessageSquare,
    title: "Lead Capture",
    description:
      "Built-in contact form captures leads and sends you email notifications instantly.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track visitors, quote requests, and phone clicks. Know exactly how your site performs.",
    pro: true,
  },
];

const testimonials = [
  {
    name: "Mike Thompson",
    company: "Thompson Renovations",
    location: "Sydney",
    text: "Had my portfolio site up in 20 minutes. The AI wrote better copy than I ever could. Already got 3 new leads this month!",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    company: "Chen Plumbing Services",
    location: "Melbourne",
    text: "The social media generator is a game changer. I used to spend hours on posts, now it takes seconds. Worth every penny.",
    rating: 5,
  },
  {
    name: "Dave Wilson",
    company: "Wilson Electrical",
    location: "Brisbane",
    text: "Simple, professional, and actually gets me customers. The before/after photos really show off my work.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "How long does it take to create my website?",
    answer:
      "Most users have their portfolio website live in under 10 minutes. Just answer a few questions, upload your photos, pick a template, and you're done!",
  },
  {
    question: "Do I need any technical skills?",
    answer:
      "Not at all! BrickProfile is designed for tradespeople, not tech experts. If you can use Facebook, you can use BrickProfile.",
  },
  {
    question: "Can I use my own domain name?",
    answer:
      "Yes! Free users get a subdomain (yourcompany.brickprofile.com). Pro users can connect their own custom domain like yourcompany.com.au.",
  },
  {
    question: "What's included in the Social Media Generator?",
    answer:
      "Pro users can generate posts for Facebook and Instagram with 9 different post types: Before/After, Project Showcase, Quick Tips, Polls, Did You Know facts, and more. Each post is optimized for the platform.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your Pro subscription at any time. Your site will revert to Free features but your content stays safe.",
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
                <BrickWall className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">BrickProfile</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-dark-400 hover:text-white transition-colors text-sm">
                Features
              </a>
              <a href="#pricing" className="text-dark-400 hover:text-white transition-colors text-sm">
                Pricing
              </a>
              <a href="#faq" className="text-dark-400 hover:text-white transition-colors text-sm">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="btn-ghost btn-md">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary btn-md">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-sm text-brand-400">
                AI-Powered Portfolio Websites
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Work Deserves a{" "}
              <span className="text-gradient">Professional Portfolio</span>
            </h1>
            <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-8">
              Create a stunning portfolio website in minutes. AI writes your content,
              organizes your photos, and even generates social media posts.
              Built for contractors who'd rather be on the tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/register"
                className="btn-primary btn-lg w-full sm:w-auto text-lg px-8"
              >
                Create Your Portfolio Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/site/demo"
                className="btn-secondary btn-lg w-full sm:w-auto"
              >
                View Demo Site
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-dark-500 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Setup in 10 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Join 500+ contractors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Live in 4 Simple Steps</h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              No tech skills needed. If you can use Facebook, you can create a professional portfolio.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Tell Us About You",
                description:
                  "Answer a few simple questions. AI does the rest.",
                icon: MessageSquare,
              },
              {
                step: "2",
                title: "Upload Photos",
                description:
                  "Drag & drop your project photos. AI organizes them.",
                icon: Camera,
              },
              {
                step: "3",
                title: "Pick a Template",
                description:
                  "Choose from 4 professional templates. Customize colors.",
                icon: Palette,
              },
              {
                step: "4",
                title: "Go Live",
                description:
                  "Publish instantly. Share your link. Get clients.",
                icon: Globe,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-brand-400" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-dark-800 text-brand-400 text-sm font-bold mb-3">
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
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Win More Work
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Powerful AI features that save you hours and make you look professional
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card p-6 hover:border-dark-600 transition-colors relative"
              >
                {feature.pro && (
                  <span className="absolute top-4 right-4 badge-primary text-xs">Pro</span>
                )}
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

      {/* Social Proof / Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Contractors Across Australia
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              See why tradespeople love BrickProfile
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-brand-500/30 mb-3" />
                <p className="text-dark-300 mb-4">{testimonial.text}</p>
                <div className="border-t border-dark-700 pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-dark-400">
                    {testimonial.company} • {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Honest Pricing
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Start free. Upgrade when you're ready to grow.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-dark-400">/forever</span>
              </div>
              <p className="text-dark-400 text-sm mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Professional portfolio website",
                  "Free subdomain (you.brickprofile.com)",
                  "Up to 10 portfolio photos",
                  "All 4 templates",
                  "AI content generation",
                  "AI photo categorization",
                  "Contact form with email leads",
                  "5 customer reviews",
                  "Mobile responsive",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center btn-secondary btn-lg w-full"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="card p-8 border-brand-500 ring-1 ring-brand-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">$19.99</span>
                <span className="text-dark-400">/month</span>
              </div>
              <p className="text-dark-400 text-sm mb-6">For serious contractors</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free, plus:",
                  "Unlimited portfolio photos",
                  "Custom domain support",
                  "Social Media Content Generator",
                  "Full analytics dashboard",
                  "Unlimited customer reviews",
                  "Google Reviews integration",
                  "Email notifications for leads",
                  "Remove BrickProfile branding",
                  "Priority support",
                ].map((feature, index) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className={index === 0 ? "text-brand-400 font-medium" : "text-dark-300"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center btn-primary btn-lg w-full"
              >
                Start 7-Day Free Trial
              </Link>
              <p className="text-xs text-dark-500 text-center mt-3">
                No credit card required to start
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brick Ecosystem Cross-sell */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">
                The Brick Ecosystem
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Run Your Entire Business with Brick Apps
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              BrickProfile is part of a suite of tools designed specifically for contractors.
              Use them together for maximum efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* BrickProfile */}
            <div className="card p-6 border-brand-500/50 bg-brand-500/5">
              <div className="w-12 h-12 rounded-lg bg-brand-500/20 flex items-center justify-center mb-4">
                <BrickWall className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">BrickProfile</h3>
              <p className="text-dark-400 text-sm mb-4">
                Portfolio websites & social media content. Showcase your work and attract new clients.
              </p>
              <span className="text-brand-400 text-sm font-medium">You are here</span>
            </div>

            {/* BrickQuote */}
            <a
              href="https://brickquote.app"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 hover:border-dark-600 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                BrickQuote
                <ChevronRight className="w-4 h-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-dark-400 text-sm mb-4">
                AI-powered quoting system. Create professional quotes in minutes, not hours.
              </p>
              <span className="text-emerald-400 text-sm font-medium">brickquote.app</span>
            </a>

            {/* BrickTask */}
            <a
              href="https://bricktask.app"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 hover:border-dark-600 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                BrickTask
                <ChevronRight className="w-4 h-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-dark-400 text-sm mb-4">
                Job management & scheduling. Track projects, teams, and deadlines effortlessly.
              </p>
              <span className="text-purple-400 text-sm font-medium">bricktask.app</span>
            </a>
          </div>

          <div className="text-center mt-8">
            <p className="text-dark-500 text-sm">
              Use all three together and save 20% with our Bundle pricing.{" "}
              <a href="#" className="text-brand-400 hover:underline">Learn more</a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-dark-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Showcase Your Work?
          </h2>
          <p className="text-dark-400 text-lg mb-8">
            Join hundreds of contractors who use BrickProfile to win more work.
            Your professional portfolio is just 10 minutes away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary btn-lg text-lg px-8">
              Create Your Free Portfolio
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <p className="text-dark-500 text-sm mt-4">
            No credit card required • Setup in 10 minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-dark-800 bg-dark-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <BrickWall className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">BrickProfile</span>
              </div>
              <p className="text-dark-500 text-sm">
                Professional portfolio websites for contractors. Built with AI.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-dark-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-dark-400 hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/site/demo" className="text-dark-400 hover:text-white transition-colors">Demo Site</Link></li>
              </ul>
            </div>

            {/* Brick Apps */}
            <div>
              <h4 className="font-semibold mb-4">Brick Apps</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-brand-400">BrickProfile</span></li>
                <li><a href="https://brickquote.app" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-white transition-colors">BrickQuote</a></li>
                <li><a href="https://bricktask.app" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-white transition-colors">BrickTask</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-dark-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-dark-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-dark-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-dark-500 text-sm">
              &copy; {new Date().getFullYear()} BrickProfile. All rights reserved.
            </p>
            <p className="text-dark-600 text-sm">
              Made with love for hardworking tradies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
