# SIM Lookup — Free Hosting Guide (Cloudflare Pages — NO credit card!)

Ye site GitHub repo se Cloudflare Pages pe deploy hoti hai — bilkul free, credit card NAHI chahiye.

## Files structure
- `index.html` → site (root pe)
- `functions/api/lookup.js` → API proxy (server-side, CORS ka masla nahi)

## Deploy steps

### Step 1 — index.html root pe rahe (pehle se hai)
### Step 2 — Cloudflare account
1. [dash.cloudflare.com](https://dash.cloudflare.com) kholo → **Sign up** (email se, free)
2. Login karo

### Step 3 — Pages deploy
1. Dashboard me left side **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. **GitHub** connect karo (allow karo)
3. `simlookup` repo chuno
4. Build settings me kuch badalne ki zaroorat NAHI — sab default
   (Build command khali, Output directory khali)
5. **Save and Deploy** dabao

### Step 4 — URL milega!
1-2 minute me: `https://simlookup.pages.dev`
- Ye URL kisi ko bhi bhejo — duniya me kahin se use karenge
- Har baar GitHub pe change push karo to site khud update hoti hai

## Agar deploy fail ho jaye
- Cloudflare dashboard → Pages → simlookup → **Deployments** → Logs dekho
- Sabse common: `functions` folder wrong jagah — root pe hona chahiye (ye repo me already hai)