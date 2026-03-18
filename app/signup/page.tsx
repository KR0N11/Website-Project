"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-[#06080f]"
        style={{ backgroundImage: "radial-gradient(at 50% 30%, rgba(249,115,22,0.12) 0%, transparent 60%)" }}
      >
        <div className="glass-card p-10 w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-[#F97316]" />
          </div>
          <h1 className="text-white text-4xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
            COMPTE CRÉÉ
          </h1>
          <p className="text-[#6080b8] mb-2">
            Un courriel de confirmation a été envoyé à
          </p>
          <p className="text-white font-semibold mb-6">{email}</p>
          <p className="text-[#3d5a90] text-sm mb-8">
            Vérifiez votre boîte de réception et cliquez sur le lien pour activer votre compte.
          </p>
          <Link href="/login" className="btn-neon w-full justify-center inline-flex">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-[#06080f]"
      style={{ backgroundImage: "radial-gradient(at 50% 30%, rgba(249,115,22,0.12) 0%, transparent 60%)" }}
    >
      <div className="glass-card p-10 w-full max-w-sm">
        <Link href="/" className="flex items-center gap-1 text-[#3d5a90] hover:text-white text-sm transition-colors mb-8">
          <ArrowLeft size={14} /> Retour au site
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(249,115,22,0.35)]">
            <UserPlus size={24} className="text-white" />
          </div>
          <h1 className="text-white text-4xl mb-1" style={{ fontFamily: "var(--font-display)" }}>INSCRIPTION</h1>
          <p className="text-[#3d5a90] text-sm">
            MTLWCUP — Créez votre compte
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-[#6080b8] text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Nom complet <span className="text-[#F97316]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Tremblay"
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#2a3f6a] focus:outline-none focus:border-[#F97316]/50 focus:bg-white/[0.06] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[#6080b8] text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Courriel <span className="text-[#F97316]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@email.com"
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#2a3f6a] focus:outline-none focus:border-[#F97316]/50 focus:bg-white/[0.06] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[#6080b8] text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Téléphone <span className="text-[#F97316]">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 514 555 0000"
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#2a3f6a] focus:outline-none focus:border-[#F97316]/50 focus:bg-white/[0.06] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-[#6080b8] text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Mot de passe <span className="text-[#F97316]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 pr-11 text-white placeholder-[#2a3f6a] focus:outline-none focus:border-[#F97316]/50 focus:bg-white/[0.06] transition-all text-sm"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d5a90] hover:text-white transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-neon w-full justify-center">
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-[#3d5a90] text-sm text-center mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-[#F97316] hover:text-[#FBBF24] transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
