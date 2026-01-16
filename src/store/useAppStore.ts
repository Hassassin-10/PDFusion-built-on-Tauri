import { create } from 'zustand';

export type ToolId =
    | 'home'
    | 'merge'
    | 'split'
    | 'compress'
    | 'pdf-to-img'
    | 'img-to-pdf'
    | 'rotate'
    | 'delete'
    | 'watermark'
    | 'encrypt'
    | 'metadata'
    | 'settings';

interface AppState {
    currentTool: ToolId;
    theme: 'dark' | 'light';
    setCurrentTool: (tool: ToolId) => void;
    toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentTool: 'home',
    theme: 'dark',
    setCurrentTool: (tool) => set({ currentTool: tool }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
