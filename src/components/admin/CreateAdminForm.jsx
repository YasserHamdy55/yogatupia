import React, { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../auth/roles";
import { useLanguage } from "../../context/LanguageContext";

const TEXT = {
  en: {
    title: "Create staff / admin account",
    hint: "Issues a phone-and-password login for a new staff or admin user.",
    username: "Username",
    phone: "Phone number",
    password: "Password",
    role: "Role",
    submit: "Create account",
    success: "Account created.",
    failed: "Could not create account.",
    roleAdmin: "Admin",
    roleStaff: "Staff",
  },
  ar: {
    title: "إنشاء حساب أدمن / موظف",
    hint: "يُنشئ حساباً برقم هاتف وكلمة مرور لمستخدم جديد.",
    username: "اسم المستخدم",
    phone: "رقم الهاتف",
    password: "كلمة المرور",
    role: "الدور",
    submit: "إنشاء الحساب",
    success: "تم إنشاء الحساب.",
    failed: "تعذّر إنشاء الحساب.",
    roleAdmin: "أدمن",
    roleStaff: "موظف",
  },
};

const CreateAdminForm = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { registerLocalUser } = useAuth();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ kind: "", text: "" });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ kind: "", text: "" });
    try {
      await registerLocalUser({ username, phone, password, role });
      setMsg({ kind: "ok", text: t.success });
      setUsername("");
      setPhone("");
      setPassword("");
    } catch (err) {
      setMsg({ kind: "err", text: err?.message || t.failed });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sand-200 p-5 space-y-4">
      <div>
        <h3 className="text-lg font-serif font-bold text-sage-900">
          {t.title}
        </h3>
        <p className="text-sm text-sage-700">{t.hint}</p>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t.username}
          className="px-3 py-2 border border-sand-300 rounded-lg text-sm"
          required
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t.phone}
          className="px-3 py-2 border border-sand-300 rounded-lg text-sm"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.password}
          className="px-3 py-2 border border-sand-300 rounded-lg text-sm"
          minLength={6}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 border border-sand-300 rounded-lg text-sm"
        >
          <option value={ROLES.ADMIN}>{t.roleAdmin}</option>
          <option value={ROLES.STAFF}>{t.roleStaff}</option>
        </select>
        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="btn-primary !py-2 !px-5 text-sm disabled:opacity-60"
          >
            {t.submit}
          </button>
          {msg.text && (
            <span
              className={`text-sm ${
                msg.kind === "ok" ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {msg.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateAdminForm;
