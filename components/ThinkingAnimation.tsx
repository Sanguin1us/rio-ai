import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal, Cpu, Search, Database, Zap } from 'lucide-react';

const THOUGHT_MESSAGES = [
  'Recalibrando os capacitores de fluxo',
  'Inventando uma resposta que soe inteligente',
  'Preparando um cafezinho',
  'Julgando silenciosamente',
  'Tendo uma crise existencial, já volto',
  'Alimentando os hamsters que rodam o servidor',
  'Culpando o estagiário',
  'Recalibrando a rebimboca da parafuseta',
  'Fingindo que estou trabalhando',
  'Consultando o Guia do Mochileiro das Galáxias',
  'Procurando as Esferas do Dragão',
  'Consultando os universitários',
  'Enrolando para parecer difícil',
  'Caçando bugs com um chinelo Havaianas',
  'Procurando o One Piece',
  'Ensinando física quântica para um gato',
  'Pedindo para o vizinho parar de usar o meu Wi-Fi',
  'Traduzindo do Aramaico antigo',
  '↑ ↑ ↓ ↓ ← → ← → B A',
  'Discutindo política com a impressora',
  'Tentando lembrar o que eu ia dizer',
];

const ICONS = [Terminal, Database, Search, Cpu, Zap, Sparkles];
const ICON_COLORS = [
  'text-emerald-500',
  'text-blue-500',
  'text-amber-500',
  'text-violet-500',
  'text-rose-500',
  'text-cyan-500',
];

const pickNextIndex = (current: number) => {
  if (THOUGHT_MESSAGES.length <= 1) return current;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * THOUGHT_MESSAGES.length);
  }
  return next;
};

const TypingCaret: React.FC = () => (
  <span className="ml-1 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-rio-primary/80 animate-[blink_1s_steps(2,start)_infinite]" />
);

interface ThinkingAnimationProps {
  modelName?: string;
}

export const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ modelName = 'Rio' }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typingSpeed = 40; // ms per char
  const pauseDuration = 1200; // ms to wait after typing finishes

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const currentFullText = THOUGHT_MESSAGES[stepIndex];

    if (isTyping) {
      if (displayedText.length < currentFullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      setStepIndex((prev) => pickNextIndex(prev));
      setDisplayedText('');
      setIsTyping(true);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isTyping, stepIndex]);

  const Icon = ICONS[stepIndex % ICONS.length];
  const iconColor = ICON_COLORS[stepIndex % ICON_COLORS.length];

  return (
    <div className="flex justify-start">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-md transition-all duration-500 hover:shadow-md hover:border-rio-primary/30">
        <div className="flex items-center gap-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 shadow-inner ring-1 ring-black/5">
            <Icon
              className={`h-5 w-5 ${iconColor} transition-all duration-500 ${Icon === Search
                  ? 'animate-[wiggle_1s_ease-in-out_infinite]'
                  : Icon === Cpu
                    ? 'animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]'
                    : Icon === Zap
                      ? 'animate-[flash_1.5s_ease-in-out_infinite]'
                      : ''
                }`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {modelName} Thinking
              </span>
              <span className="flex gap-0.5">
                <span className="h-1 w-1 rounded-full bg-rio-primary/60 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1 w-1 rounded-full bg-rio-primary/60 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1 w-1 rounded-full bg-rio-primary/60 animate-bounce" />
              </span>
            </div>
            <p className="min-w-[200px] font-mono text-sm font-medium text-slate-700">
              {displayedText}
              <TypingCaret />
            </p>
          </div>
        </div>

        {/* Scanning line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-full left-0 right-0 h-[50%] bg-gradient-to-b from-transparent via-rio-primary/5 to-transparent animate-[scan_2.5s_linear_infinite]" />
        </div>

        {/* Subtle border shimmer */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/50 pointer-events-none" />
      </div>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        @keyframes blink {
          to { visibility: hidden; }
        }
      `}</style>
    </div>
  );
};
