import { useState } from 'react';
import ToolWorkspace from '../components/ToolWorkspace';
import FileDropZone from '../components/FileDropZone';
import FileCard from '../components/FileCard';
import { AnimatePresence } from 'framer-motion';
import { Scissors, ArrowRight, Loader2, Plus } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

export default function PDFSplitter() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSplit = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        try {
            // 1. Get output directory
            const outputDir = await open({
                directory: true,
                multiple: false,
            });

            if (!outputDir) {
                setIsProcessing(false);
                return;
            }

            // 2. Process each file
            for (const file of files) {
                const path = (file as any).path || file.name;

                if (!path.includes('/') && !path.includes('\\')) {
                    alert(`File ${file.name} is missing a full path. Please use 'Add Files'.`);
                    continue;
                }

                await invoke('split', {
                    file: path,
                    outputDir: outputDir
                });
            }

            alert('Split completed!');
            setFiles([]);
        } catch (error) {
            console.error(error);
            alert('Failed to split: ' + error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFilesDropped = (droppedFiles: FileList | null) => {
        if (droppedFiles) {
            // For split, usually we accept one file at a time, but for UI shell let's allow multiple
            setFiles((prev) => [...prev, ...Array.from(droppedFiles)]);
        }
    };

    const handleSelectFiles = async () => {
        const selected = await open({
            multiple: true,
            filters: [{
                name: 'PDF',
                extensions: ['pdf']
            }]
        });

        if (selected) {
            const newFiles = selected.map(path => {
                const name = path.split(/[\\/]/).pop() || 'file.pdf';
                const f = {
                    name: name,
                    size: 0,
                    path: path,
                    type: 'application/pdf'
                };
                return f as unknown as File;
            });

            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <ToolWorkspace>
            <div className="flex flex-col h-full gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Scissors className="text-orange-500 dark:text-orange-400" /> Split PDF
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">Extract pages or split plain documents.</p>
                    </div>

                    {files.length > 0 && (
                        <button
                            onClick={handleSplit}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white rounded-xl font-medium shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    <span>Split PDF</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="flex-1 flex gap-6 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex justify-end">
                            <button
                                onClick={handleSelectFiles}
                                className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300"
                            >
                                <Plus size={16} /> Add Files
                            </button>
                        </div>
                        <AnimatePresence mode='popLayout'>
                            {files.map((file, i) => (
                                <FileCard
                                    key={`${file.name}-${i}`}
                                    name={file.name}
                                    size={(file.size / 1024 / 1024).toFixed(2) + ' MB'}
                                    onRemove={() => removeFile(i)}
                                />
                            ))}
                        </AnimatePresence>

                        {files.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-2xl">
                                <p>No file selected</p>
                            </div>
                        )}
                    </div>

                    <div className="w-1/3">
                        <FileDropZone onFilesDropped={handleFilesDropped} className="h-full" />
                    </div>
                </div>
            </div>
        </ToolWorkspace>
    );
}
