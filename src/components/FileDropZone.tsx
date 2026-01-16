import { Upload, FileUp } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface FileDropZoneProps {
    onFilesDropped: (files: FileList | null) => void;
    className?: string;
    maxFiles?: number;
    accept?: string;
}

export default function FileDropZone({ onFilesDropped, className }: FileDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesDropped(e.dataTransfer.files);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
                "relative group flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm",
                isDragging
                    ? "border-cyan-400 bg-cyan-400/10 scale-[1.01]"
                    : "border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/30",
                className
            )}
        >
            <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={(e) => onFilesDropped(e.target.files)}
            />

            {/* Animated Glow Background */}
            <div className={clsx(
                "absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-blue-500/20 opacity-0 transition-opacity duration-500 pointer-events-none",
                isDragging ? "opacity-100" : "group-hover:opacity-50"
            )} />

            <motion.div
                animate={{ scale: isDragging ? 1.1 : 1 }}
                className="p-4 rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-4 relative z-10"
            >
                <Upload size={32} className={clsx("transition-colors", isDragging ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300")} />
            </motion.div>

            <div className="text-center relative z-10 space-y-2">
                <h3 className="text-xl font-semibold text-slate-200 group-hover:text-white transition-colors">
                    Drag & Drop PDF Files Here
                </h3>
                <p className="text-slate-400 text-sm">
                    or click to browse
                </p>
            </div>

            {isDragging && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-30"
                >
                    <div className="flex flex-col items-center text-cyan-400">
                        <FileUp size={48} className="animate-bounce" />
                        <span className="font-semibold text-lg mt-4">Drop files here!</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
