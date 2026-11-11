export default async (request: Request, context: any) => {
  const response = await context.next();

  const url = new URL(request.url);
  const articleId = url.searchParams.get("id");

  if (!articleId) return response;

  const projectId = "pj5fusph";
  const dataset = "production";

  const query = `*[_type == "article" && _id == $id][0] {
    title,
    category,
    "imageUrl": mainImage.asset->url,
    "description": array::join(body[_type == "block"].children[].text, " ")
  }`;

  const params = new URLSearchParams();
  params.set("query", query);
  params.set("$id", JSON.stringify(articleId));

  try {
    const sanityUrl =
      `https://${projectId}.api.sanity.io/v2025-11-07/data/query/${dataset}?${params}`;

    const sanityResponse = await fetch(sanityUrl);
    if (!sanityResponse.ok) return response;

    const data = await sanityResponse.json();
    const article = data.result;

    if (!article) return response;

    const escapeHTML = (value: string) =>
      String(value || "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]!);

    const title = escapeHTML(article.title || "The Bigger Story Hub");
    const description = escapeHTML(
      (article.description || article.category || "Independent news. Wider perspective.")
        .slice(0, 250)
    );
    const image = article.imageUrl
      ? escapeHTML(article.imageUrl)
      : "";

    const metadata = `
      <meta property="og:type" content="article">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:url" content="${escapeHTML(url.href)}">
      ${image ? `<meta property="og:image" content="${image}">
      <meta property="og:image:secure_url" content="${image}">` : ""}
      <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      ${image ? `<meta name="twitter:image" content="${image}">` : ""}
    `;

    const html = await response.text();

    const updatedHTML = html
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title} | The Bigger Story Hub</title>`)
      .replace("</head>", `${metadata}\n</head>`);

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");
    headers.set("content-type", "text/html; charset=UTF-8");

    return new Response(updatedHTML, {
      status: response.status,
      headers
    });

  } catch (error) {
    console.error("Article preview error:", error);
    return response;
  }
};