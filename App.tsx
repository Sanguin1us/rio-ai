import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ChatSection } from './components/ChatSection';
import { ModelsSection } from './components/ModelsSection';
import { OpenSourceSection } from './components/OpenSourceSection';
import { SciencePlatformSection } from './components/SciencePlatformSection';
import { TechDetailsSection } from './components/TechDetailsSection';
import { Footer } from './components/Footer';
import { ModelDetailView } from './components/ModelDetailView';
import type { Model } from './types';
import { RIO_MODELS } from './constants';

type View = 'home' | 'chat' | 'opensource';

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
        return <ChatSection />;
      case 'opensource':
        const openSourceModels = RIO_MODELS.filter(m => m.isOpenSource);
        return openSourceModels.length > 0 ? <OpenSourceSection models={openSourceModels} onSelectModel={handleSelectModel} /> : null;
      case 'home':
      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} onAnimationComplete={handleHeroAnimationComplete} />
            <div
              className={`transition-opacity duration-1000 ease-out ${showContent ? 'opacity-100' : 'opacity-0'}`}
            >
              <ModelsSection onSelectModel={handleSelectModel} />
              <SciencePlatformSection />
              <TechDetailsSection />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      <main>
        {selectedModel ? (
          <ModelDetailView model={selectedModel} onBack={handleBack} />
        ) : (
          renderView()
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
