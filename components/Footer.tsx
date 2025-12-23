
const IplanRioLogo = () => (
  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="0"
      y="28"
      fontFamily="Inter, sans-serif"
      fontSize="24"
      fontWeight="bold"
      fill="#212529"
    >
      IPLAN
      <tspan fill="#002B7F">RIO</tspan>
    </text>
  </svg>
);

const PrefeituraLogo = () => (
  <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="5" width="30" height="30" fill="#002B7F" />
    <text
      x="40"
      y="28"
      fontFamily="Inter, sans-serif"
      fontSize="14"
      fontWeight="bold"
      fill="#212529"
    >
      PREFEITURA DO RIO
    </text>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-light-bg border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <IplanRioLogo />
            <PrefeituraLogo />
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm text-prose-light">
              &copy; {new Date().getFullYear()} IPLANRIO - Empresa Municipal de Informática S.A.
            </p>
            <p className="text-center text-xs text-slate-400 mt-1">Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
