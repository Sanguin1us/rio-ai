import React from 'react';
import type { UseCase } from '../../types/index';

interface DetailUseCasesProps {
  useCases: UseCase[];
}

export const DetailUseCases: React.FC<DetailUseCasesProps> = ({ useCases }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-prose mb-6">Casos de Uso</h2>
      <div className="space-y-6">
        {useCases.map((useCase) => (
          <div key={useCase.title} className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rio-primary/10 shrink-0">
              <useCase.Icon className="h-5 w-5 text-rio-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-prose">{useCase.title}</h4>
              <p className="mt-1 text-sm text-prose-light">{useCase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
