import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import BrandLogo from "../../components/BrandLogo";
import PhoneInput from "../../components/PhoneInput";

const Signup = () => {
  const navigate = useNavigate();
  const { signUpWithEmail } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await signUpWithEmail({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
      });
      // If email confirmation is required, session will be null.
      if (!result?.session) {
        setSuccess(
          "Account created. Please check your email to confirm your address before signing in.",
        );
      } else {
        navigate("/account", { replace: true });
      }
    } catch (err) {
      setError(err?.message || "Could not create your account.");
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
          Create your account
        </h1>
        <p className="text-center text-sage-600 mb-6 text-sm">
          Join yogaTupia to book classes and retreats.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-leaf-50 border border-leaf-200 text-leaf-800 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
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
              WhatsApp / Phone
            </label>
            <PhoneInput
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
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
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-sage-700 hover:bg-sage-800 text-white font-medium transition disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-sage-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-sage-800 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
