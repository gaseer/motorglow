"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Invalid credentials.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-full bg-[#C8F135]" />
          <span className="font-bold text-2xl text-[#0D0D0D]">MotorGlow</span>
        </div>

        <h1 className="text-2xl font-bold text-[#0D0D0D] mb-1">Admin access</h1>
        <p className="text-sm text-[#6B6B6B] mb-6">Restricted — authorized personnel only.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-[#0D0D0D] block mb-1.5" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="komban"
              autoComplete="username"
              required
              className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#0D0D0D] block mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 pr-10 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#0D0D0D] cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button variant="accent" className="w-full" loading={loading} type="submit">
            Sign in <ArrowRight size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
