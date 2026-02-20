import React from 'react';
import { X, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPanel({ isOpen, onClose, history, onClear }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-surface-light dark:bg-surface-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <Clock className="text-primary-500" size={20} />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">History</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 space-y-4">
                            <Clock size={48} className="opacity-20" />
                            <p>No calculations yet. Start calculating to see your history here.</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="card p-4 hover:shadow-md transition-shadow group flex flex-col gap-2"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                                        {item.type}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    {/* Dynamic rendering based on calculator type */}
                                    <div dangerouslySetInnerHTML={{ __html: item.summary }} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {history.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                        <button
                            onClick={onClear}
                            className="w-full btn-secondary text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 size={18} />
                            Clear History
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
