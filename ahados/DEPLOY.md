# AhadOs — কোথায় হোস্ট করবে? (Deploy guide) 🚀

AhadOs একটা **static website** (HTML/CSS/JS) — মানে যেকোনো free static hosting-এ দিবার সাথে সাথেই চলে। সবগুলো free option নিচে:

---

## ১) GitHub Pages (সবচেয়ে ভালো — তোমার repo-তেই) ✅

Workflow আগে থেকেই repo-তে দেওয়া আছে: `.github/workflows/ahados-pages.yml`

**Steps (১ বার):**
1. GitHub-এ repo খুলো → **Settings** → বাঁ পাশে **Pages**
2. **Source** → **GitHub Actions** select করে **Save** চাপো
3. ঐ মুহূর্তে workflow auto-run হবে — ১-২ মিনিটে **https://tajhatAti.github.io/prmoty/** এ লাইভ! 🎉

> Note: আমার bot token দিয়ে Pages enable করা যায় না, তাই এই একটা ক্লিকটা তোমাকে করতে হবে।

---

## ২) Vercel (সহজতম — drag & drop) ⚡

1. [vercel.com](https://vercel.com) → GitHub দিয়ে login
2. **Add New → Project** → `prmoty` repo import
3. **Root Directory** → `ahados` select → **Deploy**
4. লাইভ URL পাবে: `https://prmoty-xxx.vercel.app`

অথবা no-code: [vercel.com/new](https://vercel.com/new) → drag করে `ahados` folder ছেড়ে দাও!

---

## ৩) Netlify 🥅

1. [netlify.com](https://netlify.com) → GitHub login
2. **Add new site → Import an existing project** → `prmoty`
3. **Publish directory** → `ahados` → **Deploy**
4. URL: `https://xxxx.netlify.app`

---

## ৪) Hugging Face Spaces 🤗

1. [huggingface.co/spaces](https://huggingface.co/spaces) → **Create new Space**
2. SDK: **Static HTML** → Name: `ahados`
3. **Files → Add file → Upload** — `ahados` folder-এর সব ফাইল upload করো
4. লাইভ: `https://<username>-ahados.hf.space`

---

## ৫) Render 🖥️

1. [render.com](https://render.com) → GitHub connect
2. **New → Static Site** → `prmoty` repo
3. **Root Directory** → `ahados` → **Deploy**
4. Free tier-এ স্লিপ হয় (১৫ মিনিট inactivity-তে), প্রথম request-এ আবার wake হয়।

---

## ✅ কোনটা বেছে নেবে?

| Platform | Setup | Speed | স্থায়ী |
|---|---|---|---|
| **GitHub Pages** | ১ ক্লিক (আগে থেকে ready) | ⚡⚡⚡ | সবসময় |
| **Vercel** | ১ মিনিট | ⚡⚡⚡ | সবসময় |
| **Netlify** | ১ মিনিট | ⚡⚡ | সবসময় |
| **Hugging Face** | ২ মিনিট | ⚡⚡ | সবসময় |
| **Render** | ১ মিনিট | ⚡ (sleep করে) | সবসময় |

**সাজেশন:** GitHub Pages বা Vercel — দুইটাই free আর দ্রুত। ফোনে install করার জন্য (PWA) HTTPS যেকোনোটা দিয়েই হবে। 📲
