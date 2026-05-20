import React from "react";
import { Pencil, Trash2, Plus, PencilLine, Eye } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useEffectiveRole } from "../../auth/useEffectiveRole";
import { isAdmin } from "../../auth/roles";
import { useEditMode } from "../../auth/EditModeContext";

const TXT = {
  en: {
    enable: "Enable Edit Mode",
    disable: "Exit Edit Mode",
    addNew: "Add New",
    edit: "Edit",
    delete: "Delete",
    active: "Edit Mode Active",
  },
  ar: {
    enable: "تفعيل وضع التعديل",
    disable: "إنهاء وضع التعديل",
    addNew: "إضافة جديد",
    edit: "تعديل",
    delete: "حذف",
    active: "وضع التعديل مُفعَّل",
  },
};

// Hook returning the consolidated admin-edit gating flags.
export const useAdminEdit = () => {
  const role = useEffectiveRole();
  const { editMode, setEditMode, toggleEditMode } = useEditMode();
  const admin = isAdmin(role);
  return {
    isAdmin: admin,
    editMode: admin && editMode,
    setEditMode,
    toggleEditMode,
  };
};

// Header pill button placed next to the page title (admin-only).
export const AdminEditToggle = ({ className = "" }) => {
  const { language } = useLanguage();
  const { isAdmin: admin, editMode, toggleEditMode } = useAdminEdit();
  const t = TXT[language] ?? TXT.en;
  if (!admin) return null;
  return (
    <button
      type="button"
      onClick={toggleEditMode}
      aria-pressed={editMode}
      title={editMode ? t.disable : t.enable}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md ${
        editMode
          ? "bg-white text-sage-700 hover:bg-sand-100"
          : "bg-sage-800/40 backdrop-blur text-white hover:bg-sage-800/60 border border-white/40"
      } ${className}`}
    >
      {editMode ? <Eye size={16} /> : <PencilLine size={16} />}
      {editMode ? t.disable : t.enable}
    </button>
  );
};

// Amber banner shown below the hero while in edit mode, with an Add button.
export const AdminEditBar = ({ onAdd, addLabel }) => {
  const { language } = useLanguage();
  const { isAdmin: admin, editMode } = useAdminEdit();
  const t = TXT[language] ?? TXT.en;
  if (!admin || !editMode) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 text-amber-900 font-medium">
          <PencilLine size={18} />
          <span>{t.active}</span>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-600 text-white font-semibold hover:bg-sage-700 shadow-md"
          >
            <Plus size={18} />
            {addLabel ?? t.addNew}
          </button>
        )}
      </div>
    </div>
  );
};

// Floating pencil + trash overlay placed on each editable card.
export const AdminCardControls = ({ onEdit, onDelete, side = "right" }) => {
  const { language } = useLanguage();
  const { isAdmin: admin, editMode } = useAdminEdit();
  const t = TXT[language] ?? TXT.en;
  if (!admin || !editMode) return null;
  const pos = side === "left" ? "left-2" : "right-2";
  return (
    <div className={`absolute top-2 ${pos} z-20 flex items-center gap-2`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
        className="p-2 rounded-full bg-white shadow-md hover:bg-sage-50 text-sage-700"
        aria-label={t.edit}
        title={t.edit}
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="p-2 rounded-full bg-white shadow-md hover:bg-red-50 text-red-600"
        aria-label={t.delete}
        title={t.delete}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
