import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_SESSION_KEY, isAdminAuthenticated } from "@/lib/adminAuth";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const configuredPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    if (isAdminAuthenticated()) setLocation("/admin/inventory");
  }, [setLocation]);

  const signIn = (event: FormEvent) => {
    event.preventDefault();
    if (!configuredPassword) {
      setError("Admin access is not configured for this deployment.");
      return;
    }
    if (password !== configuredPassword) {
      setError("Incorrect admin password.");
      return;
    }
    sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
    setLocation("/admin/inventory");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-7 flex items-center gap-3">
          <span className="rounded-xl bg-orange-100 p-3 text-orange-700">
            <LockKeyhole size={24} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              Private Access
            </p>
            <h1 className="text-2xl font-bold text-slate-950">
              Krishna Electronics Admin
            </h1>
          </div>
        </div>

        <form onSubmit={signIn} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
            />
          </div>
          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-orange-500 font-semibold hover:bg-orange-600"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-xs leading-relaxed text-slate-500">
          Demo-only frontend access. Use server-side authentication before deploying
          an inventory system to production.
        </p>
      </section>
    </main>
  );
}
