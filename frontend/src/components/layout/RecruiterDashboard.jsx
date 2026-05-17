import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Shield, Calendar, LogOut, ExternalLink, Building2 } from "lucide-react";

/**
 * RecruiterDashboard
 * Full-screen iframe of aegis-recruiter-dashboard.html served from /public.
 * The iframe sends postMessage("aegis:openProfile") when the account icon is clicked.
 * This React wrapper listens and opens a proper ProfileModal overlay.
 */
export function RecruiterDashboard({ user, logout }) {
  const iframeRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Height sync
  useEffect(() => {
    const resize = () => {
      if (iframeRef.current) {
        iframeRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Listen for profile-open signal from iframe
  useEffect(() => {
    const handler = (e) => {
      if (e.data === "aegis:openProfile") {
        setProfileOpen(true);
      }
      if (e.data === "aegis:logout") {
        if (logout) logout();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [logout]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "#0a0a0f" }}>
      <iframe
        ref={iframeRef}
        src="/recruiter-dashboard.html"
        title="Aegis Recruiter Dashboard"
        style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
        allow="same-origin"
      />

      {/* React ProfileModal — bridged from iframe via postMessage */}
      <AnimatePresence>
        {profileOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
              }}
            />

            {/* Modal Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                background: "linear-gradient(145deg, #13111f, #0f0d1a)",
                border: "1px solid rgba(124,77,255,0.2)",
                borderRadius: 28,
                overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,77,255,0.1)",
              }}
            >
              {/* Purple gradient header bar */}
              <div
                style={{
                  height: 96,
                  background: "linear-gradient(135deg, rgba(124,77,255,0.4) 0%, rgba(45,212,161,0.2) 100%)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, transparent 50%, rgba(19,17,31,0.8))",
                  }}
                />
              </div>

              <div style={{ padding: "0 28px 28px", position: "relative" }}>
                {/* Avatar — overlapping the header */}
                <div style={{ position: "relative", marginTop: -52, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 20,
                      background: "linear-gradient(135deg, #7c4dff, #4a25d4)",
                      border: "3px solid #13111f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: 1,
                      boxShadow: "0 8px 32px rgba(124,77,255,0.4)",
                    }}
                  >
                    {user?.displayName
                      ? user.displayName
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "HR"}
                  </div>
                  {/* Online dot */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 2,
                      left: 58,
                      width: 14,
                      height: 14,
                      background: "#2dd4a1",
                      borderRadius: "50%",
                      border: "2px solid #13111f",
                    }}
                  />
                </div>

                {/* Close button */}
                <button
                  onClick={() => setProfileOpen(false)}
                  style={{
                    position: "absolute",
                    top: -80,
                    right: 0,
                    width: 36,
                    height: 36,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8e8ba0",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>

                {/* Name & Role */}
                <div style={{ marginBottom: 20 }}>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#e8e6f0",
                      margin: 0,
                      letterSpacing: -0.5,
                    }}
                  >
                    {user?.displayName || "Recruiter"}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <span
                      style={{
                        padding: "2px 10px",
                        background: "rgba(124,77,255,0.12)",
                        border: "1px solid rgba(124,77,255,0.25)",
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#7c4dff",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Recruiter
                    </span>
                    <span style={{ fontSize: 11, color: "#4e4b60" }}>• Verified Account</span>
                  </div>
                </div>

                {/* Info rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {[
                    { icon: <Mail size={16} />, label: "Email", value: user?.email || "recruiter@company.com" },
                    { icon: <Building2 size={16} />, label: "Company", value: "Persistent Systems" },
                    { icon: <Shield size={16} />, label: "User ID", value: (user?.uid || "mock-uid-12345").slice(0, 20) + "…" },
                    { icon: <Calendar size={16} />, label: "Member Since", value: "April 2026" },
                  ].map(({ icon, label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#8e8ba0",
                          flexShrink: 0,
                        }}
                      >
                        {icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "#4e4b60",
                            marginBottom: 2,
                          }}
                        >
                          {label}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#c9c7d8" }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <button
                    onClick={() => setProfileOpen(false)}
                    style={{
                      height: 44,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      color: "#c9c7d8",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      if (logout) logout();
                    }}
                    style={{
                      height: 44,
                      background: "rgba(255,95,122,0.08)",
                      border: "1px solid rgba(255,95,122,0.2)",
                      borderRadius: 12,
                      color: "#ff5f7a",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ff5f7a";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,95,122,0.08)";
                      e.currentTarget.style.color = "#ff5f7a";
                    }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
