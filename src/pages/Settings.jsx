import { Formik, Field, Form } from "formik";
import React from "react";
import { useAuth, useUserQuery } from "../hooks";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import { SEO } from "../components";

function Settings() {
  const { logout, login, authUser } = useAuth();          // ← local snapshot as instant fallback
  const { isCurrentUserLoading, currentUser, currentUserError } = useUserQuery();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Prefer the fresh API response; fall back to the locally-stored auth snapshot
  // (available immediately, even before the network call returns)
  const user = currentUser?.user ?? authUser ?? {};

  async function onSubmit(values, { setErrors, setStatus }) {
    try {
      const payload = { ...values };
      if (!payload.password) delete payload.password;   // blank password → don't overwrite

      const { data } = await axios.put(
        `${API_BASE_URL}/api/user`,
        { user: payload },
      );

      const updatedUsername = data?.user?.username;

      login(data?.user);

      queryClient.invalidateQueries(["currentUser"]);
      queryClient.invalidateQueries([`/profiles/${updatedUsername}`]);
      queryClient.invalidateQueries([`/user`]);

      navigate(`/profile/${updatedUsername}`);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 422) setErrors(data.errors);
        else setStatus({ apiError: `Error ${status}: ${data?.message || "Something went wrong"}` });
      } else {
        setStatus({ apiError: "Network error — is the backend running?" });
      }
    }
  }

  return (
    <div className="settings-page">
      <SEO
        title="Settings"
        description="Update your Blogging profile settings."
        noindex={true}
      />
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {currentUserError && (
              <div className="settings-fetch-error">
                ⚠ Could not load your settings from server — showing cached data.
              </div>
            )}

            <Formik
              onSubmit={onSubmit}
              initialValues={{
                image:    user.image    || "",
                username: user.username || "",
                bio:      user.bio      || "",
                email:    user.email    || "",
                password: "",
              }}
              enableReinitialize   // re-populate once API data arrives
            >
              {({ isSubmitting, status }) => (
                <>
                  {status?.apiError && (
                    <div className="error-messages">{status.apiError}</div>
                  )}

                  <Form>
                    <fieldset disabled={isSubmitting}>

                      {/* Profile picture URL */}
                      <fieldset className="form-group">
                        <label className="settings-label">Profile Picture URL</label>
                        <Field
                          type="url"
                          name="image"
                          placeholder="https://…"
                          maxLength={2048}
                          className="form-control"
                        />
                      </fieldset>

                      {/* Username — pre-filled */}
                      <fieldset className="form-group">
                        <label className="settings-label">Username</label>
                        <Field
                          type="text"
                          name="username"
                          placeholder="Username"
                          maxLength={100}
                          className="form-control form-control-lg"
                        />
                      </fieldset>

                      {/* Bio */}
                      <fieldset className="form-group">
                        <label className="settings-label">Bio</label>
                        <Field
                          as="textarea"
                          name="bio"
                          placeholder="Short bio about you"
                          maxLength={1000}
                          className="form-control"
                          rows={3}
                        />
                      </fieldset>

                      {/* Email — pre-filled */}
                      <fieldset className="form-group">
                        <label className="settings-label">Email</label>
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          maxLength={254}
                          className="form-control form-control-lg"
                        />
                      </fieldset>

                      {/* Password — always blank */}
                      <fieldset className="form-group">
                        <label className="settings-label">New Password</label>
                        <Field
                          type="password"
                          name="password"
                          placeholder="Leave blank to keep current password"
                          maxLength={72}
                          className="form-control form-control-lg"
                        />
                      </fieldset>

                      <button
                        type="submit"
                        className="btn btn-lg btn-primary pull-xs-right"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving…" : "Update Settings"}
                      </button>
                    </fieldset>
                  </Form>

                  <hr />
                  <button
                    onClick={() => { logout(); navigate("/"); }}
                    type="button"
                    className="btn btn-outline-danger"
                  >
                    Or click here to logout.
                  </button>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
