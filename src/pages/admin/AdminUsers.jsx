import React, { useState } from "react";
import {
  Trash2,
  Pencil,
  Check,
  X,
  UserPlus,
  Copy,
  Plus,
  Send,
} from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { ROLES, ROLE_VALUES } from "../../auth/roles";
import { useLanguage } from "../../context/LanguageContext";
import ReAuthModal from "../../components/admin/ReAuthModal";
import SendMessageModal from "../../components/admin/SendMessageModal";
import PhoneInput from "../../components/PhoneInput";

const TEXT = {
  en: {
    title: "Users",
    subtitle:
      "Manage users, roles, and account info. Only admins can access this page.",
    name: "Name",
    whatsapp: "WhatsApp",
    role: "Role",
    actions: "Actions",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    sendMessage: "Send Message",
    addUser: "Invite new user",
    addUserBtn: "Add user directly",
    addUserTitle: "Create a new user",
    addUserHelp:
      "The new user will be created with the password you set here. Share these credentials with them via WhatsApp.",
    fullName: "Full name",
    email: "Email",
    password: "Temporary password",
    generate: "Generate",
    create: "Create user",
    creating: "Creating…",
    createFailed: "Could not create the user.",
    confirmEmailNote:
      "If 'Confirm email' is enabled in Supabase, the new user must confirm their email before logging in.",
    inviteHelp:
      "Or share the public signup link via WhatsApp, then assign their role here.",
    copyLink: "Copy signup link",
    copied: "Link copied!",
    cannotDemoteSelf: "You cannot demote yourself.",
    cannotRemoveLastAdmin: "At least one admin must remain.",
    cannotDeleteSelf: "You cannot delete yourself.",
    confirmDelete: "Re-enter your password to delete this user.",
    saveFailed: "Could not save changes.",
    deleteFailed: "Could not delete this user.",
  },
  ar: {
    title: "المستخدمون",
    subtitle: "إدارة المستخدمين والأدوار والبيانات. هذه الصفحة للمديرين فقط.",
    name: "الاسم",
    whatsapp: "واتساب",
    role: "الدور",
    actions: "إجراءات",
    edit: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    sendMessage: "إرسال رسالة",
    addUser: "دعوة مستخدم جديد",
    addUserBtn: "إضافة مستخدم مباشرة",
    addUserTitle: "إنشاء مستخدم جديد",
    addUserHelp:
      "سيتم إنشاء المستخدم بكلمة المرور التي تحددها هنا. شارك بياناته معه عبر الواتساب.",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة مرور مؤقتة",
    generate: "توليد",
    create: "إنشاء المستخدم",
    creating: "جارٍ الإنشاء…",
    createFailed: "تعذر إنشاء المستخدم.",
    confirmEmailNote:
      "إذا كان تفعيل البريد مفعّلاً في Supabase، يجب على المستخدم تأكيد بريده قبل تسجيل الدخول.",
    inviteHelp:
      "أو شارك رابط التسجيل العام عبر الواتساب، ثم اضبط الدور من هنا.",
    copyLink: "نسخ رابط التسجيل",
    copied: "تم النسخ!",
    cannotDemoteSelf: "لا يمكنك تخفيض رتبتك بنفسك.",
    cannotRemoveLastAdmin: "يجب أن يبقى مدير واحد على الأقل.",
    cannotDeleteSelf: "لا يمكنك حذف نفسك.",
    confirmDelete: "أعد إدخال كلمة المرور لحذف هذا المستخدم.",
    saveFailed: "تعذر حفظ التعديلات.",
    deleteFailed: "تعذر حذف هذا المستخدم.",
  },
};

const AdminUsers = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const {
    users,
    currentUser,
    setUserRole,
    updateUserProfile,
    createUser,
    deleteUser,
  } = useAuth();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ displayName: "", phone: "" });
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addDraft, setAddDraft] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: ROLES.CLIENT,
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [messageUser, setMessageUser] = useState(null);

  const adminCount = users.filter((u) => u.role === ROLES.ADMIN).length;
  const signupUrl = `${window.location.origin}/signup`;

  const handleRoleChange = (user, nextRole) => {
    if (user.id === currentUser?.id && nextRole !== ROLES.ADMIN) {
      window.alert(t.cannotDemoteSelf);
      return;
    }
    if (
      user.role === ROLES.ADMIN &&
      nextRole !== ROLES.ADMIN &&
      adminCount <= 1
    ) {
      window.alert(t.cannotRemoveLastAdmin);
      return;
    }
    setUserRole(user.id, nextRole);
  };

  const beginEdit = (u) => {
    setEditingId(u.id);
    setEditDraft({
      displayName: u.displayName || "",
      phone: u.phone || u.whatsapp || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ displayName: "", phone: "" });
  };

  const saveEdit = async (u) => {
    try {
      await updateUserProfile(u.id, {
        displayName: editDraft.displayName,
        phone: editDraft.phone,
      });
      cancelEdit();
    } catch {
      window.alert(t.saveFailed);
    }
  };

  const requestDelete = (user) => {
    if (user.id === currentUser?.id) {
      window.alert(t.cannotDeleteSelf);
      return;
    }
    if (user.role === ROLES.ADMIN && adminCount <= 1) {
      window.alert(t.cannotRemoveLastAdmin);
      return;
    }
    setPendingDeleteId(user.id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteUser(pendingDeleteId);
    } catch (err) {
      window.alert(err?.message || t.deleteFailed);
    }
  };

  const copySignupLink = async () => {
    try {
      await navigator.clipboard.writeText(signupUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t.copyLink, signupUrl);
    }
  };

  const openAddModal = () => {
    setAddDraft({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: ROLES.CLIENT,
    });
    setCreateError("");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    if (creating) return;
    setShowAddModal(false);
  };

  const generatePassword = () => {
    const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    const arr = new Uint32Array(12);
    crypto.getRandomValues(arr);
    for (let i = 0; i < arr.length; i += 1) {
      out += chars[arr[i] % chars.length];
    }
    setAddDraft((d) => ({ ...d, password: out }));
  };

  const submitAddUser = async (e) => {
    e.preventDefault();
    setCreateError("");
    if (addDraft.password.length < 6) {
      setCreateError("Password must be at least 6 characters.");
      return;
    }
    setCreating(true);
    try {
      await createUser({
        email: addDraft.email.trim().toLowerCase(),
        password: addDraft.password,
        fullName: addDraft.fullName.trim(),
        phone: addDraft.phone.trim(),
        role: addDraft.role,
      });
      setShowAddModal(false);
    } catch (err) {
      setCreateError(err?.message || t.createFailed);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-serif font-bold text-sage-900">
            {t.title}
          </h1>
          <p className="text-sage-700">{t.subtitle}</p>
        </div>
      </div>

      {/* Invite card */}
      <div className="bg-sand-50 border border-sand-200 rounded-2xl p-5 flex items-start gap-3">
        <div className="bg-sage-700 text-white rounded-full p-2 shrink-0">
          <UserPlus size={18} />
        </div>
        <div className="flex-1">
          <h2 className="font-medium text-sage-900 mb-1">{t.addUser}</h2>
          <p className="text-sm text-sage-700 mb-3">{t.inviteHelp}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-sage-700 hover:bg-sage-800 text-white text-sm"
            >
              <Plus size={14} /> {t.addUserBtn}
            </button>
            <code className="px-3 py-2 bg-white border border-sand-300 rounded-lg text-xs text-sage-800 break-all">
              {signupUrl}
            </code>
            <button
              onClick={copySignupLink}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-sage-300 text-sage-800 bg-white hover:bg-sage-50 text-sm"
            >
              <Copy size={14} />
              {copied ? t.copied : t.copyLink}
            </button>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sand-50">
            <tr className="text-left rtl:text-right text-sage-700">
              <th className="px-4 py-3">{t.name}</th>
              <th className="px-4 py-3">{t.whatsapp}</th>
              <th className="px-4 py-3">{t.role}</th>
              <th className="px-4 py-3">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isEditing = editingId === u.id;
              return (
                <tr key={u.id} className="border-t border-sand-100 align-top">
                  <td className="px-4 py-3 font-medium text-sage-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editDraft.displayName}
                        onChange={(e) =>
                          setEditDraft((d) => ({
                            ...d,
                            displayName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-sand-300 rounded-lg"
                      />
                    ) : (
                      u.displayName || "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sage-800 min-w-[260px]">
                    {isEditing ? (
                      <PhoneInput
                        value={editDraft.phone}
                        onChange={(v) =>
                          setEditDraft((d) => ({ ...d, phone: v }))
                        }
                      />
                    ) : (
                      u.whatsapp || "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      disabled={isEditing}
                      className="border border-sand-300 rounded-lg px-2 py-1 text-sm disabled:opacity-60"
                    >
                      {ROLE_VALUES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(u)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          >
                            <Check size={14} /> {t.save}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-sand-300 text-sage-700 bg-white hover:bg-sand-50"
                          >
                            <X size={14} /> {t.cancel}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => beginEdit(u)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-sage-200 text-sage-800 bg-white hover:bg-sage-50"
                          >
                            <Pencil size={14} /> {t.edit}
                          </button>
                          <button
                            onClick={() => setMessageUser(u)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-sage-200 text-sage-800 bg-white hover:bg-sage-50"
                          >
                            <Send size={14} /> {t.sendMessage}
                          </button>
                          <button
                            onClick={() => requestDelete(u)}
                            disabled={u.id === currentUser?.id}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 ${
                              u.id === currentUser?.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Trash2 size={14} /> {t.delete}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ReAuthModal
        open={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        message={t.confirmDelete}
      />

      <SendMessageModal
        open={!!messageUser}
        user={messageUser}
        onClose={() => setMessageUser(null)}
        actorId={currentUser?.id}
        language={language}
      />

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-sage-900/40 flex items-center justify-center px-4"
          onClick={closeAddModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-sand-200 w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-sage-900">
                  {t.addUserTitle}
                </h2>
                <p className="text-sm text-sage-700 mt-1">{t.addUserHelp}</p>
              </div>
              <button
                onClick={closeAddModal}
                className="text-sage-500 hover:text-sage-800"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitAddUser} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-sage-800 mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={addDraft.fullName}
                  onChange={(e) =>
                    setAddDraft((d) => ({ ...d, fullName: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-sand-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-800 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  value={addDraft.email}
                  onChange={(e) =>
                    setAddDraft((d) => ({ ...d, email: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-sand-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-800 mb-1">
                  {t.whatsapp}
                </label>
                <PhoneInput
                  value={addDraft.phone}
                  onChange={(v) => setAddDraft((d) => ({ ...d, phone: v }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-800 mb-1">
                  {t.password}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addDraft.password}
                    onChange={(e) =>
                      setAddDraft((d) => ({ ...d, password: e.target.value }))
                    }
                    required
                    minLength={6}
                    className="flex-1 px-3 py-2 border border-sand-300 rounded-lg font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-3 py-2 rounded-lg border border-sand-300 text-sage-700 bg-white hover:bg-sand-50 text-sm whitespace-nowrap"
                  >
                    {t.generate}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-800 mb-1">
                  {t.role}
                </label>
                <select
                  value={addDraft.role}
                  onChange={(e) =>
                    setAddDraft((d) => ({ ...d, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-sand-300 rounded-lg"
                >
                  {ROLE_VALUES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {createError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {createError}
                </p>
              )}

              <p className="text-xs text-sage-600 italic">
                {t.confirmEmailNote}
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 rounded-lg bg-sage-700 hover:bg-sage-800 text-white text-sm font-medium disabled:opacity-60"
                >
                  {creating ? t.creating : t.create}
                </button>
                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={creating}
                  className="px-4 py-2 rounded-lg border border-sand-300 bg-white text-sage-700 text-sm hover:bg-sand-50"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
