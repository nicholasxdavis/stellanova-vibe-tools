<h1 align="center">Stellanova Vibe Tools</h1>

<p align="center"><strong>Made for Vibe Coders.</strong></p>

<p align="center">
  <img src="https://nicholasxdavis.github.io/BN-db1/img/vibetools.png" alt="Stellanova Vibetools Dashboard">
</p>


## Overview

Stellanova Vibe Tools is a vibe-based browser extension designed to keep you in a flow state while developing. Standard devtools are powerful but clunky; this tool is about speed, clarity, and aesthetics.

I built this because I was tired of right-clicking Inspect Element twenty times just to find a font name or a hex code. I also wanted a better way to feed real context into AI models.

With Stellanova, you can:

- Grab fonts
- Pick colors
- Scrape full design documents
- Drag-and-drop prompts straight into AI chats

All from a single, clean dashboard.

## Usage

### The Tools

Open the extension to access the command center. You have three main categories:

**Visual Tools:**

- **FontGrab**: Toggle this and hover over any text to instantly see the font family, weight, and size. Click to save it.
- **ColorPick**: Hover over any element to grab its Hex code. Click to copy and save to your palette.
- **Screen Ruler**: Measure pixel distances and alignment on the fly.

**Analyzers:**

- **Stack Analyzer**: Instantly detect what framework (React, Vue, Tailwind, etc.) a site is using.
- **CSS & SEO Analyzers**: Get a quick health check on a site's meta tags and color palette without digging through source code.

**Scrapers:**

- **Skin Scraper**: The heavy hitter. It saves the current page as a `.mhtml` file and generates a Markdown Design Doc automatically. Perfect for archiving inspiration.
- **Asset Scraper**: One-click download for all images, scripts, and stylesheets on a page.

### AI Workflow (Prompts & Knowledge)

This is the "Vibe" part. The extension acts as a sidecar for your AI workflows (ChatGPT, Claude, etc.).

- **Prompts**: Save your frequent prompts (e.g., "Refactor this code," "Explain this bug"). You can drag and drop these tiles directly into text fields.
- **Knowledge Bubbles**: Store project context, API keys, or brand guidelines here. When you need to give an AI context about your project, just drag the Knowledge Bubble into the chat.
- **GitHub Integration**: You can even configure the extension to upload images directly to your GitHub repo to create hosted asset URLs for your Knowledge Bubbles.

## Features Breakdown

Stellanova comes packed with 9 core utilities:

- **Skin Scraper** - Generate UI Design Docs (.md) & capture MHTML
- **Asset Scraper** - Extract images and CSS
- **CSS Analyzer** - Scan page for global colors & fonts
- **SEO Analyzer** - Check meta tags & Open Graph data
- **Stack Analyzer** - Detect frameworks and libraries
- **Clear Cache** - Wipe cache for the current origin only (Dev testing)
- **FontGrab** - Hover-to-inspect typography
- **ColorPick** - Hover-to-inspect colors
- **Screen Ruler** - On-screen pixel measurement

## Building

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/nicholasxdavis/stellanova-vibe-tools.git
```

2. Load it into Chrome via **Load Unpacked**.

3. Make your changes to `popup.html`, `popup.js`, or the content scripts.

4. Click the refresh icon on the extension card in `chrome://extensions/` to see your changes.

<br><br>

