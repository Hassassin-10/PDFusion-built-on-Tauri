import { FileText, Trash2, GripVertical, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileCardProps {
    name: string;
    size: string;
    onRemove?: () => void;
    onRotate?: () => void;
}

export default function FileCard({ name, size, onRemove, onRotate }: FileCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative flex items-center justify-between p-3 pl-2 pr-4 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-700/40 select-none shadow-sm dark:shadow-none"
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 p-1">
                    <GripVertical size={16} />
                </div>

                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-500">
                    <FileText size={20} />
                </div>

                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate pr-4">{name}</span>
                    <span className="text-xs text-slate-500">{size}</span>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onRotate && (
                    <button
                        onClick={onRotate}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                        title="Rotate"
                    >
                        <RotateCw size={16} />
                    </button>
                )}
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
