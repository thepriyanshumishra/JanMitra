"use client";

import { useState, useRef, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { chatWithGrievanceAI, Message, ChatResponse } from "@/app/actions/chat-grievance";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { SuretyGauge } from "@/components/chat/SuretyGauge";
import { Send, Sparkles, ArrowRight, Camera, MapPin, QrCode, FileText, Mic } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useImageUpload } from "@/hooks/useImageUpload";
import { getAddressFromCoords } from "@/app/actions/get-address";
import { X, Loader2 } from "lucide-react";
import { SubmissionSuccessModal } from "@/components/chat/SubmissionSuccessModal";
import { LocationManager } from "@/components/chat/LocationManager";

import { useLanguage } from "@/context/LanguageContext";

export default function SubmitGrievancePage() {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm Jan-Mitra. I can help you file a grievance quickly. What seems to be the problem today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suretyScore, setSuretyScore] = useState(0);
    const [suggestedReplies, setSuggestedReplies] = useState<string[]>(["Pothole on the road", "Garbage not collected", "Street light broken"]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [hasStarted, setHasStarted] = useState(false);
    const [showUploadZone, setShowUploadZone] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLocationManager, setShowLocationManager] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);

    const { isListening, startListening, stopListening, hasSupport } = useSpeechRecognition({
        onResult: (transcript) => setInputValue(transcript),
    });

    const { image, previewUrl, base64, handleImageSelect, clearImage } = useImageUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if ((!text.trim() && !base64) || isLoading) return;

        // Transition to chat mode on first message
        if (!hasStarted) setHasStarted(true);

        // Add user message
        const userMsg: Message = { role: "user", content: text };
        // If image exists, we could add it to the message content for display, 
        // but for now we'll just send it to the AI. 
        // Ideally Message type should support images, but let's keep it simple for now.

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setSuggestedReplies([]);
        setIsLoading(true);

        try {
            // Call AI
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await chatWithGrievanceAI(history, text, base64);

            if (base64) clearImage();

            if (response) {
                if (response.isError) {
                    toast.error(response.message);
                    return;
                }

                const aiMsg: Message = { role: "assistant", content: response.message };
                setMessages(prev => [...prev, aiMsg]);
                setSuretyScore(response.suretyScore);
                setSuggestedReplies(response.suggestedReplies);

                if (response.requestEvidence) {
                    setShowUploadZone(true);
                    toast.info("Please upload any evidence you have.");
                }

                if (response.requestLocation) {
                    setShowLocationManager(true);
                }

                if (response.isComplete) {
                    setSuccessData({
                        id: "GRV-" + Math.floor(Math.random() * 10000),
                        priority: response.extractedData.priority || "Medium",
                        department: response.extractedData.department || "General Administration",
                        sla: response.extractedData.sla || "48 Hours",
                        summary: response.extractedData.summary || "Grievance reported via Jan-Mitra AI"
                    });
                    setShowSuccessModal(true);
                }
            } else {
                toast.error("AI Connection Failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChallengePriority = () => {
        setShowSuccessModal(false);
        const challengeMsg: Message = {
            role: "assistant",
            content: "I understand you want to challenge the priority. Please explain why you feel this issue requires urgent attention."
        };
        setMessages(prev => [...prev, challengeMsg]);
        setSuggestedReplies(["Safety Hazard", "Blocking Traffic", "Medical Emergency"]);
    };

    const handleLocationSelected = (location: string) => {
        setShowLocationManager(false);
        setInputValue(prev => {
            const newValue = prev ? `${prev} [Location: ${location}] ` : `[Location: ${location}] `;
            return newValue;
        });
        // Small delay to ensure state update and modal close before focus
        setTimeout(() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            input?.focus();
        }, 100);
    };

    // Initial Hero Screen
    if (!hasStarted) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center relative p-4">
                <div className="w-full max-w-3xl flex flex-col items-center space-y-8">
                    {/* Hero Text */}
                    <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">
                        {t("submit_hero_title")}
                    </h1>

                    {/* ChatGPT-style Input Container */}
                    <div className="w-full bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow p-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                        />

                        {previewUrl && (
                            <div className="mb-2 relative inline-block">
                                <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-200 dark:border-slate-700" />
                                <button
                                    onClick={clearImage}
                                    className="absolute -top-2 -right-2 p-1 bg-slate-900 text-white rounded-full hover:bg-slate-700"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                            className="w-full bg-transparent border-none focus:ring-0 outline-none text-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 px-2"
                            placeholder={isListening ? t("listening") : t("ask_anything")}
                            autoFocus
                        />

                        {/* Bottom Actions Row */}
                        <div className="flex justify-between items-center mt-4 px-1">
                            {/* Left Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-600/50"
                                >
                                    <Camera className="w-3.5 h-3.5" />
                                    {t("upload_btn")}
                                </button>
                                <button
                                    onClick={() => setShowLocationManager(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-600/50"
                                >
                                    <MapPin className="w-3.5 h-3.5" />
                                    {t("location_btn")}
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-600/50">
                                    <QrCode className="w-3.5 h-3.5" />
                                    {t("scan_btn")}
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-600/50">
                                    <FileText className="w-3.5 h-3.5" />
                                    {t("track_btn")}
                                </button>
                            </div>

                            {/* Right Action (Voice) */}
                            <button
                                onClick={toggleListening}
                                className={cn(
                                    "p-2 rounded-full transition-all duration-300",
                                    isListening
                                        ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                                )}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col relative">
            {/* Header with Gauge */}
            <div className="absolute top-4 right-4 z-10">
                <SuretyGauge score={suretyScore} />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    <div className="max-w-3xl mx-auto w-full space-y-6 pb-20">
                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} role={msg.role as "user" | "assistant"} content={msg.content} />
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-slate-400 text-sm ml-4">
                                <Sparkles className="w-4 h-4 animate-spin" />
                                <span className="animate-pulse">Thinking...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-white/20">
                    <div className="max-w-3xl mx-auto w-full space-y-4">
                        {/* Upload Zone (Conditional) */}
                        {showUploadZone && !previewUrl && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                                <Camera className="w-8 h-8 text-blue-500 mb-2" />
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tap to upload evidence</p>
                                <p className="text-xs text-slate-500 mt-1">Photos or videos help us resolve issues faster</p>
                            </div>
                        )}

                        {/* Quick Replies */}
                        {suggestedReplies.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {suggestedReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(reply)}
                                        className="whitespace-nowrap px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Text Input */}
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                                placeholder={isListening ? "Listening..." : "Type your message..."}
                                className="flex-1 bg-white dark:bg-slate-800 border-none rounded-xl px-4 py-3 shadow-lg focus:ring-0 outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                                disabled={isLoading}
                            />
                            {previewUrl && (
                                <div className="absolute left-4 bottom-16 z-10">
                                    <div className="relative inline-block">
                                        <img src={previewUrl} alt="Preview" className="h-16 w-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg" />
                                        <button
                                            onClick={clearImage}
                                            className="absolute -top-2 -right-2 p-1 bg-slate-900 text-white rounded-full hover:bg-slate-700"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={toggleListening}
                                className={cn(
                                    "p-3 rounded-xl shadow-lg transition-all duration-300",
                                    isListening
                                        ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                )}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleSendMessage(inputValue)}
                                disabled={!inputValue.trim() || isLoading}
                                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SubmissionSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onChallenge={handleChallengePriority}
                data={successData || {
                    id: "",
                    priority: "",
                    department: "",
                    sla: "",
                    summary: ""
                }}
            />

            {showLocationManager && (
                <LocationManager
                    onLocationSelected={handleLocationSelected}
                    onCancel={() => setShowLocationManager(false)}
                />
            )}
        </div>
    );
}
