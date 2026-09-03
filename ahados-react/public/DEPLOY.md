# AhadOs — কোথায় হোস্ট করবে? (Deploy guide) 🚀

AhadOs v2 এখন **React app** — `npm run build` করলে `ahados/` ফোল্ডারে готовый static site তৈরি হয়, যেটা যেকোনো static hosting-এ চলে। GitHub Pages-এ auto-deploy ইতিমধ্যে সেট করা আছে।

---

## ✅ Current setup (কাজ করছে)

- Workflow: `.github/workflows/ahados-pages.yml` (branch: `arena/01a0576c-prmoty` + `main`, paths: `ahados/**`)
- Pages Source: **GitHub Actions**
- Environment: `github-pages` → Deployment branches: **All branches**
- Live: **https://tajhatati.github.io/prmoty/**

> কেউ agent/bot দিয়ে কাজ করলে: workflow commit ও Pages/Environment setting-গুলো **user manually** করতে হয় (GitHub App token-এ `workflows` permission থাকে না)।

## 🛠️ Error → সমাধান table

| Error | কারণ | সমাধান |
|---|---|---|
| `Get Pages site failed... configured to build using GitHub Actions` | Pages Source = "Deploy from a branch" | Settings → Pages → Source → **GitHub Actions** |
| `Branch "X" is not allowed to deploy to github-pages due to environment protection rules` | github-pages environment branch policy | Settings → Environments → github-pages → Deployment branches → **All branches** |
| Deploy succeeded কিন্তু পুরনো version দেখায় | Service worker cache | SW-তে cache name বদলাও (`CACHE` const) — v2-তে `ahados2-v1` |

## 🔄 Rebuild & redeploy

```bash
cd ahados-react
npm install
npm run build     # → ../ahados (Vite emptyOutDir করে, নতুন build বসে)
git add ahados/ && git commit -m "AhadOs v2.x"
git push          # → GitHub Actions auto-deploy
```

## 🧪 Local test

```bash
cd ahados-react && npm run dev        # Vite dev (hot reload)
cd ahados && python3 -m http.server 8080   # built site test
```

## 📦 অন্যান্য hosting (optional)

React build টা `ahados/` folder — Vercel/Netlify/Render/HuggingFace-এ এই folder upload/import করলেই চলে। বিস্তারিত আগের গাইডে ছিল; এখন GitHub Pages-ই main।
