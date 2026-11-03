# The Bigger Story Hub — Website Starter

A responsive, single-page landing website built with HTML, CSS and vanilla JavaScript.

## Run locally
1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. No build tools or dependencies are required.

## Included
- Premium dark, futuristic visual identity with gold and cyan accents
- Responsive navigation and mobile menu
- Brand vision, mission and promise
- Stories, entrepreneurship, learning, innovation and community sections
- Programme highlights, including Visit to School Initiative
- Interactive AI assistant demo with sample responses
- Newsletter sign-up front-end interaction

## Important: activate real AI
The AI assistant currently uses sample browser-side responses. To enable real AI:
1. Create a backend endpoint (for example, `/api/assistant`).
2. Store your AI provider API key as a server-side environment variable.
3. Have the backend accept a user prompt and call your chosen AI model.
4. Update the `chatForm` submit handler in `index.html` to POST the prompt to your endpoint and render the returned answer.
5. Add rate limits, input validation, abuse protection and a privacy notice.

Never place a private AI API key in browser JavaScript.

## Activate newsletter collection
The current form is a front-end demo and does not transmit or save email addresses. Connect it to a secure backend or an email marketing provider, add consent language and a privacy policy, then replace the demo submit handler.

## Before launch
- Replace the sample email address `hello@thebiggerstoryhub.com` with your confirmed business email.
- Add official social media links and a real contact address.
- Add a privacy policy, terms of use and cookie notice if applicable.
- Add real stories, team profiles, programme dates and authentic photography.
- Connect domain hosting, analytics and SEO/social sharing metadata.
