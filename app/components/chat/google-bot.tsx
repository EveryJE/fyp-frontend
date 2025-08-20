import { useFetcher } from "@remix-run/react";
import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
    id: number;
    text: string;
    sender: "user" | "bot";
    suggestions?: string[];
};

const Suggestions: React.FC<{ suggestions: string[], onSelect: (suggestion: string) => void }> = ({ suggestions, onSelect }) => {
    return (
        <div className="mt-2 flex flex-wrap justify-start gap-1.5">
            {suggestions.map((s, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(s)}
                    className="py-1.5 px-2.5 inline-flex items-center gap-x-1.5 text-sm text-gray-800 bg-gray-100 hover:text-cyan-700 rounded-lg focus:outline-none focus:text-cyan-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:text-slate-400"
                >
                    {s}
                </button>
            ))}
        </div>
    );
};

export function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! How can I help you with events and timetables today?",
            sender: "bot",
            suggestions: ["View upcoming events", "Check my timetable", "Find campus resources"],
        },
    ]);
    const [message, setMessage] = useState('');
    const fetcher = useFetcher<{ reply: string, suggestions?: string[] }>();
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const isSubmitting = fetcher.state === "submitting";

    // Handle form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const messageText = message.trim();
        if (!messageText) return;

        setMessages((prev) => [...prev, { id: Date.now(), text: messageText, sender: "user" }]);
        fetcher.submit({ message: messageText }, { method: "POST", action: "/api/chatbot", encType: "application/json" });
        setMessage('');
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: string) => {
        setMessages((prev) => [...prev, { id: Date.now(), text: suggestion, sender: "user" }]);
        fetcher.submit({ message: suggestion }, { method: "POST", action: "/api/chatbot", encType: "application/json" });
        setMessage('');
    };

    // Handle Enter key press
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !isSubmitting && message.trim()) {
            event.preventDefault();
            formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    // Add bot's reply to messages when fetcher returns data
    useEffect(() => {
        if (fetcher.data && fetcher.state === "idle") {
            setMessages((prev) => [...prev, {
                id: Date.now(),
                text: fetcher.data.reply,
                sender: "bot",
                suggestions: fetcher.data.suggestions || [],
            }]);
        }
    }, [fetcher.data, fetcher.state]);

    // Auto-scroll to the latest message
    useEffect(() => {
        chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
    }, [messages]);

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                type="button"
                className="fixed bottom-4 right-4 bg-cyan-700 text-white p-4 rounded-full shadow-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 z-[80]"
                data-hs-overlay="#chatbot-modal"
            >
                <MessageCircle size={24} />
            </button>

            {/* Preline Modal */}
            <div
                id="chatbot-modal"
                className="hs-overlay hidden size-full fixed bottom-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none hs-overlay-backdrop-open:bg-transparent"
                role="dialog"
                tabIndex={-1}
                aria-labelledby="chatbot-modal-label"
            >
                <div className="hs-overlay-open:mt-0 hs-overlay-open:opacity-100 hs-overlay-open:scale-100 hs-overlay-open:duration-300 opacity-0 scale-95 transition-all max-w-full max-h-full h-full sm:absolute sm:bottom-4 sm:right-4 sm:max-w-md sm:h-auto sm:max-h-[90vh]">
                    <div className="flex flex-col bg-white pointer-events-auto max-w-full max-h-full h-full sm:max-w-md sm:h-auto sm:border sm:rounded-xl sm:shadow-2xs dark:bg-slate-800 sm:dark:border-slate-700">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 dark:border-slate-700">
                            <h3 id="chatbot-modal-label" className="font-bold text-gray-800 dark:text-white">
                                Campus Assistant
                            </h3>
                            <button
                                type="button"
                                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-400 dark:focus:bg-slate-600"
                                aria-label="Close"
                                data-hs-overlay="#chatbot-modal"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18"></path>
                                    <path d="M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div ref={chatBoxRef} className="flex-1 p-4 space-y-4 overflow-y-auto sm:max-h-[65svh]">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="max-w-xs">
                                        <p
                                            className={`rounded-lg px-3 py-2 whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                                        >
                                            {msg.text}
                                        </p>
                                        {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                                            <Suggestions suggestions={msg.suggestions} onSelect={handleSuggestionSelect} />
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isSubmitting && (
                                <div className="flex justify-start">
                                    <p className="max-w-xs rounded-lg px-3 py-2 bg-gray-200 text-gray-500 animate-pulse">
                                        Typing...
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer with ChatInput */}
                        <form ref={formRef} onSubmit={handleSubmit} className="order-t border-gray-200 dark:border-slate-700 mt-auto sm:mt-0">
                            <div className="bg-white/10 border border-gray-300 backdrop-blur-sm rounded-2xl shadow-xs dark:bg-slate-800/10 dark:border-slate-600">
                                <div className="pb-2 px-2">
                                    <textarea
                                        id="hs-pro-aimt"
                                        className="max-h-20  p-2 ps-2 block w-full bg-transparent border-transparent resize-none text-gray-800 placeholder-gray-500 focus:outline-none focus:border-transparent focus:ring-transparent dark:text-slate-200 dark:placeholder-slate-500"
                                        placeholder="Ask anything..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isSubmitting}
                                        data-hs-textarea-auto-height
                                    />
                                    <div className=" flex justify-between items-center gap-x-1">
                                        <div className="flex items-center gap-x-1">
                                            <button type="button" className="flex justify-center items-center size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-700">
                                                <svg className="shrink-0 size-4.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                            </button>
                                            <button type="button" className="flex justify-center items-center size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-700">
                                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            className="inline-flex shrink-0 justify-center items-center size-8 text-sm font-medium rounded-lg text-white bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 disabled:pointer-events-none"
                                            disabled={!message.trim() || isSubmitting}
                                        >
                                            <span className="sr-only">Send</span>
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}