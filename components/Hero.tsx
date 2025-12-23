import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from './AnimateOnScroll';
import { HeroTitleAnimation } from './HeroTitleAnimation';
import type { View } from '../types/index';

interface HeroProps {
  onNavigate?: (view: View) => void;
  onAnimationComplete?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onAnimationComplete }) => {
  return (
    <section className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <HeroTitleAnimation onComplete={onAnimationComplete} />
        <AnimateOnScroll delay={200}>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-prose-light sm:text-xl md:text-2xl">
            Apresentando nossos modelos mais inteligentes,
            <br className="hidden sm:block" />
            desenvolvidos para impulsionar o futuro da cidade.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll delay={400}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-stretch">
            <a
              href="#modelos"
              className="inline-flex items-center gap-2 rounded-md bg-rio-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rio-primary"
            >
              Conheça os modelos
              <ArrowDown className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => onNavigate?.('chat')}
              className="inline-flex items-center gap-2 rounded-md border border-rio-primary px-6 py-3 text-base font-semibold text-rio-primary transition hover:bg-rio-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rio-primary"
            >
              Converse com o Rio 2.5
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};
