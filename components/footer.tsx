const footerLinks = ["Features", "Pricing", "Workflow", "Disclaimer", "Contact"];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 py-10">
      <div className="container flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-950">trade-analysis</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Market analysis is for informational purposes only and is not
            financial advice.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="transition hover:text-slate-900">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
