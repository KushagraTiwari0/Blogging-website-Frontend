import { useEffect } from "react";

const SITE_NAME = "Blogging";
const DEFAULT_DESCRIPTION = "A place to share your knowledge. Read and write articles on topics that matter to you.";
const DEFAULT_IMAGE = "/Logo.jpg";

/**
 * SEO component — dynamically updates <head> meta tags.
 *
 * @param {Object}  props
 * @param {string}  props.title       - Page title (site name is appended automatically)
 * @param {string}  [props.description] - Meta description (≤160 chars recommended)
 * @param {string}  [props.url]       - Canonical URL for this page
 * @param {string}  [props.image]     - OG / Twitter image URL
 * @param {string}  [props.type]      - OG type ("website" | "article" | "profile")
 * @param {boolean} [props.noindex]   - If true, tells crawlers not to index this page
 * @param {string}  [props.jsonLd]    - Stringified JSON-LD structured data
 * @param {string}  [props.author]    - Article author name
 * @param {string}  [props.publishedTime] - ISO date string for article:published_time
 * @param {string}  [props.modifiedTime]  - ISO date string for article:modified_time
 * @param {string[]} [props.tags]     - Article tags
 */
function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  url,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
  author,
  publishedTime,
  modifiedTime,
  tags = [],
}) {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    // ── Helper: set or create a <meta> tag ─────────────────────
    const managedTags = [];

    function setMeta(attr, key, content) {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      managedTags.push(el);
    }

    function setLink(rel, href) {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
      managedTags.push(el);
    }

    // ── Standard meta ─────────────────────────────────────────
    setMeta("name", "description", description);

    // ── Robots ────────────────────────────────────────────────
    if (noindex) {
      setMeta("name", "robots", "noindex, nofollow");
    } else {
      // Remove any leftover noindex from a previous page
      const robotsEl = document.querySelector('meta[name="robots"]');
      if (robotsEl) robotsEl.remove();
    }

    // ── Canonical ─────────────────────────────────────────────
    if (url) setLink("canonical", url);

    // ── Open Graph ────────────────────────────────────────────
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    if (url) setMeta("property", "og:url", url);
    if (image) setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", SITE_NAME);

    // Article-specific OG tags
    if (type === "article") {
      if (publishedTime) setMeta("property", "article:published_time", publishedTime);
      if (modifiedTime) setMeta("property", "article:modified_time", modifiedTime);
      if (author) setMeta("property", "article:author", author);
      tags.forEach((tag) => {
        const el = document.createElement("meta");
        el.setAttribute("property", "article:tag");
        el.setAttribute("content", tag);
        document.head.appendChild(el);
        managedTags.push(el);
      });
    }

    // ── Twitter Card ──────────────────────────────────────────
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    if (image) setMeta("name", "twitter:image", image);

    // ── JSON-LD Structured Data ───────────────────────────────
    let scriptEl = null;
    if (jsonLd) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.textContent = jsonLd;
      document.head.appendChild(scriptEl);
    }

    // ── Cleanup on unmount / re-render ────────────────────────
    return () => {
      if (scriptEl) scriptEl.remove();
      // Reset title
      document.title = SITE_NAME;
      // Remove article:tag meta elements we created
      managedTags.forEach((el) => {
        if (el.getAttribute("property") === "article:tag") {
          el.remove();
        }
      });
    };
  }, [title, description, url, image, type, noindex, jsonLd, author, publishedTime, modifiedTime, tags]);

  return null; // This component renders nothing visible
}

export default SEO;
