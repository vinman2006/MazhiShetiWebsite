"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  Stethoscope,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  FileText,
  Upload,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Bot,
  User,
  Trees,
  Cpu,
  Leaf,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
} from "lucide-react";
import { AiConversationRecord, AiMessageRecord, AiRecommendationRecord } from "@/db/seed-data";

export default function AdvisoryPage() {
  const {
    data,
    createAiConversation,
    sendAiMessage,
    recordAiFeedback,
    dismissRecommendation,
    addConsultation,
  } = useAppState();

  const farmer = data.users.find((u) => u.role === "farmer") || data.users[0];
  const conversations = data.aiConversations || [];
  const messages = data.aiMessages || [];
  const recommendations = (data.aiRecommendations || []).filter((r) => r.status === "active");

  const [currentConvId, setCurrentConvId] = useState<string>(
    conversations[0]?.id || "conv_01"
  );
  const [selectedLang, setSelectedLang] = useState<"mr" | "hi" | "en">(
    conversations[0]?.language || "mr"
  );
  const [inputQuery, setInputQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down">>({});
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // Human Doctor ticket state
  const [consultCrop, setConsultCrop] = useState("Cotton (कापूस)");
  const [consultTitle, setConsultTitle] = useState("");
  const [consultDesc, setConsultDesc] = useState("");
  const [consultUrgency, setConsultUrgency] = useState<"low" | "medium" | "high" | "critical">("medium");

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, currentConvId]);

  const activeConversation = conversations.find((c) => c.id === currentConvId) || conversations[0];
  const activeMessages = messages.filter((m) => m.conversationId === activeConversation?.id);

  const handleStartNewChat = () => {
    const title =
      selectedLang === "mr"
        ? "नवीन शेती सल्लागार सत्र"
        : selectedLang === "hi"
        ? "नया कृषि परामर्श सत्र"
        : "New Farming Consultation";
    const newConv = createAiConversation(title, selectedLang);
    setCurrentConvId(newConv.id);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim() && !selectedImage) return;

    setInputQuery("");
    const img = selectedImage || undefined;
    setSelectedImage(null);
    setIsSending(true);

    try {
      await sendAiMessage(currentConvId, textToSend, selectedLang, img);
    } catch (e) {
      console.error("AI send error", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleRate = (msgId: string, rating: "thumbs_up" | "thumbs_down") => {
    recordAiFeedback(msgId, rating);
    setFeedbackGiven((prev) => ({ ...prev, [msgId]: rating === "thumbs_up" ? "up" : "down" }));
  };

  const handleHumanConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultTitle || !consultDesc) return;
    addConsultation(consultCrop, consultTitle, consultDesc, consultUrgency);
    setShowConsultationModal(false);
    setConsultTitle("");
    setConsultDesc("");
    alert("Consultation ticket submitted to university agronomists at PDKV Akola!");
  };

  const sampleLeafImages = [
    {
      label: "Cotton Whitefly Yellowing",
      labelMarathi: "कापूस पांढरी माशी व पिवळेपणा",
      url: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600",
    },
    {
      label: "Soybean Rust / Leaf Spot",
      labelMarathi: "सोयाबीन तांबेरा व ठिपके",
      url: "https://images.unsplash.com/photo-1599818816946-b3cd8ae243d0?auto=format&fit=crop&q=80&w=600",
    },
    {
      label: "Onion Purple Blotch",
      labelMarathi: "कांदा जांभळा करपा",
      url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const quickQuestions = {
    mr: [
      "माझ्या जमिनीच्या माती अहवालानुसार नत्र व खत नियोजन कसे करावे?",
      "कापसावरील बोंडअळी व पांढरी माशी यांवर जैविक दशपर्णी अर्क कसा वापरावा?",
      "रब्बी हरभरा पेरणीसाठी रायझोबियम जीवाणू संवर्धन बीजप्रक्रिया कशी करावी?",
      "ठिबक सिंचनाचे वेळापत्रक जमिनीतील ओलाव्यानुसार कसे ठरवावे?",
    ],
    hi: [
      "मिट्टी परीक्षण रिपोर्ट के अनुसार पोटाश और नाइट्रोजन प्रबंधन कैसे करें?",
      "सोयाबीन में कीट नियंत्रण के लिए जैविक कीटनाशक कैसे बनाएं?",
      "ड्रिप सिंचाई के लिए सर्वोत्तम समय क्या है?",
      "जैविक प्रमाणीकरण NPOP के प्रमुख नियम क्या हैं?",
    ],
    en: [
      "Explain my soil test NPK score and recommend organic nitrogen sources.",
      "How to control cotton whitefly and bollworm using biological IPM?",
      "Schedule drip irrigation based on my 38% root-zone sensor moisture reading.",
      "What are the step-by-step milestones for NPOP C1 organic transition?",
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAFAF0] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-lime-300 text-xs font-bold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>कृत्रिम बुद्धिमत्ता शेती सल्लागार • Context-Aware AI Agronomist</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                MahaAgri AI Assistant & Crop Clinic
              </h1>
              <p className="text-xs text-emerald-200">
                Trained on ICAR & PDKV agronomy protocols. Deeply synchronized with{" "}
                <strong className="text-white">{farmer.fullName}</strong>&apos;s verified farm parcels, soil test audits,
                and root-zone sensors.
              </p>
            </div>

            {/* Language Switcher & Clinic Link */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/10 p-1 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center gap-1 text-xs">
                <button
                  onClick={() => setSelectedLang("mr")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    selectedLang === "mr" ? "bg-white text-emerald-950 shadow-sm" : "text-emerald-200"
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setSelectedLang("hi")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    selectedLang === "hi" ? "bg-white text-emerald-950 shadow-sm" : "text-emerald-200"
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setSelectedLang("en")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    selectedLang === "en" ? "bg-white text-emerald-950 shadow-sm" : "text-emerald-200"
                  }`}
                >
                  English
                </button>
              </div>

              <Button
                variant="accent"
                onClick={() => setShowConsultationModal(true)}
                leftIcon={<Stethoscope className="w-4 h-4" />}
              >
                Human University Agronomist
              </Button>
            </div>
          </div>

          {/* Privacy & Scoped Context Bar */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] text-emerald-200">
            <span className="flex items-center gap-1.5 text-lime-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              Farmer Scoped Context Active:
            </span>
            <span>📍 {farmer.village}, {farmer.district}</span>
            <span>•</span>
            <span>🌱 Cotton (Ajeet-155 BG-II) • 5.5 Ac</span>
            <span>•</span>
            <span>🧪 Soil N: 142 kg/ha (Deficient)</span>
            <span>•</span>
            <span>💧 Sensor Moisture: {data.currentTelemetry?.moisturePct || 38}%</span>
          </div>
        </div>

        {/* Personalized AI Recommendations Action Cards */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Personalized Farm Insights & Actionable Directives ({recommendations.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={rec.urgency === "urgent" ? "danger" : "lime"} size="sm">
                        {rec.urgency.toUpperCase()}
                      </Badge>
                      <button
                        onClick={() => dismissRecommendation(rec.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-600"
                      >
                        Dismiss
                      </button>
                    </div>
                    <h4 className="text-sm font-extrabold text-brand-text leading-snug">
                      {selectedLang === "mr" ? rec.titleMarathi : rec.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {selectedLang === "mr" ? rec.descriptionMarathi : rec.description}
                    </p>
                  </div>

                  {rec.actionRoute && (
                    <div className="pt-2 border-t border-slate-100">
                      <Link href={rec.actionRoute}>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Take Recommended Action →
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversation History Drawer (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-brand-text">Farming Chat Sessions</h3>
                <Button size="sm" variant="accent" onClick={handleStartNewChat} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  New Chat
                </Button>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setCurrentConvId(conv.id);
                      setSelectedLang(conv.language);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs space-y-1 ${
                      currentConvId === conv.id
                        ? "bg-emerald-50/80 border-emerald-600 shadow-sm font-semibold"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 truncate max-w-[200px]">{conv.title}</span>
                      <span className="uppercase text-[10px] font-mono text-slate-500 font-bold">{conv.language}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{conv.lastMessageAt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Vision Assistant Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-brand-text">Sample Crop Vision Diagnostics</h4>
              </div>
              <p className="text-[11px] text-slate-500">
                Click a sample leaf symptom to test computer vision symptom analysis:
              </p>
              <div className="space-y-2">
                {sampleLeafImages.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(s.url);
                      setInputQuery(
                        selectedLang === "mr"
                          ? `${s.labelMarathi} चे निदान करून उपाय सांगा.`
                          : `Diagnose this symptom: ${s.label}`
                      );
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50 flex items-center gap-3 transition text-xs"
                  >
                    <img src={s.url} alt={s.label} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{selectedLang === "mr" ? s.labelMarathi : s.label}</p>
                      <p className="text-[10px] text-emerald-700">Attach Leaf Photo →</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chat Dialogue View (Right 8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden h-[700px]">
            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm">
                  <Bot className="w-5 h-5 text-lime-300" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-brand-text">
                    {activeConversation ? activeConversation.title : "MahaAgri AI Assistant"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Language: <span className="font-semibold uppercase text-emerald-800">{selectedLang}</span> • University PDKV Trained
                  </p>
                </div>
              </div>

              <Badge variant="lime" dot size="sm">
                AI Online
              </Badge>
            </div>

            {/* Messages Dialogue Scroll View */}
            <div ref={chatScrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAFAF0]/40">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-slate-800 text-white"
                        : "bg-emerald-800 text-lime-300"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-4 rounded-3xl space-y-3 text-xs leading-relaxed max-w-xl ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none"
                    }`}
                  >
                    {/* Attached Photo */}
                    {msg.attachedImageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-white/20 max-w-xs">
                        <img src={msg.attachedImageUrl} alt="Crop Leaf" className="w-full h-40 object-cover" />
                      </div>
                    )}

                    <div className="whitespace-pre-line">{msg.content}</div>

                    {/* Computer Vision Diagnosis Card */}
                    {msg.imageAnalysisResult && (
                      <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-2 text-emerald-950">
                        <div className="flex items-center justify-between font-bold text-emerald-900">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            Computer Vision Report
                          </span>
                          <span className="font-mono text-xs bg-emerald-200/80 px-2 py-0.5 rounded-md font-black">
                            {msg.imageAnalysisResult.confidencePct}% Confidence
                          </span>
                        </div>
                        <p className="text-[11px]">
                          <strong>Probable Cause:</strong> {msg.imageAnalysisResult.probableCause}
                        </p>
                      </div>
                    )}

                    {/* Actionable Directives Pills */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, i) => (
                          action.actionRoute ? (
                            <Link key={i} href={action.actionRoute}>
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200 transition">
                                {action.label} →
                              </span>
                            </Link>
                          ) : (
                            <button
                              key={i}
                              onClick={() => handleSend(action.queryText || action.label)}
                              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                            >
                              {action.label}
                            </button>
                          )
                        ))}
                      </div>
                    )}

                    {/* Message Rating */}
                    {msg.sender === "assistant" && (
                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Was this agronomy advice helpful?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRate(msg.id, "thumbs_up")}
                            className={`p-1 rounded hover:bg-slate-100 ${
                              feedbackGiven[msg.id] === "up" ? "text-emerald-600 font-bold" : ""
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRate(msg.id, "thumbs_down")}
                            className={`p-1 rounded hover:bg-slate-100 ${
                              feedbackGiven[msg.id] === "down" ? "text-rose-600 font-bold" : ""
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex gap-3 max-w-xl">
                  <div className="w-8 h-8 rounded-xl bg-emerald-800 text-lime-300 flex items-center justify-center font-bold shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-200 shadow-sm text-xs text-slate-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>Analyzing farm context, soil test NPK values, and university protocols...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions Chips Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Suggested:
              </span>
              {quickQuestions[selectedLang].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-600 text-[11px] text-slate-700 whitespace-nowrap transition shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 bg-white">
              {selectedImage && (
                <div className="mb-3 p-2 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <img src={selectedImage} alt="Preview" className="w-8 h-8 rounded-lg object-cover" />
                    <span>Leaf image attached for AI computer vision diagnosis</span>
                  </div>
                  <button onClick={() => setSelectedImage(null)} className="text-xs text-slate-400 hover:text-rose-600">
                    ✕
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={
                      selectedLang === "mr"
                        ? "पिकाच्या रोगाबद्दल, खतांबद्दल अथवा सिंचनाबद्दल विचारा..."
                        : selectedLang === "hi"
                        ? "फसल रोग, खाद अथवा सिंचाई के बारे में पूछें..."
                        : "Ask about crop diseases, NPK fertilizer, soil carbon, or irrigation..."
                    }
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(sampleLeafImages[0].url)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-emerald-700"
                    title="Attach sample crop leaf photo"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>

                <Button variant="primary" type="submit" disabled={isSending} leftIcon={<Send className="w-4 h-4" />}>
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Modal: Human Expert Clinic Ticket */}
        <Modal
          isOpen={showConsultationModal}
          onClose={() => setShowConsultationModal(false)}
          title="Submit Ticket to University Agronomist (Dr. Anjali Deshmukh, PDKV)"
          description="Direct human review for complex fungal outbreaks, pesticide recommendations, or soil recalibration."
          maxWidth="lg"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowConsultationModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleHumanConsultSubmit}>
                Dispatch Ticket to Agronomist
              </Button>
            </>
          }
        >
          <form onSubmit={handleHumanConsultSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Crop & Variety"
                value={consultCrop}
                onChange={(e) => setConsultCrop(e.target.value)}
                required
              />
              <Input
                label="Issue Title"
                placeholder="e.g. Sudden wilt in Block 2 after heavy rains"
                value={consultTitle}
                onChange={(e) => setConsultTitle(e.target.value)}
                required
              />
            </div>

            <Input
              label="Detailed Field Symptoms"
              placeholder="Describe color, leaf drop, stem discolouration, or root condition"
              value={consultDesc}
              onChange={(e) => setConsultDesc(e.target.value)}
              required
            />

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center justify-between">
              <span>Telemetry Auto-Attachment:</span>
              <span className="font-bold text-emerald-800">
                ✓ Root-zone telemetry (38% moisture, 142 kg/ha N) attached
              </span>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
