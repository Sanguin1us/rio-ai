import React from 'react';
import { AnimateOnScroll } from './AnimateOnScroll';
import TerminalAnimation from './TerminalAnimation';

export const SciencePlatformSection = () => {
  return (
    <section id="plataforma" className="bg-light-bg py-20 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <AnimateOnScroll className="relative lg:h-auto" aria-hidden="true">
            <TerminalAnimation />
          </AnimateOnScroll>

          <AnimateOnScroll delay={200} className="mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold tracking-tight text-prose sm:text-4xl">
              Rio 2.5 Evolve: laboratório evolutivo
            </h2>
            <p className="mt-4 text-lg text-prose-light">
              O Rio 2.5 Evolve é um sistema de pesquisa algorítmica autônoma. Dado um problema claramente expresso em termos matemáticos e uma série de restrições, ele busca encontrar sozinho soluções otimizadas.
            </p>
            <p className="mt-4 text-base text-prose-light">
              Por exemplo, definimos o problema "Maximize a soma dos raios de n círculos inscritos em um quadrado escolhendo seu posicionamento".
              O sistema gerou uma nova solução ótima, superando todos os resultados previamente conhecidos.
            </p>
            <dl className="mt-8 space-y-6">
              <div>
                <dt>
                  <p className="font-semibold text-prose">
                    <span className="text-rio-primary font-bold">1. Definição em linguagem natural</span>
                  </p>
                </dt>
                <dd className="mt-1 text-base text-prose-light">
                  O usuário descreve o desafio em linguagem natural. O sistema
                  converte isso em função de <em>fitness</em> e restrições rígidas.
                </dd>
              </div>
              <div>
                <dt>
                  <p className="font-semibold text-prose">
                    <span className="text-rio-primary font-bold">2. Geração de população</span>
                  </p>
                </dt>
                <dd className="mt-1 text-base text-prose-light">
                  O Rio 2.5 gera uma solução inicial pouco otimizada, que servirá de ponto de partida.
                </dd>
              </div>
              <div>
                <dt>
                  <p className="font-semibold text-prose">
                    <span className="text-rio-primary font-bold">3. Torneio e evolução</span>
                  </p>
                </dt>
                <dd className="mt-1 text-base text-prose-light">
                  Algoritmos genéticos cruzam e mutam os melhores candidatos. O sistema aprende quais traços levam ao
                  sucesso e descarta rapidamente caminhos inviáveis.
                </dd>
              </div>
              <div>
                <dt>
                  <p className="font-semibold text-prose">
                    <span className="text-rio-primary font-bold">4. Solução otimizada</span>
                  </p>
                </dt>
                <dd className="mt-1 text-base text-prose-light">
                  Após centenas de iterações, a melhor solução emerge validada matematicamente.
                  Em nossos testes, o Rio 2.5 Evolve faz o trabalho que levaria um matemático múltiplas horas ou até dias em minutos.
                </dd>
              </div>
            </dl>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};
