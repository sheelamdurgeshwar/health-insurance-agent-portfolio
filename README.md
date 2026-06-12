# Modern Health Insurance Agent Portfolio & Lead Capture Portal
A high-conversion, premium, and fully responsive single-page portfolio website designed specifically for a professional Health Insurance Agent. It features a polished visual aesthetic, light/dark theme modes, smooth micro-interactions, an interactive **Smart Policy Finder** questionnaire, and direct **Gmail lead routing** integration.
---
## 🌟 Key Features
1. **Benefit-Driven Hero Section**: Establishes immediate trust with industry credentials, quick stats, and prominent call-to-actions (CTAs).
2. **Interactive "Smart Policy Finder"**: A 4-step wizard that dynamically processes user needs (family size, age, budget, network priorities) to recommend a tailored plan class, pre-selecting the lead selection.
3. **Services Cards Grid**: Showcases core policy classes (Family, Individual ACA, Medicare/Senior, Critical Illness Gap Plans) with quick-scroll trigger quotes.
4. **Agent Profile (About Marcus)**: Displays credentials, mission statement, national producer license number (NPN), and trust-enhancing testimonials.
5. **Secure Localized Lead Form**: Dynamic inputs with validation, data protection locks, and HIPAA-compliant privacy warnings.
6. **Direct Email Lead Forwarding**: Connected to **Web3Forms API** to dispatch incoming leads directly to your Gmail account.
7. **Premium Visual Styling**: Modern typography (Outfit + Inter), custom glassmorphism, responsive navigation drawer, and scroll-triggered animations.
---
## 🛠️ Tech Stack & Assets
*   **Structure**: Semantic HTML5 (with complete SEO meta tag hierarchy).
*   **Styling**: Custom CSS3 variables (Light/Dark themes, glassmorphism overlays, responsive flexbox/grid layouts).
*   **Icons**: [Lucide Icons](https://lucide.dev/) (loaded dynamically via CDN).
*   **Fonts**: Outfit & Inter (loaded via Google Fonts).
*   **Animations**: Native CSS transitions + Intersection Observer API for scroll transitions.
*   **Routing**: Zero-backend serverless email forwarding via [Web3Forms](https://web3forms.com).
---
## 📩 Setting Up Gmail Lead Notifications
The contact form is pre-wired with **Web3Forms** to send lead inquiries directly to your Gmail inbox without requiring a complex backend database or server.
### 1. Get Your Free Access Key
1. Visit [Web3Forms](https://web3forms.com).
2. Enter the Gmail address where you want to receive lead submissions.
3. Check your inbox to retrieve your unique **Access Key** string (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
### 2. Connect the Form
You can connect your key in two ways:
#### Option A: Via the Live Site Settings (Easy & Offline Friendly)
1. Open the project in your browser.
2. Click the floating **"Setup Email Alerts"** gear button located in the bottom-left corner.
3. Paste your key and click **"Connect Inbox"**. 
*Note: This saves the key in your local browser storage for testing.*
#### Option B: hardcode into Source Code (For Production Upload)
1. Open [index.html](file:///d:/project/insurance%20agent%20portfolio/index.html) and locate line 402:
   ```html
   <input type="hidden" name="access_key" id="web3FormsAccessKey" value="YOUR_ACCESS_KEY_HERE">
   ```
2. Replace `YOUR_ACCESS_KEY_HERE` with your actual access key.
3. Save the file.
---
## 🚀 How to Run Locally
Since this is a lightweight frontend application, no Node module installation is required to view it.
1. Clone or download this repository.
2. Open `index.html` directly in any web browser.
3. (Optional) Run a simple local server inside the folder using VS Code Live Server, or Python:
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`.
---
## 📁 Project Directory Structure
```
├── index.html                  # Main layout structure & form elements
├── README.md                   # Setup instructions (this file)
├── css/
│   └── styles.css              # Dark/Light theme design system & layout styles
├── js/
│   └── app.js                  # Theme logic, wizard engine, and form POST handler
└── images/
    ├── agent_portrait.png      # Agent profile headshot
    └── agent_office.png        # Agent office environment image
```
---
## 🛡️ License & Compliance
This template includes compliance disclosures, licensing tables, and privacy warnings conforming to standard Health Insurance brokerage standards (e.g. National Producer Numbers and carrier representation indicators). Make sure to customize these details in `index.html` footer to match your local state credentials.
