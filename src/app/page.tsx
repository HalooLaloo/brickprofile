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
  RefreshCw,
  Copy,
  CreditCard,
  Phone,
  Mail,
  ExternalLink,
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
  {
    icon: CreditCard,
    title: "Business Card Generator",
    description:
      "Create professional business cards with QR code to your portfolio. Download print-ready PDFs.",
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
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-semibold">
                100% FREE to Start - No Credit Card Required
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link
                href="/register"
                className="btn-primary btn-lg w-full sm:w-auto text-lg px-8"
              >
                Start Free Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/site/demo"
                className="btn-secondary btn-lg w-full sm:w-auto"
              >
                View Demo Site
              </Link>
            </div>

            {/* Free highlight */}
            <p className="text-green-400 font-medium mb-8">
              Free forever. Upgrade only if you want Pro features.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-dark-500 text-sm mb-16">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Setup in 10 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Join 500+ contractors</span>
              </div>
            </div>
          </div>

          {/* Hero Preview Mockup - Clickable */}
          <div className="relative max-w-5xl mx-auto">
            {/* Glow effects */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Browser mockup - Clickable link to demo */}
            <Link
              href="/site/demo"
              className="relative block rounded-xl overflow-hidden border border-dark-700 bg-dark-900 shadow-2xl group transition-all duration-300 hover:border-brand-500/50 hover:shadow-brand-500/20 hover:shadow-2xl"
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/10 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-brand-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                  <ExternalLink className="w-5 h-5" />
                  View Live Demo
                </div>
              </div>

              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-dark-800 border-b border-dark-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 rounded-md bg-dark-700 text-dark-400 text-xs flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    demo.brickprofile.com
                  </div>
                </div>
                <div className="text-xs text-dark-500 group-hover:text-brand-400 transition-colors flex items-center gap-1">
                  <span className="hidden sm:inline">Click to view</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Content preview - Real portfolio look */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-dark-900 to-dark-950">
                {/* Hero section preview */}
                <div className="mb-6 pb-6 border-b border-dark-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-xl">
                      SR
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Smith Renovations</h3>
                      <p className="text-sm text-dark-400">Sydney & Surrounds • 15+ Years Experience</p>
                    </div>
                  </div>
                  <p className="text-dark-300 text-sm leading-relaxed max-w-xl">
                    Quality bathroom & kitchen renovations. Fully licensed, insured, and committed to excellence on every project.
                  </p>
                </div>

                {/* Portfolio grid */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80"
                    alt="Bathroom renovation"
                    className="aspect-square object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
                    alt="Kitchen renovation"
                    className="aspect-square object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"
                    alt="Ensuite renovation"
                    className="aspect-square object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=80"
                    alt="Kitchen design"
                    className="aspect-square object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  />
                </div>

                {/* Services & Reviews row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-dark-800 rounded-full text-xs text-dark-300 font-medium">🛁 Bathrooms</span>
                    <span className="px-3 py-1.5 bg-dark-800 rounded-full text-xs text-dark-300 font-medium">🍳 Kitchens</span>
                    <span className="px-3 py-1.5 bg-dark-800 rounded-full text-xs text-dark-300 font-medium">🔨 Tiling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-white">5.0</span>
                      <span className="text-xs text-dark-500">(47 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* CTA Preview */}
                <div className="mt-6 pt-6 border-t border-dark-800 flex flex-wrap gap-3">
                  <div className="h-11 px-6 bg-brand-500 rounded-lg flex items-center justify-center text-sm font-semibold text-white">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Quote
                  </div>
                  <div className="h-11 px-6 bg-dark-800 rounded-lg flex items-center justify-center text-sm text-dark-300">
                    <Phone className="w-4 h-4 mr-2" />
                    +61 400 123 456
                  </div>
                  <div className="h-11 px-6 bg-dark-800 rounded-lg flex items-center justify-center text-sm text-dark-300">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Form
                  </div>
                </div>
              </div>
            </Link>

            {/* "Click to explore" hint below mockup */}
            <div className="text-center mt-4">
              <Link
                href="/site/demo"
                className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-brand-400 transition-colors"
              >
                <span>👆 Click the preview above or</span>
                <span className="font-medium text-brand-400 underline underline-offset-2">view demo site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-4 top-1/4 transform -translate-x-full hidden lg:block animate-float">
              <div className="card p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">AI Generated</p>
                    <p className="text-sm font-medium">Content Ready</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-1/3 transform translate-x-full hidden lg:block animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="card p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">5.0 Rating</p>
                    <p className="text-sm font-medium">Client Reviews</p>
                  </div>
                </div>
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

      {/* Social Media Generator Highlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-800 bg-gradient-to-b from-brand-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
                <Share2 className="w-4 h-4 text-brand-400" />
                <span className="text-sm text-brand-400 font-medium">Pro Feature</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Social Media Content Generator
              </h2>
              <p className="text-dark-400 mb-6">
                Stop spending hours creating social media posts. Our AI generates engaging content
                for Facebook and Instagram in seconds - perfectly tailored for contractors.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "9 post types: Before/After, Tips, Polls, Testimonials & more",
                  "Optimized hashtags for maximum reach",
                  "Uses your photos and company info automatically",
                  "One-click copy & download",
                  "Works for Facebook & Instagram",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    <span className="text-dark-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary btn-md">
                Try It Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="relative">
              <div className="card p-6 bg-dark-800/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-medium">Instagram Post</p>
                    <p className="text-xs text-dark-400">Before & After</p>
                  </div>
                </div>
                <div className="bg-dark-900 rounded-lg p-4 text-sm text-dark-300 leading-relaxed">
                  <p>✨ Transform your space! ✨</p>
                  <p className="mt-2">Check out this incredible bathroom renovation we just completed in Sydney. From outdated to absolutely stunning! 🛁</p>
                  <p className="mt-2">Swipe to see the before 👉</p>
                  <p className="mt-3 text-dark-500">#BathroomRenovation #Sydney #HomeImprovement #BeforeAndAfter #Renovation...</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="btn-secondary btn-sm flex-1">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerate
                  </button>
                  <button className="btn-primary btn-sm flex-1">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/20 rounded-full blur-3xl" />
            </div>
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
                  "Business Card Generator with QR",
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
                <li><Link href="/privacy" className="text-dark-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-dark-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:contact@brickprofile.com" className="text-dark-400 hover:text-white transition-colors">Contact</a></li>
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
