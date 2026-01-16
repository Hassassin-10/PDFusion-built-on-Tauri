import { useState } from 'react';
import ToolWorkspace from '../components/ToolWorkspace';
import FileDropZone from '../components/FileDropZone';
import FileCard from '../components/FileCard';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Merge, Loader2, Plus } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { save, open } from '@tauri-apps/plugin-dialog';

export default function PDFMerger() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleMerge = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);

        try {
            // 1. Get save location
            const savePath = await save({
                filters: [{
                    name: 'PDF',
                    extensions: ['pdf']
                }]
            });

            if (!savePath) {
                setIsProcessing(false);
                return;
            }

            // 2. Prepare file paths
            const filePaths = files.map(f => (f as any).path || f.name);

            // Validate paths
            if (filePaths.some(p => !p.includes('/') && !p.includes('\\'))) {
                alert("Some files are missing full paths (likely from Drag & Drop). Please remove them and use 'Add Files' button for processing.");
                setIsProcessing(false);
                return;
            }

            await invoke('merge', {
                files: filePaths,
                output: savePath
            });

            alert('Merge completed successfully!');
            setFiles([]);
        } catch (error) {
            console.error(error);
            alert('Failed to merge: ' + error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFilesDropped = (droppedFiles: FileList | null) => {
        if (droppedFiles) {
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
            // Transform strings to File-like objects that contain the path
            // We can't create real File objects easily in browser environment without Blob, 
            // but for our list we just need name and path.
            // We will store them as special objects.
            // Wait, the state `files` expects `File[]`.
            // We should change state to `any[]` or a custom interface to support both DnD files and Dialouge files.
            // Or just mock the File object.

            const newFiles = selected.map(path => {
                const name = path.split(/[\\/]/).pop() || 'file.pdf';
                // Create a fake file object that has the path property
                // This is a bit hacky but works for the logic we have
                const f = {
                    name: name,
                    size: 0, // We don't know size via open(), maybe show 'Unknown'
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
                            <Merge className="text-cyan-500 dark:text-cyan-400" /> Merge PDFs
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">Combine multiple PDF files into one.</p>
                    </div>

                    {files.length > 0 && (
                        <button
                            onClick={handleMerge}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    <span>Merge Files</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    )}
                </div>



                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* File List */}
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex justify-end">
                            <button
                                onClick={handleSelectFiles}
                                className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300"
                            >
                                <Plus size={16} /> Add Files
                            </button>
                        </div>

                        <AnimatePresence mode='popLayout'>
                            {files.map((file, i) => (
                                <FileCard
                                    key={`${file.name}-${i}`}
                                    name={file.name}
                                    size={file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Local File'}
                                    onRemove={() => removeFile(i)}
                                />
                            ))}
                        </AnimatePresence>

                        {files.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-2xl">
                                <p>No files selected</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Dropzone */}
                    <div className="w-1/3">
                        <FileDropZone onFilesDropped={handleFilesDropped} className="h-full" />
                    </div>
                </div>
            </div>
        </ToolWorkspace>
    );
}
