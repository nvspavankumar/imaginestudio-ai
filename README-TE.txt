IMAGINESTUDIO AI — WINDOWS 10 SETUP
===================================

This starter project contains a responsive image/video generator UI and Netlify serverless functions. No login/signup.

FILES
- index.html: website interface
- netlify.toml: Netlify configuration
- netlify/functions/generate-image.mjs: Hugging Face image API proxy
- netlify/functions/generate-video.mjs: Replicate video API proxy

DEPLOY
1. Extract this ZIP.
2. Create a GitHub repository and upload all files/folders, preserving netlify/functions.
3. In Netlify, import the GitHub repository as a new site.
4. netlify.toml sets publish directory and functions folder.
5. Add environment variables in Netlify site settings:
   HF_TOKEN = your Hugging Face access token
   HF_IMAGE_MODEL = black-forest-labs/FLUX.1-schnell (may need a model/provider available to your account)
   REPLICATE_API_TOKEN = your Replicate API token
   REPLICATE_VIDEO_VERSION = exact model version hash whose input schema accepts {prompt: "..."}
6. Redeploy after setting variables. Test image first, then video.

IMPORTANT
- Netlify Drop of a single HTML file will not deploy these serverless functions; deploy the whole project from Git.
- Never place API tokens in index.html or commit them to GitHub.
- The image endpoint and model availability can change; check Hugging Face's current inference/provider documentation.
- Replicate video generation typically requires paid credits. Free hosting does not mean free/unlimited inference.
- Video models have different input/output schemas; this starter expects an input named prompt and a finished output URL. Adapt the function if your chosen model differs.
- A public site with no login can be used by anyone and can incur API costs. Add rate limiting/bot protection and provider spending limits before widely sharing it.
- Local double-click preview only shows the UI; backend generation works after deployment.
