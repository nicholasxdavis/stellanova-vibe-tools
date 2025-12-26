# Stellanova Vibe Tools 

Your browser's ultimate design and development sidekick. Scrape assets, analyze stacks, and manage AI prompts effortlessly.

## Overview

Stellanova Vibe Tools is a vibe-based browser extension designed to keep you in a flow state while developing. Standard devtools are powerful but clunky; this tool is about speed, clarity, and aesthetics.

I built this because I was tired of right-clicking Inspect Element twenty times just to find a font name or a hex code. I also wanted a better way to feed real context into AI models.

With Stellanova, you can:

- Grab fonts
- Pick colors
- Scrape full design documents
- Drag-and-drop prompts straight into AI chats

All from a single, clean dashboard.

## Installation

### Manual Installation

Since this is a custom developer tool, you'll install it locally.

1. Clone the repository:

```bash
git clone https://github.com/nicholasxdavis/stellanova-vibe-tools.git
cd stellanova-vibe-tools
```

2. Open Chrome or Edge and navigate to `chrome://extensions/` (or `edge://extensions/`).

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **Load unpacked** and select the folder where you saved the files.

5. Pin the extension to your toolbar for easy access.

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

### Creating a Distribution Package

To share with your team:

1. Zip the entire directory (excluding `.git`).

2. Share the `.zip` file. They can install it by dragging it into their extensions page (if developer mode is on).

## Development

### Code Structure

**The Dashboard** (`popup.html` / `popup.js`)

The main interface. It handles the UI logic, the tab switching, and the storage management for your saved colors, fonts, and prompts. It uses jQuery and Lodash for smooth DOM manipulation.

**The Workers** (`background.js`)

Handles the heavy lifting like MHTML page capturing and communicating with the browser's storage API.

**Content Scripts**

Scripts like `analyzer_content.js`, `whatfont_content.js`, and `scraper_content.js` are injected into the page when you trigger a tool. They read the DOM and send data back to the popup.

### GitHub Integration

The settings tab allows you to input a Personal Access Token. The extension uses this to upload assets to your repo via the GitHub API, making it easy to host images for your Knowledge Bubbles.

## Support

<a href="https://buymeacoffee.com/galore"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="galore" /></a>

<br><br>

## License

MIT License

Copyright (c) 2025 Blacnova Development

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

