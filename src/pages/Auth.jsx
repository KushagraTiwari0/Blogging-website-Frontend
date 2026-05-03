import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Link,
  useMatch,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";
import { API_BASE_URL } from "../constants";

function Auth() {
  const isRegister = useMatch("/register");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function onSubmit(values, actions) {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/users${isRegister ? "" : "/login"}`,
        { user: values },
      );

      login(data.user);
      navigate("/");
    } catch (error) {
      console.error("Auth error:", error);

      const { status, data } = error.response;

      if (status === 422) {
        actions.setErrors(data.errors);
      }
    } finally {
      actions.setSubmitting(false);
    }
  }

  const loginInitialValues = {
    email: "",
    password: "",
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">
              Sign {isRegister ? "up" : "in"}
            </h1>
            <p className="text-xs-center">
              <Link
                to={isRegister ? "/login" : "/register"}
              >
                {isRegister ? "Have" : "Need"}
                &nbsp;an account?
              </Link>
            </p>

            <Formik
              onSubmit={onSubmit}
              initialValues={
                isRegister
                  ? { ...loginInitialValues, username: "" }
                  : loginInitialValues
              }
            >
              {({ isSubmitting }) => (
                <>
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
                          ? "Please wait..."
                          : `Sign ${isRegister ? "up" : "in"}`}
                      </button>
                    </fieldset>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
