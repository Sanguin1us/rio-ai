/**
 * React components for the Rio-AI application.
 *
 * This module exports all public components using named exports
 * for consistency and better tree-shaking.
 *
 * @module components
 */

// Layout components
export { Header } from './Header';
export { Footer } from './Footer';

// Hero & Landing
export { Hero } from './Hero';
export { HeroTitleAnimation } from './HeroTitleAnimation';

// Page sections
export { ChatSection } from './ChatSection';
export { ModelsSection } from './ModelsSection';
export { OpenSourceSection } from './OpenSourceSection';
export { ResearchSection } from './ResearchSection';
export { SciencePlatformSection } from './SciencePlatformSection';

// Model display
export { ModelCard } from './ModelCard';
export { ModelDetailView } from './ModelDetailView';
export { LineageTree } from './LineageTree';

// Utilities
export { AnimateOnScroll } from './AnimateOnScroll';
export { ErrorBoundary, SectionErrorBoundary, ChatErrorBoundary } from './ErrorBoundary';

// UI components
export { Button } from './ui/Button';
export { Badge } from './ui/Badge';
export { Card } from './ui/Card';
