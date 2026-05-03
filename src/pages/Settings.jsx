import { Formik, Field, Form } from "formik";
import React from "react";
import { useAuth, useUserQuery } from "../hooks";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";

function Settings() {
  const { logout, login } = useAuth();
  const {
    isCurrentUserLoading,
    currentUser,
    currentUserError,
  } = useUserQuery();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function onSubmit(values, { setErrors }) {
    try {
      // Remove empty password so it doesn't overwrite with blank
      const payload = { ...values };
      if (!payload.password) delete payload.password;

      const { data } = await axios.put(
        `${API_BASE_URL}/api/user`,
        { user: payload },
      );

      const updatedUsername = data?.user?.username;

      login(data?.user);

      queryClient.invalidateQueries([`/profiles/${updatedUsername}`]);
      queryClient.invalidateQueries([`/user`]);
      queryClient.invalidateQueries(["currentUser"]);

      navigate(`/profile/${updatedUsername}`);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 422) {
        setErrors(data.errors);
      }
    }
  }

  if (isCurrentUserLoading) {
    return (
      <div className="settings-page">
        <div className="container page">
          <p style={{ textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-ui)", fontSize: "0.82rem", letterSpacing: "0.1em" }}>
            Loading settings…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <Formik
              onSubmit={onSubmit}
              initialValues={{
                image: currentUser?.user?.image || "",
                username: currentUser?.user?.username || "",
                bio: currentUser?.user?.bio || "",
                email: currentUser?.user?.email || "",
                password: "",
              }}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <>
                  <Form>
                    <fieldset disabled={isSubmitting}>

                      <fieldset className="form-group">
                        <Field
                          type="url"
                          name="image"
                          placeholder="URL of profile picture"
                          className="form-control"
                        />
                      </fieldset>

                      <fieldset className="form-group">
                        <Field
                          type="text"
                          name="username"
                          placeholder="Your username"
                          className="form-control form-control-lg"
                        />
                      </fieldset>

                      <fieldset className="form-group">
                        <Field
                          as="textarea"
                          name="bio"
                          placeholder="Short bio about you"
                          className="form-control"
                          rows={4}
                        />
                      </fieldset>

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
                          placeholder="New password (leave blank to keep current)"
                          className="form-control form-control-lg"
                        />
                      </fieldset>

                      <button
                        type="submit"
                        className="btn btn-lg btn-primary pull-xs-right"
                      >
                        Update Settings
                      </button>
                    </fieldset>
                  </Form>
                  <hr />
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
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
