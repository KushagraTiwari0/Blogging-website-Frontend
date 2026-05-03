import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";
import { API_BASE_URL } from "../constants";

function Auth() {
  const isRegister = useMatch("/register");
  const navigate   = useNavigate();
  const { login }  = useAuth();

  // Plain error strings shown above the form
  const [authErrors, setAuthErrors] = useState([]);

  async function onSubmit(values, actions) {
    setAuthErrors([]);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/users${isRegister ? "" : "/login"}`,
        { user: values }
      );
      login(data.user);
      navigate("/");
    } catch (error) {
      const res  = error.response;
      const data = res?.data;

      if (!res) {
        // No response at all — network down
        setAuthErrors(["Cannot reach the server. Please try again."]);
        return;
      }

      const status = res.status;

      if (status === 401) {
        setAuthErrors(["Invalid email or password. Please try again."]);
        return;
      }

      if (status === 403) {
        setAuthErrors(["Your account is not authorized."]);
        return;
      }

      if (status === 404) {
        setAuthErrors(["No account found with that email. Please sign up."]);
        return;
      }

      if (status === 422 && data?.errors) {
        // Backend returns { errors: { "email or password": ["is invalid"] } }
        // or { errors: { email: ["already taken"] } } for register
        const msgs = [];
        for (const [field, messages] of Object.entries(data.errors)) {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => {
              // Make the message human-readable
              if (field === "email or password") {
                msgs.push("Invalid email or password.");
              } else {
                msgs.push(`${capitalize(field)} ${msg}.`);
              }
            });
          }
        }
        setAuthErrors(msgs.length ? msgs : ["Something went wrong. Please try again."]);
        return;
      }

      // Generic fallback
      const fallback =
        data?.message ||
        data?.error ||
        "Something went wrong. Please try again.";
      setAuthErrors([fallback]);
    } finally {
      actions.setSubmitting(false);
    }
  }

  const loginInitialValues = { email: "", password: "" };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">

            <h1 className="text-xs-center">
              Sign {isRegister ? "up" : "in"}
            </h1>

            <p className="text-xs-center">
              <Link to={isRegister ? "/login" : "/register"}>
                {isRegister ? "Have" : "Need"}&nbsp;an account?
              </Link>
            </p>

            {/* ── Error banner ── */}
            {authErrors.length > 0 && (
              <div className="auth-error-banner">
                {authErrors.map((msg, i) => (
                  <p key={i} className="auth-error-msg">
                    <span className="auth-error-icon">✕</span>
                    {msg}
                  </p>
                ))}
              </div>
            )}

            <Formik
              onSubmit={onSubmit}
              initialValues={
                isRegister
                  ? { ...loginInitialValues, username: "" }
                  : loginInitialValues
              }
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <fieldset disabled={isSubmitting}>

                    {isRegister && (
                      <fieldset className="form-group">
                        <Field
                          type="text"
                          name="username"
                          placeholder="Your Name"
                          className="form-control form-control-lg"
                        />
                      </fieldset>
                    )}

                    <fieldset className="form-group">
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control form-control-lg"
                      />
                    </fieldset>

                    <fieldset className="form-group">
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
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