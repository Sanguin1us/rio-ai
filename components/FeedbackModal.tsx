import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

export type FeedbackType = 'positive' | 'negative';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => void;
  type: FeedbackType;
}

export interface FeedbackData {
  type: FeedbackType;
  details?: string;
  errorType?: string;
}

const ERROR_TYPES = [
  'Selecionar...',
  'Alucinações',
  'Recusa Excessiva',
  'Resposta Incompleta',
  'Erro Técnico',
  'Não Seguiu as Instruções',
  'Denunciar Conteúdo',
  'Outros',
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
}) => {
  const [details, setDetails] = useState('');
  const [errorType, setErrorType] = useState(ERROR_TYPES[0]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDetails('');
      setErrorType(ERROR_TYPES[0]);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      details,
      errorType: type === 'negative' ? errorType : undefined,
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
      aria-labelledby="feedback-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Panel */}
      <div
        className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all duration-200 ${
          isOpen && !isClosing ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 id="feedback-modal-title" className="text-lg font-semibold leading-6 text-slate-900">
            Feedback
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'negative' && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Que tipo de erro ocorreu?
              </label>
              <div className="relative">
                <select
                  value={errorType}
                  onChange={(e) => setErrorType(e.target.value)}
                  className="w-full appearance-none rounded-xl border-slate-200 bg-slate-50 py-2.5 pl-3 pr-10 text-sm text-slate-700 focus:border-rio-primary focus:outline-none focus:ring-1 focus:ring-rio-primary"
                >
                  {ERROR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Dê os detalhes do seu feedback (opcional)
            </label>
            <textarea
              className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-rio-primary focus:outline-none focus:ring-1 focus:ring-rio-primary"
              rows={4}
              placeholder="Digite aqui..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <p className="text-xs leading-relaxed text-slate-400 px-1">
            Ao enviar este feedback, toda a conversa atual será enviada à IPLANRIO para melhorias
            nos nossos modelos.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-rio-primary px-4 py-2 text-sm font-medium text-white hover:bg-rio-primary/90 focus:outline-none focus:ring-2 focus:ring-rio-primary focus:ring-offset-2"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
