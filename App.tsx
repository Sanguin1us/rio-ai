import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ChatSection } from './components/ChatSection';
import { ModelsSection } from './components/ModelsSection';
import { OpenSourceSection } from './components/OpenSourceSection';
import { SciencePlatformSection } from './components/SciencePlatformSection';
import { ResearchSection } from './components/ResearchSection';
import { Footer } from './components/Footer';
import { ModelDetailView } from './components/ModelDetailView';
import { ErrorBoundary, ChatErrorBoundary, SectionErrorBoundary } from './components/ErrorBoundary';
import type { Model, View } from './types/index';
import { RIO_MODELS } from './constants';

function App() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedModel(null);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setSelectedModel(null); // Deselect model when changing main views
    window.scrollTo(0, 0);
  };

  const [showContent, setShowContent] = useState(false);

  const handleHeroAnimationComplete = () => {
    setShowContent(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return (
          <ChatErrorBoundary>
            <ChatSection />
          </ChatErrorBoundary>
        );
      case 'opensource': {
        const openSourceModels = RIO_MODELS.filter((m) => m.isOpenSource);
        return openSourceModels.length > 0 ? (
          <SectionErrorBoundary sectionName="OpenSource">
            <OpenSourceSection models={openSourceModels} onSelectModel={handleSelectModel} />
          </SectionErrorBoundary>
        ) : null;
      }
      case 'research':
        return <ResearchSection />;
      case 'home':
      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} onAnimationComplete={handleHeroAnimationComplete} />
            <div
              className={`transition-opacity duration-1000 ease-out ${showContent ? 'opacity-100' : 'opacity-0'}`}
            >
              <SectionErrorBoundary sectionName="Models">
                <ModelsSection onSelectModel={handleSelectModel} />
              </SectionErrorBoundary>
              <SectionErrorBoundary sectionName="SciencePlatform">
                <SciencePlatformSection />
              </SectionErrorBoundary>
            </div>
          </>
        );
    }
  };

  return (
    <ErrorBoundary name="App">
      <div className="min-h-screen bg-white font-sans">
        <Header onNavigate={handleNavigate} currentView={currentView} />
        <main>
          {selectedModel ? (
            <ErrorBoundary name="ModelDetail">
              <ModelDetailView model={selectedModel} onBack={handleBack} />
            </ErrorBoundary>
          ) : (
            renderView()
          )}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
