import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../../components/Layout/CalculatorLayout';
import { Type, AlignLeft, Hash, Minus } from 'lucide-react';

export default function WordCounter() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        paragraphs: 0,
    });

    useEffect(() => {
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim() !== '').length;

        setStats({ words, characters, charactersNoSpaces, paragraphs });
    }, [text]);

    return (
        <CalculatorLayout
            title="Word & Character Counter"
            description="Count words, characters, and spaces in real-time."
            icon={Type}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Type or paste your text below:
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter some text here to see the magical counting happen in real-time..."
                            className="w-full h-80 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary-500 rounded-xl outline-none transition-all text-gray-900 dark:text-gray-100 resize-none font-sans"
                            autoFocus
                        />
                        <div className="mt-4 flex justify-between items-center">
                            <button
                                onClick={() => setText('')}
                                className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            >
                                Clear Text
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const clipText = await navigator.clipboard.readText();
                                        setText(clipText);
                                    } catch (err) {
                                        console.error('Failed to read clipboard contents: ', err);
                                    }
                                }}
                                className="btn-secondary text-sm"
                            >
                                Paste from Clipboard
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <StatCard icon={Type} label="Words" value={stats.words} color="text-primary-500" bg="bg-primary-50 dark:bg-primary-900/20" />
                    <StatCard icon={Hash} label="Characters" value={stats.characters} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" />
                    <StatCard icon={Minus} label="Characters (no spaces)" value={stats.charactersNoSpaces} color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-900/20" />
                    <StatCard icon={AlignLeft} label="Paragraphs" value={stats.paragraphs} color="text-purple-500" bg="bg-purple-50 dark:bg-purple-900/20" />
                </div>
            </div>
        </CalculatorLayout>
    );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
    return (
        <div className="card p-6 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${bg} ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
                <p className={`text-2xl font-black ${color}`}>{value.toLocaleString()}</p>
            </div>
        </div>
    );
}
