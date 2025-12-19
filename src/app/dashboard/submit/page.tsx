"use client";

import { Suspense } from "react";

import { useState, useRef, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { chatWithGrievanceAI, Message, ChatResponse } from "@/app/actions/chat-grievance";
import { saveDraft, getDrafts } from "@/app/actions/draft-grievance";
import { useRouter, useSearchParams } from "next/navigation";
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

function SubmitGrievanceContent() {
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

    const [grievanceData, setGrievanceData] = useState<Partial<ChatResponse['extractedData']>>({});

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

    const [draftId, setDraftId] = useState<string | null>(null);
    const [drafts, setDrafts] = useState<any[]>([]);
    const router = useRouter();

    // Load drafts on mount
    useEffect(() => {
        getDrafts().then(setDrafts);
    }, []);

    // Autosave Effect
    useEffect(() => {
        if (messages.length > 1) {
            const timer = setTimeout(async () => {
                const res = await saveDraft(draftId, messages, grievanceData);
                if (res.data && !draftId) {
                    setDraftId(res.data.id);
                    // Refresh drafts list
                    getDrafts().then(setDrafts);
                }
            }, 2000); // Autosave every 2s of inactivity
            return () => clearTimeout(timer);
        }
    }, [messages, grievanceData, draftId]);

    const handleLoadDraft = (draft: any) => {
        setDraftId(draft.id);
        setMessages(draft.chat_history || []);
        setGrievanceData(draft.extracted_data || {});
        setHasStarted(true);
    };

    const handleSendMessage = async (text: string) => {
        if ((!text.trim() && !base64) || isLoading) return;

        if (!hasStarted) setHasStarted(true);

        const userMsg: Message = { role: "user", content: text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setSuggestedReplies([]);
        setIsLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await chatWithGrievanceAI(history, text, grievanceData, base64);

            if (base64) clearImage();

            if (response) {
                if (response.isError) {
                    toast.error(response.message);
                    return;
                }

                setGrievanceData(prev => ({
                    ...prev,
                    ...Object.fromEntries(
                        Object.entries(response.extractedData).filter(([_, v]) => v !== null && v !== undefined)
                    )
                }));

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
                    // Show Success Modal instead of auto-redirecting
                    setSuccessData({
                        id: draftId || "new",
                        priority: response.extractedData.priority || "Medium",
                        department: response.extractedData.category || "General", // Infer department from category for now
                        sla: response.extractedData.priority === 'High' ? '24 Hrs' : '48 Hrs',
                        summary: response.extractedData.summary || "No summary available."
                    });
                    setShowSuccessModal(true);

                    // Background save
                    saveDraft(draftId, [...messages, userMsg, aiMsg], {
                        ...grievanceData,
                        ...response.extractedData
                    }).then(res => {
                        if (res.data && !draftId) setDraftId(res.data.id);
                    });
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

    const searchParams = useSearchParams();
    const [showDraftsMobile, setShowDraftsMobile] = useState(false);

    // Auto-open drafts on mobile if view=drafts
    useEffect(() => {
        if (searchParams.get('view') === 'drafts') {
            setShowDraftsMobile(true);
        }
    }, [searchParams]);

    const handleSaveAndExit = async () => {
        setIsLoading(true);
        try {
            const res = await saveDraft(draftId, messages, grievanceData);
            if (res.data || (draftId && !res.error)) { // If we have a draft ID (either new or existing) and no error
                toast.success("Added to Drafts (Cart)!");
                router.push("/dashboard/drafts");
            } else {
                toast.error(res.error || "Failed to save draft");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-[calc(100vh-8rem)]">
            {/* Persistent Drafts Sidebar */}
            {(drafts.length > 0) && (
                <>
                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setShowDraftsMobile(!showDraftsMobile)}
                        className="lg:hidden absolute top-0 left-0 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700"
                    >
                        <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>

                    {/* Sidebar Container */}
                    <div className={cn(
                        "fixed lg:absolute left-0 top-0 h-full w-64 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 z-40 transition-transform duration-300 ease-in-out transform",
                        showDraftsMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                        "lg:bg-transparent lg:border-none lg:backdrop-blur-none" // Reset for desktop
                    )}>
                        <div className="p-4 h-full overflow-y-auto">
                            <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2 px-2">
                                <FileText className="w-4 h-4" />
                                Your Drafts
                            </h3>
                            <div className="space-y-2">
                                {drafts.map(draft => (
                                    <div
                                        key={draft.id}
                                        onClick={() => {
                                            handleLoadDraft(draft);
                                            setShowDraftsMobile(false);
                                        }}
                                        className="group p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                                    >
                                        <p className="font-medium text-sm text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {draft.description || "Untitled Draft"}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                                                {draft.category || "General"}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(draft.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Main Content Area */}
            <div className={cn(
                "h-full transition-all duration-300",
                drafts.length > 0 ? "lg:pl-64" : ""
            )}>
                {!hasStarted ? (
                    <div className="h-full flex flex-col items-center justify-center p-4">
                        <div className="w-full max-w-3xl flex flex-col items-center space-y-8">
                            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white text-center">
                                {t("submit_hero_title")}
                            </h1>

                            {/* Input Container */}
                            <div className="w-full bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow p-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                />

                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 px-2"
                                    placeholder={isListening ? t("listening") : t("ask_anything")}
                                    autoFocus
                                />

                                <div className="flex justify-between items-center mt-4 px-1">
                                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-600/50 whitespace-nowrap"
                                        >
                                            <Camera className="w-3.5 h-3.5" />
                                            {t("upload_btn")}
                                        </button>
                                        <button
                                            onClick={() => setShowLocationManager(true)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-600/50 whitespace-nowrap"
                                        >
                                            <MapPin className="w-3.5 h-3.5" />
                                            {t("location_btn")}
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleSendMessage(inputValue)}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="p-2 rounded-full transition-all duration-300 shrink-0 ml-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col relative">
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
                            <button
                                onClick={handleSaveAndExit}
                                className="px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Save & Exit
                            </button>
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

                            <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-white/20">
                                <div className="max-w-3xl mx-auto w-full space-y-4">
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
                    </div>
                )}
            </div>

            {showLocationManager && (
                <LocationManager
                    onLocationSelected={handleLocationSelected}
                    onCancel={() => setShowLocationManager(false)}
                />
            )}

            <SubmissionSuccessModal
                isOpen={showSuccessModal}
                onClose={handleSaveAndExit}
                onDismiss={() => setShowSuccessModal(false)}
                onChallenge={handleChallengePriority}
                data={successData || {
                    id: "...",
                    priority: "Medium",
                    department: "General",
                    sla: "48 Hrs",
                    summary: "Processing..."
                }}
            />
        </div>
    );
}

export default function SubmitGrievancePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
            <SubmitGrievanceContent />
        </Suspense>
    );
}
