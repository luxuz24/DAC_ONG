const Footer = () => (
  <footer className="mt-auto border-t border-surface-200 bg-white py-6">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-center text-sm text-surface-500">
        © {new Date().getFullYear()} SGAS — Sistema de Gestão de Ações Solidárias.
        Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
