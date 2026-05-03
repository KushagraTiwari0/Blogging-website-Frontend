import { Form, Formik, Field } from "formik";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { FormErrors, TagsInput } from "../components";
import useCreateArticle from "../hooks/useCreateArticle";
import { useUpdateArticle } from "../hooks";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../constants";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});
turndownService.use(gfm);

// ── Markdown Toolbar ──────────────────────────────────────────
const TOOLBAR_ACTIONS = [
  { label: "B",      title: "Bold",           wrap: ["**", "**"],          sample: "bold text"      },
  { label: "I",      title: "Italic",          wrap: ["_", "_"],            sample: "italic text"    },
  { label: "~~",     title: "Strikethrough",   wrap: ["~~", "~~"],          sample: "strikethrough"  },
  { label: "H1",     title: "Heading 1",       prefix: "# ",                sample: "Heading 1"      },
  { label: "H2",     title: "Heading 2",       prefix: "## ",               sample: "Heading 2"      },
  { label: "H3",     title: "Heading 3",       prefix: "### ",              sample: "Heading 3"      },
  { label: "❝",      title: "Blockquote",      prefix: "> ",                sample: "Quote"          },
  { label: "</>",    title: "Inline Code",     wrap: ["`", "`"],            sample: "code"           },
  { label: "```",    title: "Code Block",      wrap: ["```\n", "\n```"],    sample: "code block"     },
  { label: "—",      title: "Horizontal Rule", insert: "\n---\n"                                     },
  { label: "• list", title: "Bullet List",     prefix: "- ",                sample: "List item"      },
  { label: "1. list",title: "Numbered List",   prefix: "1. ",               sample: "List item"      },
  { label: "🔗",     title: "Link",            wrap: ["[", "](url)"],       sample: "link text"      },
  { label: "🖼",     title: "Image",           wrap: ["![", "](url)"],      sample: "alt text"       },
];

function applyFormat(textarea, action, currentValue, setFieldValue, fieldName) {
  const start = textarea.selectionStart;
  const end   = textarea.selectionEnd;
  const selected = currentValue.slice(start, end) || action.sample || "";

  let newValue, newStart, newEnd;

  if (action.insert) {
    // plain insert (e.g. horizontal rule)
    newValue = currentValue.slice(0, start) + action.insert + currentValue.slice(end);
    newStart = newEnd = start + action.insert.length;
  } else if (action.prefix) {
    // line prefix (headings, lists, blockquote)
    const lineStart = currentValue.lastIndexOf("\n", start - 1) + 1;
    const lineEnd   = currentValue.indexOf("\n", end);
    const lineEndActual = lineEnd === -1 ? currentValue.length : lineEnd;
    const line = currentValue.slice(lineStart, lineEndActual);
    const already = line.startsWith(action.prefix);
    const newLine = already ? line.slice(action.prefix.length) : action.prefix + line;
    newValue = currentValue.slice(0, lineStart) + newLine + currentValue.slice(lineEndActual);
    newStart = lineStart + (already ? 0 : action.prefix.length);
    newEnd   = newStart + (already ? line.slice(action.prefix.length).length : line.length);
  } else if (action.wrap) {
    const [open, close] = action.wrap;
    newValue  = currentValue.slice(0, start) + open + selected + close + currentValue.slice(end);
    newStart  = start + open.length;
    newEnd    = newStart + selected.length;
  }

  setFieldValue(fieldName, newValue);

  // Restore focus + selection after React re-render
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(newStart, newEnd);
  });
}

function MarkdownToolbar({ textareaRef, value, setFieldValue, fieldName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="md-toolbar">
      <div className="md-toolbar-buttons">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.title}
            type="button"
            title={action.title}
            className="md-btn"
            onMouseDown={(e) => {
              e.preventDefault(); // prevent textarea blur
              if (textareaRef.current) {
                applyFormat(textareaRef.current, action, value || "", setFieldValue, fieldName);
              }
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        title="Copy article body"
        className={`md-btn md-btn-copy ${copied ? "copied" : ""}`}
        onClick={handleCopy}
      >
        {copied ? "✓ Copied!" : "⎘ Copy"}
      </button>
    </div>
  );
}

// ── Editor Page ───────────────────────────────────────────────
function Editor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const bodyRef = useRef(null);

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
              <p style={{ textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-ui)", fontSize: "0.82rem" }}>
                Loading article…
              </p>
            ) : (
              <Formik
                onSubmit={onSubmit}
                initialValues={initialValues}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
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

                        {/* Body with Markdown Toolbar */}
                        <fieldset className="form-group">
                          <MarkdownToolbar
                            textareaRef={bodyRef}
                            value={values.body}
                            setFieldValue={setFieldValue}
                            fieldName="body"
                          />
                          <Field name="body">
                            {({ field }) => (
                              <textarea
                                {...field}
                                ref={bodyRef}
                                className="form-control md-body-textarea"
                                rows={14}
                                placeholder="Write your article (markdown supported)"
                                onPaste={(e) => {
                                  const html = e.clipboardData.getData("text/html");
                                  if (html) {
                                    e.preventDefault();
                                    const markdown = turndownService.turndown(html);
                                    
                                    const textarea = bodyRef.current;
                                    const start = textarea.selectionStart;
                                    const end = textarea.selectionEnd;
                                    const currentValue = field.value || "";
                                    const newValue = currentValue.slice(0, start) + markdown + currentValue.slice(end);
                                    
                                    setFieldValue("body", newValue);
                                    
                                    requestAnimationFrame(() => {
                                      textarea.focus();
                                      textarea.setSelectionRange(start + markdown.length, start + markdown.length);
                                    });
                                  }
                                }}
                              />
                            )}
                          </Field>
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
