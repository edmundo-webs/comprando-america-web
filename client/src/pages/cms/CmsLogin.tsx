import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { IMAGES } from "@/lib/constants";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function CmsLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.cmsAuth.login.useMutation({
    onSuccess: () => {
      toast.success("Sesión iniciada correctamente");
      navigate("/cms");
    },
    onError: (error) => {
      toast.error(error.message || "Error al iniciar sesión");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 2px, transparent 0)",
          backgroundSize: "50px 50px",
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={IMAGES.logo}
            alt="Comprando América"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-serif text-white mb-1">Panel de Administración</h1>
          <p className="text-white/50 text-sm">Inicia sesión para acceder al CMS</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111d33] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70 text-sm">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@comprandoamerica.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70 text-sm">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Comprando América &copy; {new Date().getFullYear()} &mdash; Panel de Administración
        </p>
      </div>
    </div>
  );
}
