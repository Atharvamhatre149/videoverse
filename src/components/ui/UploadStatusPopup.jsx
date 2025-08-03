import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function UploadStatusPopup({ isOpen, status, onClose }) {
    const statusConfig = {
        pending: {
            icon: <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />,
            title: "Uploading Video",
            description: "Please wait while we process your video...",
            color: "blue"
        },
        success: {
            icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
            title: "Upload Complete",
            description: "Your video has been uploaded successfully!",
            color: "green"
        },
        error: {
            icon: <XCircle className="w-12 h-12 text-red-500" />,
            title: "Upload Failed",
            description: "There was an error uploading your video. Please try again.",
            color: "red"
        }
    };

    const currentStatus = statusConfig[status];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={status !== 'pending' ? onClose : undefined}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
                    >
                        <div className="bg-white dark:bg-black-800 rounded-xl shadow-xl overflow-hidden">
                            {/* Progress Bar */}
                            {status === 'pending' && (
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-1 bg-blue-500"
                                />
                            )}

                            <div className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    {/* Icon with animated background */}
                                    <div className="relative">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 1, 0.5]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className={`absolute inset-0 rounded-full bg-${currentStatus.color}-100 dark:bg-${currentStatus.color}-900/20`}
                                        />
                                        <div className="relative p-4">
                                            {currentStatus.icon}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                                        {currentStatus.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                                        {currentStatus.description}
                                    </p>

                                    {/* Close button (only show for success/error) */}
                                    {status !== 'pending' && (
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mt-6 px-4 py-2 rounded-lg text-white bg-${currentStatus.color}-500 hover:bg-${currentStatus.color}-600 transition-colors`}
                                            onClick={onClose}
                                        >
                                            {status === 'success' ? 'View Video' : 'Try Again'}
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 