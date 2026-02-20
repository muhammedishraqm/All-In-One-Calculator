import React, { useState } from 'react';
import { Sparkles, Send, Bot, Terminal, Loader2 } from 'lucide-react';

export default function AiBuilder() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'system',
            content: "Hi there! I'm your OmniCalc AI Assistant. Describe the custom calculator you want to build, and I'll generate it for you. For example: 'Create a Keto Diet Macro Calculator' or 'Build a freelance tax estimator for California'."
        }
    ]);

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!prompt.trim() || isGenerating) return;

        const userMsg = prompt;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setPrompt('');
        setIsGenerating(true);

        // Simulate AI thinking and generation process
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'system',
                content: "I've received your request! The capability to automatically generate and inject new React calculators into your workspace is coming in the next update. Stay tuned!"
            }]);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl p-8 shadow-xl relative overflow-hidden text-white border border-indigo-500/30">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
                    <Bot size={200} />
                </div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-6 backdrop-blur-md">
                        <Sparkles size={16} className="text-purple-300" />
                        <span>OmniCalc AI</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-purple-500 text-[10px] uppercase tracking-wider ml-1">Beta</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
                        Build Your Own Calculator
                    </h1>
                    <p className="text-indigo-200 text-lg max-w-2xl font-medium leading-relaxed">
                        Can't find what you need? Just describe the math, and our AI will instantly write, style, and integrate a custom calculator directly into your app.
                    </p>
                </div>
            </div>

            <div className="card bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden flex flex-col h-[500px]">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-3 rounded-xl flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                {msg.role === 'user' ? <Terminal size={20} /> : <Bot size={20} />}
                            </div>
                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                                    msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                        : 'bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl flex-shrink-0 shadow-sm bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                <Bot size={20} />
                            </div>
                            <div className="px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-tl-sm flex items-center gap-3">
                                <Loader2 size={18} className="animate-spin text-purple-500" />
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Architecting your calculator...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                    <form onSubmit={handleGenerate} className="relative flex items-center">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isGenerating}
                            placeholder="e.g. 'Build a crypto impermanent loss calculator'"
                            className="w-full pl-5 pr-14 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 rounded-2xl outline-none transition-all text-gray-900 dark:text-gray-100 font-medium shadow-sm disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!prompt.trim() || isGenerating}
                            className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs font-semibold text-gray-400 dark:text-gray-500">
                        <span>Try:</span>
                        <button type="button" onClick={() => setPrompt('Create a freelance hourly rate calculator')} className="hover:text-indigo-500 transition-colors">Freelance Rate</button>
                        <span>•</span>
                        <button type="button" onClick={() => setPrompt('Build a dog year to human year converter')} className="hover:text-indigo-500 transition-colors">Dog Years Calc</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
