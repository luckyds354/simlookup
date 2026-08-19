# SIM Lookup — Free Hosting Guide (Render)

Is project ko Render pe free deploy karo — permanent public URL, PC band ho to bhi live.

## Step 1 — GitHub pe repo banao
1. [github.com](https://github.com) kholo → **New repository**
2. Name: `simlookup` (Private ya Public — jo chahein)
3. Create karo (empty repo, README mat banwano)

## Step 2 — Files push karo
Apne PC pe terminal me:
```bash
cd "/home/anythingispossible/MY TOOLS/simlookup-render"
git init
git add .
git commit -m "SIM lookup site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/simlookup.git
git push -u origin main
```
(YOUR_USERNAME ki jagah apna username likho — push pe GitHub login/password mangega,
ya Personal Access Token se bhi kaam ho jata hai)

## Step 3 — Render pe deploy
1. [render.com](https://render.com) → **Sign up** (GitHub se sign up karo, sabse easy)
2. Dashboard me → **New +** → **Blueprint** → apna `simlookup` repo chuno
3. Render khud `render.yaml` dekh ke deploy kar dega
4. 2-3 minute me URL milega: `https://simlookup.onrender.com`

## Bas!
- URL kisi ko bhi bhejo — duniya me kahin se bhi use karenge
- PC band ho to bhi chalega (free plan pe 15 min khaali rehne pe so jata hai,
  pehla open karne wala ~30 sec wait karta hai — phir fast)

## Agar deploy fail ho jaye
- Render dashboard → Logs dekho
- Sabse common problem: simsowner.net.pk Render ke server se block ho — phir
  Render pe region **Frankfurt** try karo (deploy ke time choose hota hai)