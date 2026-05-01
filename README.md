<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/bot.svg" width="80" height="80" alt="PolliBot Logo" />
  <h1>PolliBot</h1>
  <p>A premium, blazing-fast AI chatbot client powered by the Pollinations API.</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#byok-bring-your-own-key">BYOK</a> •
    <a href="#license">License</a>
  </p>
</div>

---

PolliBot is a beautifully designed, modern AI chat interface that rivals industry-leading platforms. Built with performance and elegance in mind, it leverages the open-source Pollinations API and features a secure BYOK (Bring Your Own Key) architecture, ensuring complete privacy where your credentials never leave your browser.

## Features

✨ **Premium UI/UX:** Crafted with customized shadcn/ui components and high-end typography for a modern, native-feeling application.  
⚡️ **Lightning Fast Streaming:** Utilizes Server-Sent Events (SSE) for word-by-word streaming responses, ensuring no waiting time.  
🎨 **Markdown & Code Highlighting:** Full support for complex markdown rendering and syntax highlighting for dozens of programming languages.  
📝 **Advanced Chat Controls:** Edit your sent messages, regenerate AI responses on the fly, and copy text with a single click.  
🗂️ **Sidebar History:** Organize your thoughts with a full history of conversations. Rename, delete, and switch between chats seamlessly.  
🔐 **Privacy First (BYOK):** Your Pollinations API key is stored locally in your browser leveraging the Web Storage API, set to expire safely after 30 days.  
🌗 **Dark & Light Modes:** Built-in theme switching system designed to sync with your OS preferences or explicitly selected modes.  
📱 **Fully Responsive:** Perfect styling and usability across mobile devices, tablets, and desktop computers.

## Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **State Management:** Zustand (with local storage persistence)
- **Styling:** Tailwind CSS v4 + PostCSS
- **Components:** shadcn/ui + Radix UI Primitives
- **Icons:** Lucide React
- **Markdown Processing:** react-markdown + remark-gfm + react-syntax-highlighter
- **AI Integration:** OpenAI Node SDK (configured to target `text.pollinations.ai`)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/pollibot.git
   cd pollibot
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173/` (or whichever port Vite defaults to).

4. **Build for production:**

   ```bash
   npm run build
   ```

## BYOK (Bring Your Own Key)

PolliBot utilizes the Pollinations AI inference layer. To use the chatbot, you will be prompted with a sleek onboarding modal upon first visit. 

- Enter your API Key.
- The key is securely placed in your browser's local storage via Zustand's persist middleware.
- The key remains valid for 30 days and is never transmitted to any external server other than the direct connection to Pollinations AI.

You can always update or clear your key from the **Settings** menu accessible via the sidebar.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <i>Designed and engineered with passion.</i>
</div>
