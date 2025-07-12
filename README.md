# LocalEcho MVP

⚠️ **Project Status: On Hold**  
This project is paused for now while I explore other side hustle ideas. All code and data are safely stored and ready to resume at any time.


A starter Next.js project for AI-powered review response assistance.

# 📣 LocalEcho

AI-powered review response assistant for small businesses.

LocalEcho helps local business owners efficiently respond to customer reviews using customizable AI-generated replies. It simplifies reputation management while maintaining authenticity and brand tone.

---

## 🚀 Features

- 🧠 **AI-generated responses** to customer reviews
- ✏️ **Edit or approve replies** before sending
- 🎭 **Tone selector** (Professional, Friendly, Empathetic, etc.)
- 📊 **Insights dashboard** (tone distribution + sentiment analysis)
- 🧾 **Sentiment tagging** (Positive, Negative, Neutral)
- ✅ **Review deletion confirmation**
- ⚙️ **Toggle auto-response on/off**
- ⏰ **Better timestamp formatting**
- 🔒 **User authentication (email/password login)**
- 🚪 **Logout functionality**
- 🖼️ **Branding logo on all pages**
---

## 📦 Tech Stack

- **Frontend**: Next.js (React)
- **Database**: Supabase
- **AI**: OpenAI GPT-4 API
- **Deployment**: Local development only (for now)

---

## 📂 Project Structure (Simplified)

```
/pages        → App pages (home, dashboard, API routes)
/components   → UI components (Header, ReviewCard, etc.)
/lib          → Supabase + OpenAI helper functions
/styles       → Global CSS styles
```

---

## 🛠 Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone https://github.com/mmcdill/localecho-mvp.git
   cd localecho-mvp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase and OpenAI keys

4. **Run locally:**
   ```bash
   npm run dev
   ```

5. **Visit:** [http://localhost:3000](http://localhost:3000)

---

## 📈 Future Plans

- 🔐 OAuth login (Google, Yelp, Facebook)
- 📥 Import reviews from external platforms
- 📱 Mobile responsiveness polish
- 🧪 User testing & feedback loop
- 🌐 Public launch

---

## 👤 Author

**Matt McDill**  
Tech enthusiast and builder focused on tools that support small business and community growth.  
GitHub: [@mmcdill](https://github.com/mmcdill)

---

## 📄 License

This project is for educational and demonstration purposes only. License to be determined based on future commercialization plans.
