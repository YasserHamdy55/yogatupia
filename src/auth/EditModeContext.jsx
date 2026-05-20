import React, { createContext, useContext, useMemo, useState } from "react";

const EditModeContext = createContext(null);

export const EditModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const value = useMemo(
    () => ({
      editMode,
      setEditMode,
      toggleEditMode: () => setEditMode((v) => !v),
    }),
    [editMode],
  );
  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return ctx;
};
