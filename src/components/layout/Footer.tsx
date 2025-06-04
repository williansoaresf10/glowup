import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} BeautyLens IA. Todos os direitos reservados.</p>
          <p className="mt-1">
            Desenvolvido com inteligência artificial para recomendações de beleza personalizadas.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
