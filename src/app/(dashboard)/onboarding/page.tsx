"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { ChatBubble } from "@/components/onboarding/ChatBubble";
import { PhotoUploader } from "@/components/onboarding/PhotoUploader";
import { TemplateSelector } from "@/components/onboarding/TemplateSelector";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Check,
  Send,
  X,
  AlertCircle,
  Edit3,
} from "lucide-react";
import Link from "next/link";
import type { Site } from "@/lib/types";

const STEPS = ["Tell us about you", "Upload photos", "Choose template", "Publish"];

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

interface OnboardingData {
  companyName: string;
  contractorType: string;
  services: string[];
  serviceDetails: string;
  experience: string;
  teamSize: string;
  areas: string;
  specialties: string;
  uniqueValue: string;
  phone: string;
  email: string;
}

interface UploadedPhoto {
  id: string;
  url: string;
  file?: File;
  category?: string;
  caption?: string;
  uploading?: boolean;
}

const questions = [
  { key: "companyName", question: "What's your company name?" },
  {
    key: "contractorType",
    question: "What type of contractor are you? (e.g., general contractor, roofer, plumber, electrician, bathroom specialist, kitchen fitter)",
  },
  {
    key: "services",
    question: "List all the services you offer, separated by commas (e.g., full bathroom renovations, tile installation, underfloor heating, walk-in showers)",
  },
  {
    key: "serviceDetails",
    question: "Describe what a typical project looks like for your main service. What does it include? What materials do you use? What's the process from start to finish?",
  },
  {
    key: "experience",
    question: "How many years have you been in business? Tell me about your background.",
  },
  {
    key: "teamSize",
    question: "How big is your team? Do you work alone, with employees, or with subcontractors?",
  },
  {
    key: "areas",
    question: "Where are you based and how far do you travel? (e.g., \"Sydney, 30km radius\" or \"Manchester and surrounding areas\")",
  },
  {
    key: "specialties",
    question: "What certifications, qualifications, or accreditations do you have? (e.g., Gas Safe, NICEIC, City & Guilds, trade body memberships)",
  },
  {
    key: "uniqueValue",
    question: "What makes you different from other contractors? Why should customers choose you?",
  },
  { key: "phone", question: "What's your contact phone number?" },
  { key: "email", question: "What's your business email?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [existingSite, setExistingSite] = useState<{ id: string; company_name: string; slug: string } | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Check if user already has a site
  useEffect(() => {
    const checkExistingSite = async () => {
      try {
        const response = await fetch("/api/sites");
        if (response.ok) {
          const { sites } = await response.json();
          if (sites && sites.length > 0) {
            setExistingSite(sites[0]);
          }
        }
      } catch (error) {
        console.error("Error checking existing sites:", error);
      } finally {
        setCheckingExisting(false);
      }
    };
    checkExistingSite();
  }, []);

  // Step 1: Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm here to help you create your portfolio website. Let me ask you a few questions to get started.",
      isBot: true,
    },
    {
      id: "2",
      text: questions[0].question,
      isBot: true,
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState("");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyName: "",
    contractorType: "",
    services: [],
    serviceDetails: "",
    experience: "",
    teamSize: "",
    areas: "",
    specialties: "",
    uniqueValue: "",
    phone: "",
    email: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Step 2: Photos
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  // Step 3: Template
  const [selectedTemplate, setSelectedTemplate] =
    useState<Site["template"]>("classic");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");

  // Generated content from AI
  const [generatedContent, setGeneratedContent] = useState<{
    headline: string;
    aboutText: string;
    serviceDescriptions: Record<string, string>;
  } | null>(null);

  // Service expansion state
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [suggestedServices, setSuggestedServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConfirmServices = () => {
    // Update onboarding data with selected services
    setOnboardingData((prev) => ({
      ...prev,
      services: selectedServices,
    }));

    setShowServiceSelector(false);

    // Continue to next question
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `Great! You've selected ${selectedServices.length} services: ${selectedServices.slice(0, 3).join(", ")}${selectedServices.length > 3 ? ` and ${selectedServices.length - 3} more` : ""}.`,
        isBot: true,
      },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: questions[currentQuestion + 1].question,
          isBot: true,
        },
      ]);
      setCurrentQuestion((prev) => prev + 1);
    }, 500);
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userMessage, isBot: false },
    ]);

    // Parse the answer based on current question
    const question = questions[currentQuestion];
    const updatedData = { ...onboardingData };

    if (question.key === "services") {
      updatedData[question.key] = userMessage.split(",").map((s) => s.trim());
    } else {
      (updatedData as unknown as Record<string, string>)[question.key] = userMessage;
    }

    setOnboardingData(updatedData);

    // Special handling for services - expand them with AI
    if (question.key === "services") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Let me suggest some specific services based on what you do...",
          isBot: true,
        },
      ]);

      setLoadingServices(true);

      try {
        const response = await fetch("/api/ai/expand-services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractorType: updatedData.contractorType,
            services: updatedData.services,
          }),
        });

        const data = await response.json();

        if (response.ok && data.expandedServices && data.expandedServices.length > 0) {
          setSuggestedServices(data.expandedServices);
          setSelectedServices(data.expandedServices); // All selected by default
          setShowServiceSelector(true);

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: `I've expanded your services into ${data.expandedServices.length} specific offerings. Uncheck any that don't apply to you, then click 'Confirm Services' to continue.`,
              isBot: true,
            },
          ]);
        } else {
          throw new Error(data.error || "Failed to expand services");
        }
      } catch (error) {
        console.error("Expand services error:", error);
        // Fallback - just use what they typed
        setSuggestedServices(updatedData.services);
        setSelectedServices(updatedData.services);
        setShowServiceSelector(true);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: "Please confirm your services below, then click 'Confirm Services' to continue.",
            isBot: true,
          },
        ]);
      }

      setLoadingServices(false);
      return; // Don't proceed to next question yet
    }

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: questions[currentQuestion + 1].question,
            isBot: true,
          },
        ]);
        setCurrentQuestion((prev) => prev + 1);
      }, 500);
    } else {
      // All questions answered - generate content
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Perfect! Let me generate your website content...",
          isBot: true,
        },
      ]);

      setLoading(true);

      try {
        const response = await fetch("/api/ai/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: updatedData }),
        });

        if (response.ok) {
          const content = await response.json();
          setGeneratedContent(content);

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: `I've generated your website content:\n\n**Headline:** ${content.headline}\n\nClick "Next" to continue uploading photos!`,
              isBot: true,
            },
          ]);
        } else {
          throw new Error("Failed to generate content");
        }
      } catch (error) {
        // Fallback content - use the data we have
        const fallbackContent = {
          headline: `Expert ${updatedData.contractorType || updatedData.services[0] || "Contracting"} Services`,
          aboutText: `${updatedData.companyName} is a professional ${updatedData.contractorType || 'contracting'} business with ${updatedData.experience} experience serving ${updatedData.areas || 'the local area'}.\n\nWe specialise in ${updatedData.services.join(", ")}, bringing expertise and attention to detail to every project.${updatedData.specialties ? ` Our team holds ${updatedData.specialties} certifications.` : ''}\n\n${updatedData.uniqueValue || 'What sets us apart is our commitment to customer satisfaction and quality craftsmanship.'}\n\nContact us today to discuss your project and get a free quote.`,
          serviceDescriptions: Object.fromEntries(
            updatedData.services.map((s) => [
              s,
              `Our ${s.toLowerCase()} service provides comprehensive solutions tailored to your needs. We handle everything from initial consultation through to completion, using quality materials and proven techniques.`,
            ])
          ),
        };
        setGeneratedContent(fallbackContent);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: `I've created your website content. Click "Next" to continue uploading photos!`,
            isBot: true,
          },
        ]);
      }

      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);

    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...onboardingData,
          generatedContent,
          photos: photos.map((p) => ({
            url: p.url,
            category: p.category,
            caption: p.caption,
          })),
          template: selectedTemplate,
          primaryColor,
        }),
      });

      if (response.ok) {
        const { site } = await response.json();
        router.push(`/editor?created=true`);
        router.refresh();
      } else {
        throw new Error("Failed to create site");
      }
    } catch (error) {
      console.error("Error publishing:", error);
      alert("Failed to create your site. Please try again.");
    }

    setPublishing(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return generatedContent !== null;
      case 1:
        return photos.length > 0;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Show loading while checking for existing site
  if (checkingExisting) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  // Show notice if user already has a site
  if (existingSite) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-amber-500/10">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">You already have a portfolio</h2>
              <p className="text-dark-400 mb-4">
                You have an existing portfolio for <strong className="text-white">{existingSite.company_name}</strong>.
                On the free plan, you can have 1 portfolio. You can edit your existing site or upgrade to Pro for multiple portfolios.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/editor" className="btn-primary btn-md">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Your Portfolio
                </Link>
                <Link href={`/site/${existingSite.slug}`} target="_blank" className="btn-secondary btn-md">
                  View Live Site
                </Link>
                <Link href="/upgrade" className="btn-ghost btn-md text-brand-400">
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Step content */}
      <div className="card min-h-[500px] flex flex-col">
        {/* Step 0: Chat */}
        {currentStep === 0 && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[400px]">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-dark-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating content...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Service selector */}
            {showServiceSelector && (
              <div className="p-4 border-t border-dark-800">
                <div className="mb-3">
                  <p className="text-sm text-dark-400 mb-2">
                    Select the services you offer ({selectedServices.length} selected):
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                    {suggestedServices.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                          selectedServices.includes(service)
                            ? "bg-brand-500 text-white"
                            : "bg-dark-800 text-dark-400 hover:bg-dark-700"
                        }`}
                      >
                        {selectedServices.includes(service) && (
                          <Check className="w-3 h-3" />
                        )}
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleConfirmServices}
                  disabled={selectedServices.length === 0}
                  className="btn-primary btn-md w-full"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Services ({selectedServices.length})
                </button>
              </div>
            )}

            {/* Input form */}
            {currentQuestion < questions.length && !generatedContent && !showServiceSelector && (
              <div className="p-4 border-t border-dark-800">
                {/* Question counter */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-dark-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <div className="flex gap-1">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx < currentQuestion
                            ? "bg-brand-500"
                            : idx === currentQuestion
                            ? "bg-brand-400"
                            : "bg-dark-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  {/* Use textarea for questions that need longer answers */}
                  {["serviceDetails", "uniqueValue"].includes(questions[currentQuestion].key) ? (
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your answer... (be as detailed as you can)"
                      className="input flex-1 min-h-[100px] resize-none"
                      disabled={loading || loadingServices}
                      rows={4}
                    />
                  ) : (
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your answer..."
                      className="input flex-1"
                      disabled={loading || loadingServices}
                    />
                  )}
                  <button
                    type="submit"
                    disabled={!input.trim() || loading || loadingServices}
                    className="btn-primary btn-md self-end"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Photos */}
        {currentStep === 1 && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Upload Your Work</h2>
              <p className="text-dark-400">
                Add photos of your completed projects. Our AI will automatically
                categorize them.
              </p>
            </div>
            <PhotoUploader photos={photos} onPhotosChange={setPhotos} />
          </div>
        )}

        {/* Step 2: Template */}
        {currentStep === 2 && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Choose Your Style</h2>
              <p className="text-dark-400">
                Select a template that best represents your brand.
              </p>
            </div>

            <TemplateSelector
              selected={selectedTemplate}
              onSelect={setSelectedTemplate}
            />

            <div className="mt-6">
              <label className="label">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="input w-32"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Publish */}
        {currentStep === 3 && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Ready to Launch!</h2>
              <p className="text-dark-400">
                Review your settings and publish your portfolio website.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-dark-800/50">
                <h3 className="font-medium mb-2">Summary</h3>
                <ul className="space-y-2 text-sm text-dark-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Company: {onboardingData.companyName}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Services: {onboardingData.services.join(", ")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    {photos.length} photos uploaded
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Template: {selectedTemplate}
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  <h3 className="font-medium">AI-Generated Content</h3>
                </div>
                <p className="text-sm text-dark-300">
                  <strong>Headline:</strong> {generatedContent?.headline}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="p-4 border-t border-dark-800 flex justify-between">
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
            className="btn-secondary btn-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceed()}
              className="btn-primary btn-md"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="btn-primary btn-md"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Publish Website
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
