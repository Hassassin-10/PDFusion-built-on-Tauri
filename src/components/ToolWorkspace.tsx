import { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { twMerge } from 'tailwind-merge';

interface ToolWorkspaceProps {
    children: ReactNode;
    className?: string;
}

export default function ToolWorkspace({ children, className }: ToolWorkspaceProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} // smooth easeOutQuart
            className={twMerge("flex-1 p-8 overflow-hidden flex flex-col h-full", className)}
        >
            <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
                {children}
            </div>
        </motion.div>
    );
}
