import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X, Moon, Sun, Bell } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Topbar() {
    const { currentTool, theme, toggleTheme } = useAppStore();
    const appWindow = getCurrentWindow();

    const getTitle = () => {
        switch (currentTool) {
            case 'home': return 'Dashboard';
            case 'merge': return 'Merge PDFs';
            case 'split': return 'Split PDF';
            case 'compress': return 'Compress PDF';
            case 'pdf-to-img': return 'PDF to Images';
            case 'img-to-pdf': return 'Images to PDF';
            case 'watermark': return 'Add Watermark';
            case 'encrypt': return 'Protect PDF';
            case 'metadata': return 'View Metadata';
            case 'settings': return 'Settings';
            default: return 'PDFusion';
        }
    };

    return (
        <div data-tauri-drag-region className="h-16 flex items-center justify-between px-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200 dark:border-cyan-500/10 select-none transition-colors duration-300">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-medium text-slate-800 dark:text-slate-100 tracking-wide">
                    {getTitle()}
                </h1>
                {/* File Count Badge Placeholder */}
                {currentTool !== 'home' && currentTool !== 'settings' && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
                        0 Files
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Actions */}
                <div className="flex items-center gap-2 pr-4 border-r border-slate-700/50">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-400 hover:text-cyan-200 transition-colors rounded-lg hover:bg-white/5"
                    >
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-cyan-200 transition-colors rounded-lg hover:bg-white/5 relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border border-slate-900" />
                    </button>
                </div>

                {/* Window Controls */}
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <button onClick={() => appWindow.minimize()} className="p-2 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <Minus size={16} />
                    </button>
                    <button
                        onClick={async () => {
                            // Robust toggle
                            const isMax = await appWindow.isMaximized();
                            if (isMax) {
                                await appWindow.unmaximize();
                            } else {
                                await appWindow.maximize();
                            }
                        }}
                        className="p-2 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Square size={14} />
                    </button>
                    <button onClick={() => appWindow.close()} className="p-2 hover:text-slate-900 dark:hover:text-white hover:bg-red-500/80 rounded-lg transition-colors">
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>

    );
}
