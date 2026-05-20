import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import BrandLogo from "../../components/BrandLogo";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginWithEmail } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await loginWithEmail({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err?.message || "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-sage-100 p-8">
        <div className="flex justify-center mb-6">
          <BrandLogo size="md" />
        </div>
        <h1 className="text-2xl font-serif text-center text-sage-900 mb-2">
          Staff & admin sign-in
        </h1>
        <p className="text-center text-sage-600 mb-6 text-sm">
          Use your work email and password.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="email"
              className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-sage-700 hover:bg-sage-800 text-white font-medium transition disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
