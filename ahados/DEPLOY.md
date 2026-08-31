# AhadOs — কোথায় হোস্ট করবে? (Deploy guide) 🚀

AhadOs একটা **static website** (HTML/CSS/JS) — মানে যেকোনো free static hosting-এ দিবার সাথে সাথেই চলে। সবগুলো free option নিচে। যেকোনো option-এর জন্য ready **ZIP ফাইল**: `ahados-site.zip` (সাথে আছে)।

---

## ১) GitHub Pages (সবচেয়ে ভালো — শুধু GitHub account লাগে) ✅

**Option A — আলাদা repo বানিয়ে (সবচেয়ে সহজ):**
1. GitHub-এ নতুন repo বানাও: **New repository** → নাম `ahados` → **Public** → Create
2. **uploading an existing file** link-এ ক্লিক করে `ahados-site.zip` টেনে drop করো (zip সরাসরি upload করা যায়)
3. **Settings → Pages** → **Source: Deploy from a branch** → `main` / `(root)` → **Save**
4. ১ মিনিটে লাইভ: **`https://<তোমার-username>.github.io/ahados/`** 🎉

**Option B — একই repo-তে (prmoty):**
1. GitHub-এ `.github/workflows/ahados-pages.yml` ফাইল বানাও (নিচের YAML copy-paste):
   ```yaml
   name: Deploy AhadOs to GitHub Pages
   on:
     push:
       branches: [main]
     workflow_dispatch:
   permissions:
     contents: read
     pages: write
     id-token: write
   concurrency:
     group: pages
     cancel-in-progress: true
   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/configure-pages@v5
         - uses: actions/upload-pages-artifact@v3
           with:
             path: ahados
         - id: deployment
           uses: actions/deploy-pages@v4
   ```
2. **Settings → Pages** → **Source: GitHub Actions** → **Save**
3. Branch-এ push করলেই auto-deploy হবে: `https://tajhatAti.github.io/prmoty/`

---

## ২) Vercel (সহজতম — drag & drop) ⚡

1. [vercel.com](https://vercel.com) → GitHub দিয়ে login
2. **Add New → Project** → `prmoty` repo import → **Root Directory: `ahados`** → **Deploy**
3. লাইভ URL: `https://prmoty-xxx.vercel.app`

অথবা no-code: [vercel.com/new](https://vercel.com/new) → drag করে `ahados` folder ছেড়ে দাও!

---

## ৩) Netlify 🥅

1. [netlify.com](https://netlify.com) → GitHub login
2. **Add new site → Import an existing project** → `prmoty`
3. **Publish directory: `ahados`** → **Deploy**
4. URL: `https://xxxx.netlify.app`

---

## ৪) Hugging Face Spaces 🤗

1. [huggingface.co/spaces](https://huggingface.co/spaces) → **Create new Space**
2. SDK: **Static HTML** → Name: `ahados`
3. **Files → Add file → Upload** — `ahados-site.zip` upload করো
4. লাইভ: `https://<username>-ahados.hf.space`

---

## ৫) Render 🖥️

1. [render.com](https://render.com) → GitHub connect
2. **New → Static Site** → `prmoty` repo → **Root Directory: `ahados`** → **Deploy**
3. Free tier-এ ১৫ মিনিট inactivity-তে ঘুমিয়ে যায়, আবার request-এ wake হয়।

---

## ✅ কোনটা বেছে নেবে?

| Platform | Setup | Speed | স্থায়ী |
|---|---|---|---|
| **GitHub Pages** | ১-২ মিনিট | ⚡⚡⚡ | সবসময় |
| **Vercel** | ১ মিনিট | ⚡⚡⚡ | সবসময় |
| **Netlify** | ১ মিনিট | ⚡⚡ | সবসময় |
| **Hugging Face** | ২ মিনিট | ⚡⚡ | সবসময় |
| **Render** | ১ মিনিট | ⚡ (sleep করে) | সবসময় |

**সাজেশন:** GitHub Pages বা Vercel — দুইটাই free আর দ্রুত। ফোনে install করার জন্য (PWA) HTTPS যেকোনোটা দিয়েই হবে। 📲
