import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AttentionAccuracyChart, ManyNeedlesChart, TTABenchmarkChart } from './detail/TTABenchmarkChart';
import { TTATypingCallout } from './detail/TTATypingCallout';
import SpinningEarth from './SpinningEarth';
import type { ResearchPost } from '../types/index';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ResearchDetailViewProps {
    post: ResearchPost;
    onBack: () => void;
}

export const ResearchDetailView: React.FC<ResearchDetailViewProps> = ({ post, onBack }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [post]);

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-rio-primary z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Back Navigation Arrow */}
            <motion.button
                onClick={onBack}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="fixed top-6 left-6 z-40 group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                aria-label="Go back to research"
            >
                <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-rio-primary transition-colors" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-rio-primary transition-colors">
                    Back
                </span>
            </motion.button>

            <article className="pt-16 md:pt-24">
                {/* Standard Header */}
                <header className="container mx-auto px-6 max-w-4xl mb-8">

                    <h1
                        className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-0 leading-[1.05] tracking-tight text-center"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                </header>

                {/* Main Content Body */}
                <main className="container mx-auto px-6 max-w-3xl">
                    <div className="prose prose-slate prose-lg max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-slate-900 mt-16 mb-8 tracking-tight" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-900 mt-14 mb-6 pb-4 border-b border-slate-100" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-slate-900 mt-10 mb-5" {...props} />,
                                p: ({ node, ...props }) => <p className="text-slate-600 leading-[1.8] text-lg mb-12" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-4 mb-8 text-slate-600" {...props} />,
                                li: ({ node, ...props }) => <li className="marker:text-rio-primary font-medium" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-rio-primary bg-slate-50 px-8 py-10 my-12 rounded-2xl italic text-slate-800 text-2xl font-medium leading-relaxed" {...props} />
                                ),
                                code: ({ node, inline, className, children, ...props }: any) => {
                                    const content = String(children).trim();
                                    if (!inline && content === 'TTA_BENCHMARK_CHART') {
                                        return <TTABenchmarkChart />;
                                    }
                                    if (!inline && content === 'ATTENTION_ACCURACY_CHART') {
                                        return <AttentionAccuracyChart />;
                                    }
                                    if (!inline && content === 'MANY_NEEDLES_CHART') {
                                        return <ManyNeedlesChart />;
                                    }
                                    if (!inline && content === 'TTA_TYPEWRITER_CALLOUT') {
                                        return <TTATypingCallout />;
                                    }
                                    if (!inline && content === 'SPINNING_EARTH_VISUALIZATION') {
                                        return <SpinningEarth />;
                                    }
                                    return <code className="bg-slate-100 rounded px-1.5 py-0.5 text-sm font-mono text-rio-primary" {...props}>{children}</code>;
                                }
                            }}
                        >
                            {post.content || post.summary}
                        </ReactMarkdown>
                    </div>

                </main>
            </article>
        </div>
    );
};
