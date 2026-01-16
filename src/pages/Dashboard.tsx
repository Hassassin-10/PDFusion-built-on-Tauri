import ToolWorkspace from '../components/ToolWorkspace';
import { useAppStore, ToolId } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { FileText, Plus, Clock } from 'lucide-react';

export default function Dashboard() {
    const { setCurrentTool } = useAppStore();

    const recentFiles = [
        { name: 'Contract_2025.pdf', size: '2.4 MB', date: '2 hours ago' },
        { name: 'Design_System_v2.pdf', size: '14.2 MB', date: 'Yesterday' },
        { name: 'Invoice_#9001.pdf', size: '156 KB', date: '2 days ago' },
    ];

    return (
        <ToolWorkspace>
            <div className="flex flex-col gap-10">

                {/* Welcome Section */}
                <div className="space-y-2">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                    >
                        Welcome back to PDFusion
                    </motion.h2>
                    <p className="text-slate-500 dark:text-slate-400">What would you like to do today?</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { id: 'merge', label: 'Merge PDFs', color: 'from-blue-500/20 to-cyan-500/20', icon: Plus },
                        { id: 'compress', label: 'Compress PDF', color: 'from-emerald-500/20 to-green-500/20', icon: FileText },
                        { id: 'split', label: 'Split PDF', color: 'from-orange-500/20 to-red-500/20', icon: FileText },
                    ].map((action, i) => (
                        <motion.button
                            key={action.id}
                            onClick={() => setCurrentTool(action.id as ToolId)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 dark:hover:border-white/10 hover:scale-[1.02] transition-all group text-left shadow-sm dark:shadow-none`}
                        >
                            <div className="mb-4 w-10 h-10 rounded-full bg-white/60 dark:bg-slate-900/50 flex items-center justify-center shadow-sm">
                                <action.icon size={20} className="text-slate-600 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 group-hover:text-cyan-700 dark:group-hover:text-white">{action.label}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quick start</p>
                        </motion.button>
                    ))}
                </div>

                {/* Recent Files */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Clock size={16} />
                        <span className="text-sm font-medium">Recent Files</span>
                    </div>

                    <div className="grid gap-3">
                        {recentFiles.map((file, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group shadow-sm dark:shadow-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{file.name}</h4>
                                        <span className="text-xs text-slate-500">{file.size}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 hover:text-cyan-600">{file.date}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </ToolWorkspace>
    );
}
