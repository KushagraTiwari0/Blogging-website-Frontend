import { Form, Formik, Field } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormErrors, TagsInput } from "../components";
import useCreateArticle from "../hooks/useCreateArticle";
import { useUpdateArticle } from "../hooks";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../constants";

function Editor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const [initialValues, setInitialValues] = React.useState({
    title: "",
    description: "",
    body: "",
    tagList: [],
  });
  const [isLoadingArticle, setIsLoadingArticle] = React.useState(false);

  const { isCreating, createArticle } = useCreateArticle();
  const { isUpdating, updateArticle } = useUpdateArticle();

  React.useEffect(() => {
    if (slug) {
      const fetchArticle = async () => {
        setIsLoadingArticle(true);
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/articles/${slug}`);
          const { title, description, body, tagList } = data.article;
          setInitialValues({ title, description, body, tagList });
        } catch (error) {
          console.error("Error fetching article for editing:", error);
        } finally {
          setIsLoadingArticle(false);
        }
      };
      fetchArticle();
    }
  }, [slug]);

  async function onSubmit(values, { setErrors }) {
    try {
      if (slug) {
        updateArticle({ slug, values });
      } else {
        createArticle({ values });
      }
      queryClient.invalidateQueries(["articles"]);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 422) {
        setErrors(data.errors);
      }
    }
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {isLoadingArticle ? (
              <p>Loading article data...</p>
            ) : (
              <Formik
                onSubmit={onSubmit}
                initialValues={initialValues}
                enableReinitialize
              >
              {({ isSubmitting }) => (
                <>
                  <FormErrors />
                  <Form>
                    <fieldset disabled={isSubmitting}>
                      <fieldset className="form-group">
                        <Field
                          name="title"
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Article Title"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="description"
                          type="text"
                          className="form-control"
                          placeholder="What's this article about?"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="body"
                          as="textarea"
                          className="form-control"
                          rows={8}
                          placeholder="Write your article (in markdown)"
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          name="tagList"
                          component={TagsInput}
                        />
                      </fieldset>
                      
                      <button
                        className="btn btn-lg pull-xs-right btn-primary"
                        type="submit"
                      >
                        {slug ? "Update Article" : "Publish Article"}
                      </button>
                    </fieldset>
                  </Form>
                </>
              )}
            </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
