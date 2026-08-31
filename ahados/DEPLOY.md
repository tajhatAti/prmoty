# AhadOs — কোথায় হোস্ট করবে? (Deploy guide) 🚀

AhadOs একটা **static website** (HTML/CSS/JS) — মানে যেকোনো free static hosting-এ দিবার সাথে সাথেই চলে। সবগুলো free option নিচে। যেকোনো option-এর জন্য ready **ZIP ফাইল**: `ahados-site.zip` (সাথে আছে)।

---

## ১) GitHub Pages (সবচেয়ে ভালো — শুধু GitHub account লাগে) ✅

**Step-by-step (আমার মতো agent-এর জন্য — যেখানে workflow push permission নেই):**

> কাজটি ২ ভাগ: **(A)** workflow ফাইল commit (তুমি করবে) → **(B)** Pages setting (তুমি করবে)। তারপর থেকে যেকোনো change auto-deploy! 🎉

**Part A — workflow ফাইল commit করো:**
1. [github.com/tajhatAti/prmoty](https://github.com/tajhatAti/prmoty) খোলো
2. Branch dropdown-এ **`arena/01a0576c-prmoty`** select করো (গুরুত্বপূর্ণ! এই branch-এ push হয় বলে workflow-ও এই branch-এ থাকা লাগবে)
3. **Add file → Create new file**
4. File name-এ লিখো: **`.github/workflows/ahados-pages.yml`**
5. Content: repo-র রুটে রাখা **`ahados-pages-workflow.yml`** ফাইলটা খুলে পুরোটা copy করে paste করো (নিচেও দেওয়া আছে)
6. **Commit directly to the `arena/01a0576c-prmoty` branch** → Commit

**Part B — Pages চালু করো (⚠️ Source অবশ্যই "GitHub Actions" হতে হবে):**
1. Repo → **Settings** → বাঁ পাশে **Pages**
2. **Build and deployment** → **Source** ড্রপডাউনে ডিফল্ট থাকে **"Deploy from a branch"** — এটা বদলে **`GitHub Actions`** select করো
3. **Save** চাপো

**Part C — environment protection rule (⚠️ এটা না করলে এই error আসে):**
```
Branch "arena/01a0576c-prmoty" is not allowed to deploy to github-pages 
due to environment protection rules.
```
1. Repo → **Settings** → বাঁ পাশে **Environments** → **github-pages**
2. **Deployment branches** section-এ → ড্রপডাউনে **"All branches"** select করো → **Save protection rules**
   (অথবা "Selected branches" রেখে দিলে নিচে `arena/01a0576c-prmoty` add করো)
3. **Actions** tab → fail করা run → **Re-run all jobs** → সবুজ ✔ → লাইভ: **`https://tajhatati.github.io/prmoty/`** 🎉

> 💡 Error দেখলে এভাবে বুঝবে কোনটা ঠিক করবে:
> - `Get Pages site failed... configured to build using GitHub Actions` → **Part B** (Source = GitHub Actions)
> - `Branch "arena/..." is not allowed to deploy to github-pages due to environment protection rules` → **Part C** (Environments → github-pages → All branches)

**Workflow content (`ahados-pages-workflow.yml` — এটা exact copy):**

```yaml
name: Deploy AhadOs to GitHub Pages

on:
  push:
    branches:
      - 'arena/01a0576c-prmoty'
      - 'main'
    paths:
      - 'ahados/**'
      - '.github/workflows/ahados-pages.yml'
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
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload AhadOs site
        uses: actions/upload-pages-artifact@v3
        with:
          path: ahados
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**🤖 Auto-update কিভাবে কাজ করে:**
- এই workflow-এ `branches: arena/01a0576c-prmoty` + `paths: ahados/**` দেওয়া আছে
- আমি যখনই AhadOs-এর কোনো ফাইল বদলাই ও push করি → GitHub Actions নিজে নিজে চালু হয়ে সাইট redeploy করে
- তোমাকে আর কিছু করতে হবে না — শুধু প্রথমবার Part A + Part B

**Alternative (আলাদা repo):** নতুন repo `ahados` বানিয়ে `ahados-site.zip` upload → Settings → Pages → Deploy from a branch → main/(root)।

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
