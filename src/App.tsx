import { useAppStore } from './store/useAppStore';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import ToolWorkspace from './components/ToolWorkspace';
import PDFMerger from './tools/PDFMerger';
import PDFSplitter from './tools/PDFSplitter';
import PDFCompressor from './tools/PDFCompressor';
import PDFToImage from './tools/PDFToImage';
import ImageToPDF from './tools/ImageToPDF';

function App() {
  const { currentTool, theme } = useAppStore();

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-background text-slate-200 font-sans transition-colors duration-300 ${theme === 'light' ? 'bg-slate-50 text-slate-900' : ''}`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/0 to-cyan-900/10 pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 bg-slate-900/30">
        <Topbar />

        <main className="flex-1 overflow-hidden relative">
          {currentTool === 'home' && <Dashboard />}
          {currentTool === 'merge' && <PDFMerger />}
          {currentTool === 'split' && <PDFSplitter />}
          {currentTool === 'compress' && <PDFCompressor />}
          {currentTool === 'pdf-to-img' && <PDFToImage />}
          {currentTool === 'img-to-pdf' && <ImageToPDF />}

          {/* Tool Placeholders */}
          {currentTool !== 'home' &&
            currentTool !== 'merge' &&
            currentTool !== 'split' &&
            currentTool !== 'compress' &&
            currentTool !== 'pdf-to-img' &&
            currentTool !== 'img-to-pdf' &&
            currentTool !== 'settings' && (
              <ToolWorkspace>
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20">
                  <div className="p-4 rounded-full bg-slate-800/50 mb-4">
                    <span className="text-3xl">🛠️</span>
                  </div>
                  <h3 className="text-xl font-medium text-slate-300 mb-2 capitalize">
                    {currentTool.replace(/-/g, ' ')}
                  </h3>
                  <p className="text-slate-500">This tool is under construction.</p>
                </div>
              </ToolWorkspace>
            )}

          {currentTool === 'settings' && (
            <ToolWorkspace>
              <div className="text-center text-slate-500 mt-20">Settings Panel Placeholder</div>
            </ToolWorkspace>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
