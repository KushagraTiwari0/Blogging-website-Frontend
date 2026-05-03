import { Formik, Field, Form } from "formik";
import React from "react";
import { useAuth, useUserQuery } from "../hooks";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
      const { data } = await axios.put(
        `https://blogging-website-backend-9gfs.onrender.com/api/user`,
        { user: values },
      );

      const updatedUsername =
        data?.user?.username;

      login(data?.user);

      queryClient.invalidateQueries(
        `/profiles/${updatedUsername}`,
      );
      queryClient.invalidateQueries(`/user`);

      navigate(`/profile/${updatedUsername}`);
    } catch (error) {
      const { status, data } = error.response;

      if (status === 422) {
        setErrors(data.errors);
      }
    }
  }
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">
              Your Settings
            </h1>

            <Formik
              onSubmit={onSubmit}
              initialValues={currentUser?.user}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <>
                  <Form>
                    <fieldset
                      disabled={isSubmitting}
                    >
                    
                      <fieldset className="form-group">
                        <Field
                          type="text"
                          name="username"
                          placeholder="Your Name"
                          className="form-control form-control-lg"
                        />
                      </fieldset>

                 

                      <fieldset className="form-group">
                        <Field
                          type="text"
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
                        className="btn btn-lg btn-primary pill-xs-right"
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
