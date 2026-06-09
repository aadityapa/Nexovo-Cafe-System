"use client";

import { Button, Card, Input } from "@cafe/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";

export default function LoginPage() {
  const { login, token } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("owner@brewbite.demo");
  const [password, setPassword] = useState("Demo@123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (token) {
    router.replace("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.replace("/");
    } catch {
      setError("Invalid credentials. Use owner@brewbite.demo / Demo@123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_50%)]" />
      <Card className="relative w-full max-w-md !border-white/10 !bg-zinc-900/90 p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl font-bold text-zinc-900">
            B
          </div>
          <h1 className="text-2xl font-bold">Restaurant Console</h1>
          <p className="mt-1 text-sm text-zinc-400">Enterprise POS · KDS · Analytics</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button variant="gold" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in to dashboard"}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-500">
          Demo: owner@brewbite.demo · Demo@123
        </p>
      </Card>
    </main>
  );
}
