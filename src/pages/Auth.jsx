import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";
import { API_BASE_URL } from "../constants";
import { SEO } from "../components";
import { GoogleLogin } from "@react-oauth/google";

// ── Google Icon SVG (for custom button styling) ───────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

// ── OTP Step Component ────────────────────────────────────────────────────────
function OTPStep({ email, isRegister, onSuccess, onBack }) {
  const [otp, setOtp]             = useState(["", "", "", "", "", ""]);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [timer, setTimer]         = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  function handleChange(i, val) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const next = [...otp];
      next[i - 1] = "";
      setOtp(next);
      inputRefs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }

    setError(""); setLoading(true);
    console.log(`[OTP] Verifying code: ${code} for email: ${email}`);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/users/verify-otp`, {
        email,
        otp: code,
      });
      console.log("[OTP] Verify response:", data);
      setSuccess(`✓ ${isRegister ? "Account created!" : "Verified!"}`);
      setTimeout(() => onSuccess(data.user), 600);
    } catch (err) {
      console.error("[OTP] Verify error:", err.response?.data);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(""); setSuccess(""); setCanResend(false); setTimer(30);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    console.log(`[OTP] Resending OTP to: ${email}`);

    try {
      await axios.post(`${API_BASE_URL}/api/users/resend-otp`, { email });
      setSuccess("New OTP sent! Check your inbox.");
    } catch (err) {
      console.error("[OTP] Resend error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to resend OTP.");
      setCanResend(true);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>

      {/* Back link */}
      <p style={{ textAlign: "left", marginBottom: "16px" }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#5cb85c", fontSize: "13px", padding: 0,
        }}>
          ← Back to {isRegister ? "sign up" : "sign in"}
        </button>
      </p>

      <p style={{ marginBottom: "6px", color: "#777", fontSize: "14px" }}>
        {isRegister
          ? "We need to verify your email. Enter the 6-digit code sent to:"
          : "We sent a 6-digit code to:"}
      </p>
      <p style={{
        fontWeight: 600, marginBottom: "24px",
        background: "#f0fdf0", display: "inline-block",
        padding: "4px 14px", borderRadius: "20px",
        color: "#2d7a2d", fontSize: "14px", border: "1px solid #bbf7d0",
      }}>
        ✉ {email}
      </p>

      {/* Error banner */}
      {error && (
        <ul className="error-messages" style={{ marginBottom: "16px" }}>
          <li>{error}</li>
        </ul>
      )}

      {/* Success banner */}
      {success && (
        <div className="success-messages">
          {success}
        </div>
      )}

      {/* 6 OTP digit boxes */}
      <div style={{
        display: "flex", gap: "10px",
        justifyContent: "center", marginBottom: "24px",
      }}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{
              width: "46px", height: "56px",
              textAlign: "center",
              fontSize: "24px", fontWeight: 700,
              border: digit ? "2px solid #5cb85c" : "2px solid #ddd",
              borderRadius: "8px", outline: "none",
              color: digit ? "#2d7a2d" : "#333",
              background: digit ? "#f0fdf0" : "#fff",
              transition: "border-color 0.15s, background 0.15s",
              caretColor: "#5cb85c",
            }}
          />
        ))}
      </div>

      {/* Verify button */}
      <button
        className="btn btn-lg btn-primary pull-xs-right"
        onClick={handleVerify}
        disabled={loading || otp.join("").length < 6}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        {loading
          ? "Verifying…"
          : isRegister ? "Verify & Create Account" : "Verify & Sign in"}
      </button>

      {/* Resend */}
      <p style={{ fontSize: "13px", color: "#aaa", marginTop: "8px" }}>
        Didn't receive it?{" "}
        {canResend ? (
          <button onClick={handleResend} style={{
            background: "none", border: "none",
            color: "#5cb85c", cursor: "pointer",
            fontSize: "13px", padding: 0,
            textDecoration: "underline",
          }}>
            Resend OTP
          </button>
        ) : (
          <span style={{ color: "#bbb" }}>Resend in {timer}s</span>
        )}
      </p>
    </div>
  );
}

// ── Main Auth Component ───────────────────────────────────────────────────────
function Auth() {
  const isRegister = useMatch("/register");
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const [authErrors, setAuthErrors]     = useState([]);
  const [infoMessage, setInfoMessage]   = useState("");
  const [otpStep, setOtpStep]           = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── Google Auth Handlers ──────────────────────────────────────────────────
  async function handleGoogleSuccess(credentialResponse) {
    console.log("[GOOGLE] Credential received, sending to backend...");
    setGoogleLoading(true);
    setAuthErrors([]);
    setInfoMessage("");

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/users/google-auth`, {
        credential: credentialResponse.credential,
      });

      console.log("[GOOGLE] Backend response:", data);
      login(data.user);
      navigate("/");
    } catch (err) {
      console.error("[GOOGLE] Error:", err.response?.data);
      setAuthErrors([err.response?.data?.message || "Google sign-in failed. Please try again."]);
    } finally {
      setGoogleLoading(false);
    }
  }

  function handleGoogleError() {
    console.error("[GOOGLE] Login failed");
    setAuthErrors(["Google sign-in was cancelled or failed. Please try again."]);
    setGoogleLoading(false);
  }

  async function onSubmit(values, actions) {
    setAuthErrors([]);
    setInfoMessage("");
    try {
      const url = isRegister
        ? `${API_BASE_URL}/api/users`
        : `${API_BASE_URL}/api/users/login`;

      console.log(`[AUTH] Submitting to: ${url}`);
      const { data } = await axios.post(url, { user: values });
      console.log("[AUTH] Server response:", data);

      // Both register and login now return { step: "verify-otp" }
      if (data.step === "verify-otp") {
        setPendingEmail(data.email || values.email);
        setOtpStep(true);
        return;
      }

      if (data.step === "already-registered") {
        setInfoMessage(data.message);
        return;
      }

      // Fallback — if backend returns user directly
      login(data.user);
      navigate("/");

    } catch (error) {
      const res    = error.response;
      const data   = res?.data;
      const status = res?.status;

      console.error("[AUTH] Error response:", data);

      if (!res) {
        setAuthErrors(["Cannot reach the server. Please try again."]);
        return;
      }
      if (status === 400) {
        setAuthErrors([data?.message || "Invalid request."]);
        return;
      }
      if (status === 401) {
        setAuthErrors(["Invalid email or password. Please try again."]);
        return;
      }
      if (status === 404) {
        setAuthErrors(["No account found with that email. Please sign up."]);
        return;
      }
      if (status === 422) {
        setAuthErrors([data?.message || "Something went wrong. Please try again."]);
        return;
      }
      if (status === 500) {
        setAuthErrors([data?.message || "Server error. Please try again."]);
        return;
      }

      setAuthErrors([data?.message || "Something went wrong. Please try again."]);
    } finally {
      actions.setSubmitting(false);
    }
  }

  function handleOTPSuccess(user) {
    login(user);
    navigate("/");
  }

  function handleOTPBack() {
    setOtpStep(false);
    setPendingEmail("");
    setAuthErrors([]);
    setInfoMessage("");
  }

  const loginInitialValues = { email: "", password: "" };

  return (
    <div className="auth-page">
      <SEO
        title={otpStep ? "Verify Email" : isRegister ? "Sign Up" : "Sign In"}
        description={isRegister ? "Create a free account on Blogging and start sharing your knowledge." : "Sign in to your Blogging account to read and write articles."}
        url={window.location.href}
      />
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">

            <h1 className="text-xs-center">
              {otpStep
                ? "Verify your email"
                : `Sign ${isRegister ? "up" : "in"}`}
            </h1>

            {!otpStep && (
              <p className="text-xs-center">
                <Link to={isRegister ? "/login" : "/register"}>
                  {isRegister ? "Have" : "Need"}&nbsp;an account?
                </Link>
              </p>
            )}

            {/* ── OTP Step ── */}
            {otpStep ? (
              <OTPStep
                email={pendingEmail}
                isRegister={!!isRegister}
                onSuccess={handleOTPSuccess}
                onBack={handleOTPBack}
              />
            ) : (
              <>
                {authErrors.length > 0 && (
                  <ul className="error-messages">
                    {authErrors.map((msg, i) => <li key={i}>{msg}</li>)}
                  </ul>
                )}

                {infoMessage && (
                  <div className="info-messages">
                    <strong style={{ display: "block", marginBottom: "4px" }}>Note:</strong>
                    {infoMessage}
                    <div style={{ marginTop: "12px" }}>
                       <Link 
                         to="/login" 
                         className="btn btn-sm btn-outline-primary"
                         onClick={() => { setInfoMessage(""); setAuthErrors([]); }}
                       >
                         Switch to Sign In
                       </Link>
                    </div>
                  </div>
                )}

                {/* ── Google Sign-In ── */}
                <div className="google-auth-section" id="google-auth-section">
                  {googleLoading ? (
                    <div className="google-signin-loading">
                      <div className="google-signin-spinner"></div>
                      <span>Signing in with Google...</span>
                    </div>
                  ) : (
                    <div className="google-btn-wrapper">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        size="large"
                        width="100%"
                        text={isRegister ? "signup_with" : "signin_with"}
                        shape="rectangular"
                        theme="outline"
                        logo_alignment="left"
                      />
                    </div>
                  )}
                </div>

                {/* ── OR Divider ── */}
                <div className="auth-divider">
                  <span className="auth-divider-text">or</span>
                </div>

                <Formik
                  onSubmit={onSubmit}
                  initialValues={
                    isRegister
                      ? { ...loginInitialValues, username: "" }
                      : loginInitialValues
                  }
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <fieldset disabled={isSubmitting}>
                        {isRegister && (
                          <fieldset className="form-group">
                            <Field
                              type="text"
                              name="username"
                              placeholder="Your Name"
                              maxLength={100}
                              className="form-control form-control-lg"
                            />
                          </fieldset>
                        )}

                        <fieldset className="form-group">
                          <Field
                            type="email"
                            name="email"
                            placeholder="Email"
                            maxLength={254}
                            className="form-control form-control-lg"
                          />
                        </fieldset>

                        <fieldset className="form-group">
                          <Field
                            type="password"
                            name="password"
                            placeholder="Password"
                            maxLength={72}
                            className="form-control form-control-lg"
                          />
                        </fieldset>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-lg btn-primary pull-xs-right"
                        >
                          {isSubmitting
                            ? "Please wait…"
                            : `Sign ${isRegister ? "up" : "in"}`}
                        </button>
                      </fieldset>
                    </Form>
                  )}
                </Formik>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Auth;