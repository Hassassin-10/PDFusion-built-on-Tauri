import {
    Home,
    Files,
    Scissors,
    Minimize2,
    Image,
    FileImage,
    Stamp,
    Lock,
    FileText, // For metadata
    Settings
} from 'lucide-react';
import { useAppStore, ToolId } from '../store/useAppStore';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const tools = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'merge', icon: Files, label: 'Merge PDF' },
    { id: 'split', icon: Scissors, label: 'Split PDF' },
    { id: 'compress', icon: Minimize2, label: 'Compress' },
    { id: 'pdf-to-img', icon: Image, label: 'PDF to JPG' },
    { id: 'img-to-pdf', icon: FileImage, label: 'JPG to PDF' },
    { id: 'watermark', icon: Stamp, label: 'Watermark' },
    { id: 'encrypt', icon: Lock, label: 'Protect' },
    { id: 'metadata', icon: FileText, label: 'Metadata' },
];

export default function Sidebar() {
    const { currentTool, setCurrentTool } = useAppStore();

    return (
        <div className="h-screen w-20 flex flex-col items-center py-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-r border-slate-200 dark:border-cyan-500/10 z-50 transition-colors duration-300">
            {/* Brand Logo Placeholder */}
            <div className="mb-8 p-2 rounded-xl bg-cyan-500/10">
                <div className="w-6 h-6 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-lg" />
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full px-2">
                {tools.map((tool) => {
                    const isActive = currentTool === tool.id;
                    return (
                        <button
                            key={tool.id}
                            onClick={() => setCurrentTool(tool.id as ToolId)}
                            className={clsx(
                                "relative group flex items-center justify-center p-3 rounded-xl transition-all duration-300",
                                isActive ? "text-cyan-500 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-200"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <tool.icon size={22} strokeWidth={1.5} className="relative z-10" />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-xs text-cyan-50 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {tool.label}
                            </div>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <button
                    onClick={() => setCurrentTool('settings')}
                    className={clsx(
                        "p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-200 transition-colors",
                        currentTool === 'settings' && "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10"
                    )}
                >
                    <Settings size={22} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}
