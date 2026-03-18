"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

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
            <LogIn size={24} className="text-white" />
          </div>
          <h1 className="text-white text-4xl mb-1" style={{ fontFamily: "var(--font-display)" }}>CONNEXION</h1>
          <p className="text-[#3d5a90] text-sm">
            MTLWCUP — Accédez à votre compte
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[#6080b8] text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-mono)" }}>
              Courriel
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
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-[#3d5a90] text-sm text-center mt-6">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-[#F97316] hover:text-[#FBBF24] transition-colors">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
