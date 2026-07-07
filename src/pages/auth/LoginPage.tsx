import { motion } from "framer-motion";
import { type FormEvent, useState } from "react";
import { FiEye, FiEyeOff, FiGithub, FiLock, FiMail } from "react-icons/fi";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const loginLoading = useAuthStore((state) => state.loginLoading);
  const loginError = useAuthStore((state) => state.loginError);
  const clearLoginError = useAuthStore((state) => state.clearLoginError);

  const [email, setEmail] = useState("demo@nova.ai");
  const [password, setPassword] = useState("password123");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = await login(email, password, remember);
    if (ok) {
      const target = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(target, { replace: true });
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glow-orb left-10 top-16 h-56 w-56 bg-cyan-300"
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="absolute inset-0 m-10 rounded-[32px] border border-white/40 bg-white/10 p-8 backdrop-blur-lg"
        >
          <p className="text-xs uppercase tracking-[0.32em] text-blue-100">Nova Suite</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Enterprise command center, beautifully crafted.</h1>
          <p className="mt-4 max-w-lg text-blue-100">
            Manage financial intelligence, operations, and growth in one premium workspace designed for high-performance teams.
          </p>
        </motion.div>
      </div>

      <div className="grid place-items-center p-6">
        <motion.form
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="glass w-full max-w-[460px] rounded-[28px] p-6"
        >
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue to Nova Executive OS.</p>

          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Email</span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                <FiMail className="text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    clearLoginError();
                    setEmail(event.target.value);
                  }}
                  required
                  className="w-full bg-transparent text-sm outline-none"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Password</span>
              <span className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                <FiLock className="text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    clearLoginError();
                    setPassword(event.target.value);
                  }}
                  required
                  minLength={6}
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((state) => !state)}
                  className="text-slate-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
            </label>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className="text-blue-600 hover:underline">Forgot password?</button>
          </div>

          {loginError && (
            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{loginError}</p>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loginLoading ? "Signing in..." : "Sign in"}
          </button>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button type="button" className="rounded-xl bg-white/80 p-2 text-slate-600"><FaGoogle className="mx-auto" /></button>
            <button type="button" className="rounded-xl bg-white/80 p-2 text-slate-600"><FiGithub className="mx-auto" /></button>
            <button type="button" className="rounded-xl bg-white/80 p-2 text-slate-600"><FaMicrosoft className="mx-auto" /></button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
