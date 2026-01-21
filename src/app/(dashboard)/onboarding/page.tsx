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
} from "lucide-react";
import type { Site } from "@/lib/types";

const STEPS = ["Tell us about you", "Upload photos", "Choose template", "Publish"];

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

interface OnboardingData {
  companyName: string;
  services: string[];
  experience: string;
  areas: string[];
  specialties: string;
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
    key: "services",
    question:
      "What services do you offer? (e.g., bathroom renovations, kitchen remodeling, roofing)",
  },
  { key: "experience", question: "How many years of experience do you have?" },
  {
    key: "areas",
    question: "What areas do you serve? (e.g., London, Manchester, Birmingham)",
  },
  {
    key: "specialties",
    question:
      "What makes your work special? Any certifications or specialties?",
  },
  { key: "phone", question: "What's your contact phone number?" },
  { key: "email", question: "What's your business email?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

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
    services: [],
    experience: "",
    areas: [],
    specialties: "",
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

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    if (question.key === "services" || question.key === "areas") {
      updatedData[question.key] = userMessage.split(",").map((s) => s.trim());
    } else {
      (updatedData as unknown as Record<string, string>)[question.key] = userMessage;
    }

    setOnboardingData(updatedData);

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
        // Fallback content
        const fallbackContent = {
          headline: `Quality ${updatedData.services[0] || "Contracting"} Services`,
          aboutText: `With ${updatedData.experience} years of experience, ${updatedData.companyName} provides professional ${updatedData.services.join(", ")} services in ${updatedData.areas.join(", ")}. ${updatedData.specialties}`,
          serviceDescriptions: Object.fromEntries(
            updatedData.services.map((s) => [
              s,
              `Professional ${s.toLowerCase()} services tailored to your needs.`,
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

            {currentQuestion < questions.length && !generatedContent && (
              <div className="p-4 border-t border-dark-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer..."
                    className="input flex-1"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="btn-primary btn-md"
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
