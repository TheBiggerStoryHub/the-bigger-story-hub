
exports.handler = async (event) => {
  try {
    const articleId = event.queryStringParameters?.id;

    if (!articleId) {
      return {
        statusCode: 400,
        body: 'Article ID is missing.'
      };
    }

    const query = `*[_type == "article" && _id == $id][0] {
      title,
      excerpt,
      "imageUrl": mainImage.asset->url
    }`;

    const params = new URLSearchParams();
    params.set('query', query);
    params.set('$id', JSON.stringify(articleId));

    const response = await fetch(
      `https://pj5fusph.api.sanity.io/v2025-11-07/data/query/production?${params}`
    );

    if (!response.ok) {
      throw new Error('Could not retrieve article.');
    }

    const data = await response.json();
    const article = data.result;

    if (!article) {
      return {
        statusCode: 404,
        body: 'Article not found.'
      };
    }

    const host = event.headers.host;
    const siteUrl = `https://${host}`;
    const articleUrl =
      `${siteUrl}/article.html?id=${encodeURIComponent(articleId)}`;

    const previewUrl =
      `${siteUrl}/.netlify/functions/article-preview?id=${encodeURIComponent(articleId)}`;

    const escapeHtml = (value = '') =>
      String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char]);

    const title = escapeHtml(article.title || 'The Bigger Story Hub');
    const description = escapeHtml(
      article.excerpt || article.title || 'Read the full story on The Bigger Story Hub.'
    );
    const image = escapeHtml(article.imageUrl || '');

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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      },
      body: html
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: 'Unable to generate article preview.'
    };
  }
};
