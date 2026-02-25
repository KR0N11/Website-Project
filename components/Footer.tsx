import { Flame, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

const LINKS = {
  Pitches:  ["5-a-Side Pitch", "7-a-Side Pitch", "Main Arena", "Pricing"],
  Company:  ["About MTLWC", "Careers", "Press", "Blog"],
  Support:  ["Book a Pitch", "FAQs", "Cancellations", "Contact"],
};

const SOCIAL = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter,   label: "Twitter/X",  href: "#" },
  { icon: Youtube,   label: "YouTube",   href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#080f1c]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.35)]">
                <Flame size={15} className="text-white fill-white" />
              </div>
              <span className="text-white text-2xl tracking-[0.12em]" style={{ fontFamily: "var(--font-display)" }}>
                MTL<span className="text-[#F97316]">WC</span>
              </span>
            </div>
            <p className="text-[#3d5a90] text-sm leading-relaxed max-w-xs mb-8">
              Montréal's premier indoor soccer facility. Premium turf, cinematic
              lighting, instant booking — votre jeu au niveau supérieur.
            </p>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "4823 Rue Saint-Denis, Montréal, QC H2J 2L6" },
                { icon: Phone,  text: "+1 (514) 555-0192" },
                { icon: Mail,   text: "play@mtlwc.ca" },
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
          <p className="text-[#2a3f6a] text-xs">© {new Date().getFullYear()} MTLWC Arena Inc. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 text-[#3d5a90] hover:text-white hover:border-[#F97316]/30 transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#2a3f6a] text-xs hover:text-[#3d5a90] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#2a3f6a] text-xs hover:text-[#3d5a90] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
