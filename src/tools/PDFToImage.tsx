import { useState } from 'react';
import ToolWorkspace from '../components/ToolWorkspace';
import FileDropZone from '../components/FileDropZone';
import FileCard from '../components/FileCard';
import { AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function PDFToImage() {
    const [files, setFiles] = useState<File[]>([]);

    const handleFilesDropped = (droppedFiles: FileList | null) => {
        if (droppedFiles) {
            setFiles((prev) => [...prev, ...Array.from(droppedFiles)]);
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
                        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                            <ImageIcon className="text-purple-400" /> PDF to JPG
                        </h2>
                        <p className="text-slate-400">Convert PDF pages into high-quality images.</p>
                    </div>

                    {files.length > 0 && (
                        <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95">
                            <span>Convert to JPG</span>
                            <ArrowRight size={18} />
                        </button>
                    )}
                </div>

                <div className="flex-1 flex gap-6 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
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
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-2xl">
                                <p>No files selected</p>
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
