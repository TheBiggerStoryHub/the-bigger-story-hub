
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/article-preview") {
      try {
        const articleId = url.searchParams.get("id");

        if (!articleId) {
          return new Response("Article ID is missing.", {
            status: 400
          });
        }

        const query = `*[_type == "article" && _id == $id][0] {
          title,
          excerpt,
          "imageUrl": mainImage.asset->url
        }`;

        const params = new URLSearchParams();
        params.set("query", query);
        params.set("$id", JSON.stringify(articleId));

        const response = await fetch(
          `https://pj5fusph.api.sanity.io/v2025-11-07/data/query/production?${params}`
        );

        if (!response.ok) {
          throw new Error("Sanity request failed.");
        }

        const data = await response.json();
        const article = data.result;

        if (!article) {
          return new Response("Article not found.", {
            status: 404
          });
        }

        const articleUrl =
          `${url.origin}/article.html?id=${encodeURIComponent(articleId)}`;

        const escapeHtml = (value = "") =>
          String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
          })[char]);

    const shorten = (value, maxLength) => {
  const text = String(value || "").trim();

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - 1).trimEnd() + "…";
};

const title = escapeHtml(
  shorten(article.title || "The Bigger Story Hub", 60)
);

const description = escapeHtml(
  shorten(article.excerpt || article.title || "Read the full story.", 125)
);

        const image = escapeHtml(article.imageUrl || "");

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | The Bigger Story Hub</title>
<meta name="description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${articleUrl}">
<meta property="og:image" content="${image}">
<meta property="og:site_name" content="The Bigger Story Hub">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
<link rel="canonical" href="${articleUrl}">
<meta http-equiv="refresh" content="0;url=${articleUrl}">
<script>window.location.replace(${JSON.stringify(articleUrl)});</script>
</head>
<body>
<p>Opening article: <a href="${articleUrl}">${title}</a></p>
</body>
</html>`;

        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=300"
          }
        });

      } catch (error) {
        return new Response("Unable to generate article preview.", {
          status: 500
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
