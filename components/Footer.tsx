import { Instagram, Mail, MapPin, Phone } from "lucide-react";

const LINKS = {
  Services: ["Location de terrain", "Tournois", "Ligues", "Événements privés"],
  Forfaits: ["Tarifs horaires", "Pack Anniversaire", "Pack Corporate", "Pack Tournoi"],
  Support:  ["Réserver", "FAQ", "Annulations", "Contact"],
};

const SOCIAL = [
  { icon: Instagram, label: "Instagram", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#080f1c]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-1 mb-6">
              <span className="text-white text-2xl tracking-[0.12em]" style={{ fontFamily: "var(--font-display)" }}>
                MTLW<span className="text-[#F97316]">CUP</span>
              </span>
            </div>
            <p className="text-[#3d5a90] text-sm leading-relaxed max-w-xs mb-8">
              Terrain intérieur de soccer à Montréal. Tournois, ligues,
              événements privés — réserve. joue. domine.
            </p>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "Montréal, QC" },
                { icon: Phone,  text: "+1 (514) 555-0192" },
                { icon: Mail,   text: "mtlworldcup@gmail.com" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={14} className="text-[#F97316] mt-0.5 shrink-0" />
                  <span className="text-[#3d5a90] text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white text-sm tracking-[0.15em] uppercase mb-5" style={{ fontFamily: "var(--font-display)" }}>
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#3d5a90] text-sm hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#2a3f6a] text-xs">&copy; {new Date().getFullYear()} MTLWCUP. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 text-[#3d5a90] hover:text-white hover:border-[#F97316]/30 transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#2a3f6a] text-xs hover:text-[#3d5a90] transition-colors">Politique de confidentialité</a>
            <a href="#" className="text-[#2a3f6a] text-xs hover:text-[#3d5a90] transition-colors">Conditions d&apos;utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
