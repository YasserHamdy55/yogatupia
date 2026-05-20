import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ContentProvider } from "./context/ContentContext";
import { AuthProvider } from "./auth/AuthContext";
import { ImpersonationProvider } from "./auth/ImpersonationContext";
import { BookingsProvider } from "./bookings/BookingsContext";
import { ClassesAdminProvider } from "./data/classesAdminStore";
import { CollectionsAdminProvider } from "./data/collectionsAdminStore";
import { EditModeProvider } from "./auth/EditModeContext";
import { MediaLibraryProvider } from "./context/MediaLibraryContext";
import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";
import { ROLES } from "./auth/roles";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ImpersonationBanner from "./components/admin/ImpersonationBanner";
import AdminQuickMenu from "./components/admin/AdminQuickMenu";

import Home from "./pages/Home";
import Classes from "./pages/Classes";
import Retreats from "./pages/Retreats";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminLogin from "./pages/auth/AdminLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";

import MyAccount from "./pages/account/MyAccount";
import MyBookings from "./pages/account/MyBookings";

import StaffBookings from "./pages/staff/StaffBookings";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminContent from "./pages/AdminContent";
import AdminGallery from "./pages/admin/AdminGallery";
import RequirePasswordReady from "./auth/RequirePasswordReady";

function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <AuthProvider>
          <ImpersonationProvider>
            <BookingsProvider>
              <ClassesAdminProvider>
                <CollectionsAdminProvider>
                  <MediaLibraryProvider>
                    <EditModeProvider>
                      <Router>
                        <div className="flex flex-col min-h-screen bg-white">
                          <ImpersonationBanner />
                          <Navbar />
                          <main className="flex-grow">
                            <RequirePasswordReady>
                              <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/classes" element={<Classes />} />
                                <Route
                                  path="/retreats"
                                  element={<Retreats />}
                                />
                                <Route path="/pricing" element={<Pricing />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />

                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route
                                  path="/forgot-password"
                                  element={<ForgotPassword />}
                                />
                                <Route
                                  path="/admin/login"
                                  element={<AdminLogin />}
                                />

                                <Route
                                  path="/account"
                                  element={
                                    <RequireAuth>
                                      <MyAccount />
                                    </RequireAuth>
                                  }
                                />
                                <Route
                                  path="/account/bookings"
                                  element={
                                    <RequireAuth>
                                      <MyBookings />
                                    </RequireAuth>
                                  }
                                />

                                <Route
                                  path="/staff/bookings"
                                  element={
                                    <RequireRole role={ROLES.STAFF}>
                                      <StaffBookings />
                                    </RequireRole>
                                  }
                                />

                                <Route
                                  path="/admin"
                                  element={
                                    <RequireRole role={ROLES.ADMIN}>
                                      <AdminLayout />
                                    </RequireRole>
                                  }
                                >
                                  <Route index element={<AdminDashboard />} />
                                  <Route
                                    path="users"
                                    element={<AdminUsers />}
                                  />
                                  <Route
                                    path="bookings"
                                    element={<StaffBookings />}
                                  />
                                  <Route
                                    path="content"
                                    element={<AdminContent />}
                                  />
                                  <Route
                                    path="gallery"
                                    element={<AdminGallery />}
                                  />
                                  <Route path="logs" element={<AdminLogs />} />
                                </Route>

                                <Route
                                  path="*"
                                  element={<Navigate to="/" replace />}
                                />
                              </Routes>
                            </RequirePasswordReady>
                          </main>
                          <Footer />
                          <AdminQuickMenu />
                        </div>
                      </Router>
                    </EditModeProvider>
                  </MediaLibraryProvider>
                </CollectionsAdminProvider>
              </ClassesAdminProvider>
            </BookingsProvider>
          </ImpersonationProvider>
        </AuthProvider>
      </ContentProvider>
    </LanguageProvider>
  );
}

export default App;
