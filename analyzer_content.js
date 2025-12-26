/**
 * BN Vibe Tools - Enhanced Analyzer Content Script (v1.8)
 * Significantly improved detection and analysis capabilities
 */

(function() {
    'use strict';
    
    if (typeof chrome === 'undefined' || !chrome.runtime) {
        console.error('Chrome runtime not available');
        return;
    }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Acknowledge message receipt immediately (synchronous response)
    sendResponse({ received: true });
    
    // Run analysis asynchronously and send results via one-way messages
    // Use requestIdleCallback or setTimeout to avoid blocking
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            runAnalysis(message);
        }, { timeout: 1000 });
    } else {
        setTimeout(() => {
            runAnalysis(message);
        }, 0);
    }
    
    // Return false since we've already called sendResponse synchronously
    return false;
});

function runAnalysis(message) {
    try {
    if (message.type === 'ANALYZE_ALL') {
        const results = {
            css_results: analyzeCSS(),
            seo_results: analyzeSEO(),
            stack_results: analyzeStack()
        };
            chrome.runtime.sendMessage({ type: 'ALL_RESULTS', ...results }).catch(() => {
                // Ignore errors - popup might be closed
            });
        } else if (message.type === 'ANALYZE_CSS') {
            const cssResults = analyzeCSS();
            chrome.runtime.sendMessage({ type: 'CSS_RESULTS', css_results: cssResults }).catch(() => {
                // Ignore errors - popup might be closed
            });
        } else if (message.type === 'ANALYZE_SEO') {
            const seoResults = analyzeSEO();
            chrome.runtime.sendMessage({ type: 'SEO_RESULTS', seo_results: seoResults }).catch(() => {
                // Ignore errors - popup might be closed
            });
        } else if (message.type === 'ANALYZE_STACK') {
            const stackResults = analyzeStack();
            chrome.runtime.sendMessage({ type: 'STACK_RESULTS', stack_results: stackResults }).catch(() => {
                // Ignore errors - popup might be closed
            });
        }
    } catch (error) {
        console.error('Error in analyzer:', error);
    }
}

/**
     * Enhanced CSS Analyzer - Detects colors in multiple formats and fonts from all sources
 */
function analyzeCSS() {
    const allElements = document.querySelectorAll('*');
    const colorSet = new Set();
    const fontSet = new Set();
    const genericFonts = [
        'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 
        'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded',
        'emoji', 'math', 'fangsong', 'apple color emoji', 'segoe ui emoji', 
            'segoe ui symbol', 'noto color emoji', 'android emoji', 'initial', 'inherit'
        ];

        // Helper to convert any color format to RGB
        function colorToRgb(color) {
            if (!color || color === 'transparent' || color === 'none' || color === 'initial' || color === 'inherit') {
                return null;
            }
            
            // Already RGB/RGBA
            if (color.startsWith('rgb')) {
                return color;
            }
            
            // HEX colors
            if (color.startsWith('#')) {
                const hex = color.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `rgb(${r}, ${g}, ${b})`;
            }
            
            // HSL colors
            if (color.startsWith('hsl')) {
                const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
                if (match) {
                    const h = parseInt(match[1]) / 360;
                    const s = parseInt(match[2]) / 100;
                    const l = parseInt(match[3]) / 100;
                    const a = match[4] ? parseFloat(match[4]) : 1;
                    
                    const c = (1 - Math.abs(2 * l - 1)) * s;
                    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
                    const m = l - c / 2;
                    
                    let r, g, b;
                    if (h < 1/6) { r = c; g = x; b = 0; }
                    else if (h < 2/6) { r = x; g = c; b = 0; }
                    else if (h < 3/6) { r = 0; g = c; b = x; }
                    else if (h < 4/6) { r = 0; g = x; b = c; }
                    else if (h < 5/6) { r = x; g = 0; b = c; }
                    else { r = c; g = 0; b = x; }
                    
                    r = Math.round((r + m) * 255);
                    g = Math.round((g + m) * 255);
                    b = Math.round((b + m) * 255);
                    
                    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
                }
            }
            
            // Named colors - create a temporary element to get computed RGB
            try {
                const temp = document.createElement('div');
                temp.style.color = color;
                temp.style.position = 'absolute';
                temp.style.visibility = 'hidden';
                document.body.appendChild(temp);
                const computed = window.getComputedStyle(temp).color;
                document.body.removeChild(temp);
                if (computed && computed.startsWith('rgb')) {
                    return computed;
                }
            } catch (e) {
                // Fallback
            }
            
            return null;
        }

        // Enhanced color detection from computed styles
    allElements.forEach(el => {
        try {
            if (el.id === 'bn-vibe-tools-popup') return; 

            const style = window.getComputedStyle(el);
            
                // Extract colors from all possible properties
                const colorProperties = [
                    'color', 'backgroundColor', 'borderColor', 'borderTopColor', 
                    'borderRightColor', 'borderBottomColor', 'borderLeftColor',
                    'outlineColor', 'textDecorationColor', 'textEmphasisColor',
                    'columnRuleColor', 'caretColor', 'fill', 'stroke'
                ];
                
                colorProperties.forEach(prop => {
                    const color = style[prop];
                    if (color) {
                        const rgb = colorToRgb(color);
                        if (rgb) {
                            // Standardize rgba with alpha 1 to rgb
                            const standardized = rgb.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*1\)/, 'rgb($1, $2, $3)');
                            colorSet.add(standardized);
                        }
                    }
                });

                // Extract fonts
            const fontFamily = style.fontFamily;
                if (fontFamily) {
            fontFamily.split(',').forEach(font => {
                        const cleaned = font.trim().replace(/['"]/g, '');
                        if (cleaned && !genericFonts.includes(cleaned.toLowerCase())) {
                            fontSet.add(cleaned);
                        }
                    });
                }
            } catch (e) {
                // Skip elements we can't access
            }
        });

        // Extract fonts from @font-face rules
        try {
            const styleSheets = Array.from(document.styleSheets);
            styleSheets.forEach(sheet => {
                try {
                    const rules = sheet.cssRules || sheet.rules || [];
                    Array.from(rules).forEach(rule => {
                        if (rule instanceof CSSFontFaceRule) {
                            const fontFamily = rule.style.fontFamily;
                            if (fontFamily) {
                                fontFamily.split(',').forEach(font => {
                                    const cleaned = font.trim().replace(/['"]/g, '');
                                    if (cleaned && !genericFonts.includes(cleaned.toLowerCase())) {
                                        fontSet.add(cleaned);
                                    }
                                });
                            }
                        }
                    });
                } catch (e) {
                    // Cross-origin stylesheet
                }
            });
        } catch (e) {
            // Could not access stylesheets
        }

        // Extract colors from inline styles
        allElements.forEach(el => {
            try {
                if (el.hasAttribute('style')) {
                    const styleText = el.getAttribute('style');
                    // Match color values in inline styles
                    const colorMatches = styleText.match(/(?:color|background|border|fill|stroke)[-a-z]*:\s*([^;]+)/gi);
                    if (colorMatches) {
                        colorMatches.forEach(match => {
                            const value = match.split(':')[1]?.trim();
                            if (value) {
                                const rgb = colorToRgb(value);
                                if (rgb) {
                                    const standardized = rgb.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*1\)/, 'rgb($1, $2, $3)');
                                    colorSet.add(standardized);
                                }
                            }
                        });
                    }
                }
        } catch (e) {
                // Skip
        }
    });

    return {
        colors: Array.from(colorSet).sort(),
        fonts: Array.from(fontSet).sort()
    };
}

/**
     * Enhanced SEO Analyzer - Comprehensive meta tag, structured data, and social media detection
 */
function analyzeSEO() {
        const getMeta = (name) => {
            const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            return meta?.getAttribute('content') || null;
        };
        
        const getProp = (prop) => {
            const meta = document.querySelector(`meta[property="${prop}"]`);
            return meta?.getAttribute('content') || null;
        };

        const getItemProp = (prop) => {
            const element = document.querySelector(`[itemprop="${prop}"]`);
            return element?.getAttribute('content') || element?.textContent?.trim() || null;
        };

        // Basic Meta Tags
        const title = document.querySelector('title')?.innerText?.trim() || null;
    const description = getMeta('description');
        const keywords = getMeta('keywords');
        const author = getMeta('author');
        const robots = getMeta('robots');
        const viewport = getMeta('viewport');
        const charset = document.querySelector('meta[charset]')?.getAttribute('charset') || null;
        
        // Headings
        const h1 = document.querySelector('h1')?.innerText?.trim() || null;
        const h1Count = document.querySelectorAll('h1').length;
        const h2Count = document.querySelectorAll('h2').length;
        const h3Count = document.querySelectorAll('h3').length;
        
        // Canonical and Alternate
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
        const alternate = Array.from(document.querySelectorAll('link[rel="alternate"]')).map(link => ({
            hreflang: link.getAttribute('hreflang'),
            href: link.getAttribute('href')
        }));

        // Open Graph Tags
    const ogTitle = getProp('og:title') || title;
    const ogDescription = getProp('og:description') || description;
    const ogImage = getProp('og:image');
    const ogType = getProp('og:type');
        const ogUrl = getProp('og:url');
        const ogSiteName = getProp('og:site_name');
        const ogLocale = getProp('og:locale');

        // Twitter Card Tags
        const twitterCard = getMeta('twitter:card');
        const twitterTitle = getMeta('twitter:title') || ogTitle || title;
        const twitterDescription = getMeta('twitter:description') || ogDescription || description;
        const twitterImage = getMeta('twitter:image') || ogImage;
        const twitterSite = getMeta('twitter:site');
        const twitterCreator = getMeta('twitter:creator');

        // Additional Meta Tags
        const themeColor = getMeta('theme-color');
        const appleMobileWebAppCapable = getMeta('apple-mobile-web-app-capable');
        const appleMobileWebAppTitle = getMeta('apple-mobile-web-app-title');
        const appleMobileWebAppStatusBar = getMeta('apple-mobile-web-app-status-bar-style');

        // Structured Data (JSON-LD)
        const structuredData = [];
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        jsonLdScripts.forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                structuredData.push(data);
            } catch (e) {
                // Invalid JSON
            }
        });

        // Schema.org microdata
        const schemaTypes = new Set();
        document.querySelectorAll('[itemtype]').forEach(el => {
            const itemtype = el.getAttribute('itemtype');
            if (itemtype) {
                schemaTypes.add(itemtype.split('/').pop());
            }
        });

        // Image Analysis
    const images = document.querySelectorAll('img');
    let missingAlts = 0;
        let imagesWithAlt = 0;
        let imagesWithTitle = 0;
    images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
            missingAlts++;
            } else {
                imagesWithAlt++;
            }
            if (img.title && img.title.trim() !== '') {
                imagesWithTitle++;
            }
        });

        // Links Analysis
        const links = document.querySelectorAll('a[href]');
        const internalLinks = [];
        const externalLinks = [];
        const baseUrl = window.location.origin;
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                if (href.startsWith('http') && !href.startsWith(baseUrl)) {
                    externalLinks.push(href);
                } else if (href.startsWith('/') || href.startsWith(baseUrl)) {
                    internalLinks.push(href);
                }
            }
        });

        // Language
        const lang = document.documentElement.getAttribute('lang') || null;

    return {
            // Basic
        title: title,
        description: description,
            keywords: keywords,
            author: author,
            robots: robots,
            viewport: viewport,
            charset: charset,
            lang: lang,
            
            // Headings
        h1: h1,
            h1Count: h1Count,
            h2Count: h2Count,
            h3Count: h3Count,
            
            // Links
        canonical: canonical,
            alternate: alternate,
            
            // Open Graph
        ogTitle: ogTitle,
        ogDescription: ogDescription,
        ogImage: ogImage,
        ogType: ogType,
            ogUrl: ogUrl,
            ogSiteName: ogSiteName,
            ogLocale: ogLocale,
            
            // Twitter
            twitterCard: twitterCard,
            twitterTitle: twitterTitle,
            twitterDescription: twitterDescription,
            twitterImage: twitterImage,
            twitterSite: twitterSite,
            twitterCreator: twitterCreator,
            
            // Mobile
            themeColor: themeColor,
            appleMobileWebAppCapable: appleMobileWebAppCapable,
            appleMobileWebAppTitle: appleMobileWebAppTitle,
            appleMobileWebAppStatusBar: appleMobileWebAppStatusBar,
            
            // Structured Data
            structuredData: structuredData.length > 0 ? structuredData : null,
            schemaTypes: Array.from(schemaTypes),
            
            // Images
        imageAlts: {
            total: images.length,
                missing: missingAlts,
                withAlt: imagesWithAlt,
                withTitle: imagesWithTitle
            },
            
            // Links
            links: {
                total: links.length,
                internal: internalLinks.length,
                external: externalLinks.length
        }
    };
}

/**
     * Comprehensive Stack Analyzer - Detects Frontend, Backend, Hosting, APIs, and more
 */
function analyzeStack() {
        const scripts = Array.from(document.scripts).map(s => s.src || '');
        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href || '');
        const allScripts = Array.from(document.scripts);
        const allLinks = Array.from(document.querySelectorAll('link'));
    const meta = document.querySelector('meta[name="generator"]');
        
        // Helper function to add unique items to arrays
        function addUnique(arr, item) {
            if (item && !arr.includes(item)) arr.push(item);
        }
        
        // Helper to detect from scripts/links
        function detectFromSrc(src, patterns) {
            if (!src) return null;
            const lowerSrc = src.toLowerCase();
            for (const [tech, pattern] of Object.entries(patterns)) {
                if (typeof pattern === 'string' && lowerSrc.includes(pattern.toLowerCase())) {
                    return tech;
                } else if (pattern instanceof RegExp && pattern.test(lowerSrc)) {
                    return tech;
                }
            }
            return null;
        }
        
        // Helper to detect version from scripts/window
        function detectVersion(tech, patterns) {
            for (const pattern of patterns) {
                if (typeof pattern === 'function') {
                    const version = pattern();
                    if (version) return version;
                } else if (typeof pattern === 'string') {
                    const match = window[pattern];
                    if (match) return match;
                }
            }
            return null;
        }
        
        const result = {
            frontend: {
                frameworks: [],
                cssLibraries: [],
                uiKits: [],
                cdns: [],
                analytics: [],
                templatingEngines: []
            },
            backend: {
                languages: [],
                frameworks: [],
                cms: [],
                databases: []
            },
            hosting: {
                providers: [],
                cdns: [],
                ssl: [],
                servers: []
            },
            apis: {
                external: [],
                social: [],
                headlessCms: []
            },
            miscellaneous: {
                fonts: [],
                bundlers: [],
                versions: {},
                securityHeaders: []
            }
        };
        
        // ===== FRONTEND (CLIENT-SIDE) =====

    // Frameworks
        if (window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || document.querySelector('[data-reactroot]') || document.querySelector('[data-react-helmet]')) {
            addUnique(result.frontend.frameworks, 'React');
            const reactVersion = window.React?.version || (window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.size > 0 ? 'Detected' : null);
            if (reactVersion) result.miscellaneous.versions['React'] = reactVersion;
        }
        if (window.Vue || window.__VUE__) {
            addUnique(result.frontend.frameworks, 'Vue.js');
            if (window.Vue?.version) result.miscellaneous.versions['Vue'] = window.Vue.version;
        }
        if (window.angular || window.ng) {
            addUnique(result.frontend.frameworks, 'Angular');
            if (window.angular?.version) result.miscellaneous.versions['Angular'] = window.angular.version.full;
        }
        if (window.__svelte || document.querySelector('[data-svelte-h]')) addUnique(result.frontend.frameworks, 'Svelte');
        if (window.__SVELTEKIT__ || window.__sveltekit__) addUnique(result.frontend.frameworks, 'SvelteKit');
        if (window.__NEXT_DATA__) {
            addUnique(result.frontend.frameworks, 'Next.js');
            if (window.__NEXT_DATA__.buildId) result.miscellaneous.versions['Next.js'] = 'Build: ' + window.__NEXT_DATA__.buildId;
        }
        if (window.__NUXT__ || window.$nuxt || window.Nuxt) addUnique(result.frontend.frameworks, 'Nuxt.js');
        if (window.__GATSBY || window.__GATSBY_STATIC_PAGE_DIRECTORY__) addUnique(result.frontend.frameworks, 'Gatsby');
        if (window.jQuery || window.$) {
            addUnique(result.frontend.frameworks, 'jQuery');
            if (window.jQuery?.fn?.jquery) result.miscellaneous.versions['jQuery'] = window.jQuery.fn.jquery;
        }
        if (window.Alpine || window.AlpineJS) addUnique(result.frontend.frameworks, 'Alpine.js');
        if (window.Ember || window.Em) addUnique(result.frontend.frameworks, 'Ember.js');
        if (window.Backbone) addUnique(result.frontend.frameworks, 'Backbone.js');
        if (window.Meteor || window.Package) addUnique(result.frontend.frameworks, 'Meteor');
        if (window.Aurelia || window.__aurelia__) addUnique(result.frontend.frameworks, 'Aurelia');
        if (window.Mithril) addUnique(result.frontend.frameworks, 'Mithril');
        if (window.Polymer || window.PolymerElement) addUnique(result.frontend.frameworks, 'Polymer');
        if (window.Preact || window.preact) addUnique(result.frontend.frameworks, 'Preact');
        if (window.Riot) addUnique(result.frontend.frameworks, 'Riot.js');
        if (window.Marko) addUnique(result.frontend.frameworks, 'Marko');
        if (window.Inferno) addUnique(result.frontend.frameworks, 'Inferno');
        if (window.remixContext) addUnique(result.frontend.frameworks, 'Remix');
        
        // CSS Libraries
        if (window.bootstrap || document.querySelector('.bootstrap') || scripts.some(s => s.includes('bootstrap'))) {
            addUnique(result.frontend.cssLibraries, 'Bootstrap');
            const bootstrapMatch = scripts.find(s => s.includes('bootstrap'))?.match(/bootstrap[.-]?(\d+\.\d+)/i);
            if (bootstrapMatch) result.miscellaneous.versions['Bootstrap'] = bootstrapMatch[1];
        }
        if (document.querySelector('script[src*="tailwind"]') || links.some(l => l.includes('tailwind')) || document.querySelector('[class*="tailwind"]')) {
            addUnique(result.frontend.cssLibraries, 'Tailwind CSS');
            const tailwindMatch = links.find(l => l.includes('tailwind'))?.match(/tailwind[.-]?(\d+\.\d+)/i);
            if (tailwindMatch) result.miscellaneous.versions['Tailwind CSS'] = tailwindMatch[1];
        }
        if (window.Foundation || document.querySelector('[data-foundation]')) addUnique(result.frontend.cssLibraries, 'Foundation');
        if (window.Bulma || document.querySelector('.bulma')) addUnique(result.frontend.cssLibraries, 'Bulma');
        if (window.Semantic || window.semantic) addUnique(result.frontend.cssLibraries, 'Semantic UI');
        if (window.Materialize || document.querySelector('.materialize')) addUnique(result.frontend.cssLibraries, 'Materialize CSS');
        if (window.MUI || window.materialUI) addUnique(result.frontend.cssLibraries, 'Material-UI');
        if (window.Antd || window.antd) addUnique(result.frontend.cssLibraries, 'Ant Design');
        if (window.Chakra || window.ChakraUI) addUnique(result.frontend.cssLibraries, 'Chakra UI');
        if (window.Mantine || window.mantine) addUnique(result.frontend.cssLibraries, 'Mantine');
        if (window.Vuetify || window.$vuetify) addUnique(result.frontend.cssLibraries, 'Vuetify');
        if (window.ElementUI || window.ELEMENT) addUnique(result.frontend.cssLibraries, 'Element UI');
        
        // UI Kits
        if (scripts.some(s => s.includes('flowbite'))) addUnique(result.frontend.uiKits, 'Flowbite');
        if (scripts.some(s => s.includes('daisyui')) || links.some(l => l.includes('daisyui'))) addUnique(result.frontend.uiKits, 'DaisyUI');
        if (scripts.some(s => s.includes('hyperui'))) addUnique(result.frontend.uiKits, 'HyperUI');
        if (scripts.some(s => s.includes('shadcn')) || document.querySelector('[data-shadcn]')) addUnique(result.frontend.uiKits, 'ShadCN');
        
        // CDNs
        if (scripts.some(s => s.includes('cdn.jsdelivr.net')) || links.some(l => l.includes('cdn.jsdelivr.net'))) addUnique(result.frontend.cdns, 'jsDelivr');
        if (scripts.some(s => s.includes('unpkg.com')) || links.some(l => l.includes('unpkg.com'))) addUnique(result.frontend.cdns, 'unpkg');
        if (scripts.some(s => s.includes('cdnjs.cloudflare.com')) || links.some(l => l.includes('cdnjs.cloudflare.com'))) addUnique(result.frontend.cdns, 'Cloudflare CDN');
        if (scripts.some(s => s.includes('ajax.googleapis.com')) || links.some(l => l.includes('ajax.googleapis.com'))) addUnique(result.frontend.cdns, 'Google CDN');
        
        // Analytics/Trackers
        if (window.ga || window.GoogleAnalyticsObject || window.gaData) addUnique(result.frontend.analytics, 'Google Analytics (ga.js)');
        if (window.gtag || window.dataLayer) addUnique(result.frontend.analytics, 'Google Analytics (gtag.js)');
        if (window._paq) addUnique(result.frontend.analytics, 'Matomo Analytics');
        if (window._fbq || window.fbq) addUnique(result.frontend.analytics, 'Meta Pixel');
        if (window._learnq || window.Klaviyo) addUnique(result.frontend.analytics, 'Klaviyo');
        if (window.amplitude || window.Amplitude) addUnique(result.frontend.analytics, 'Amplitude');
        if (window.mixpanel || window.Mixpanel) addUnique(result.frontend.analytics, 'Mixpanel');
        if (window.segment || window.analytics) addUnique(result.frontend.analytics, 'Segment');
        if (window.hotjar || window.Hotjar) addUnique(result.frontend.analytics, 'Hotjar');
        if (window.fullstory || window.FS) addUnique(result.frontend.analytics, 'FullStory');
        if (window.logRocket || window.LogRocket) addUnique(result.frontend.analytics, 'LogRocket');
        if (window.sentry || window.Sentry) addUnique(result.frontend.analytics, 'Sentry');
        if (window.rollbar || window.Rollbar) addUnique(result.frontend.analytics, 'Rollbar');
        if (window.bugsnag || window.Bugsnag) addUnique(result.frontend.analytics, 'Bugsnag');
        if (window.newrelic || window.NREUM) addUnique(result.frontend.analytics, 'New Relic');
        if (window.datadogRum || window.DD_RUM) addUnique(result.frontend.analytics, 'Datadog RUM');
        
        // Templating Engines
        if (scripts.some(s => s.includes('handlebars')) || window.Handlebars) addUnique(result.frontend.templatingEngines, 'Handlebars');
        if (scripts.some(s => s.includes('liquid')) || document.querySelector('[data-liquid]')) addUnique(result.frontend.templatingEngines, 'Liquid');
        if (scripts.some(s => s.includes('pug')) || document.querySelector('[data-pug]')) addUnique(result.frontend.templatingEngines, 'Pug');
        if (window.Mustache) addUnique(result.frontend.templatingEngines, 'Mustache');
        if (window._ || window.underscore) addUnique(result.frontend.templatingEngines, 'Underscore.js Templates');
        
        // ===== BACKEND (SERVER-SIDE) =====
        
        // Language/Framework Detection
        const xPoweredBy = document.querySelector('meta[name="X-Powered-By"]');
        if (xPoweredBy) {
            const poweredBy = xPoweredBy.content.toLowerCase();
            if (poweredBy.includes('php')) addUnique(result.backend.languages, 'PHP');
            if (poweredBy.includes('express')) addUnique(result.backend.frameworks, 'Express');
            if (poweredBy.includes('asp.net')) addUnique(result.backend.frameworks, 'ASP.NET');
        }
        
        // Node.js Frameworks
        if (window.__NEXT_DATA__) addUnique(result.backend.frameworks, 'Next.js');
        if (window.__NUXT__ || window.$nuxt) addUnique(result.backend.frameworks, 'Nuxt.js');
        if (window.remixContext) addUnique(result.backend.frameworks, 'Remix');
        if (window.__NESTJS__) addUnique(result.backend.frameworks, 'NestJS');
        if (scripts.some(s => s.includes('express'))) addUnique(result.backend.frameworks, 'Express');
        
        // PHP Frameworks
        if (document.querySelector('link[href*="wp-content"]') || document.querySelector('script[src*="wp-content"]') || window.wp || window.wpApiSettings) {
            addUnique(result.backend.frameworks, 'WordPress');
            const wpVersion = document.querySelector('meta[name="generator"]')?.content?.match(/WordPress\s+(\d+\.\d+)/i);
            if (wpVersion) result.miscellaneous.versions['WordPress'] = wpVersion[1];
        }
        if (scripts.some(s => s.includes('laravel'))) addUnique(result.backend.frameworks, 'Laravel');
        
        // Python Frameworks
        if (scripts.some(s => s.includes('django'))) addUnique(result.backend.frameworks, 'Django');
        if (scripts.some(s => s.includes('flask'))) addUnique(result.backend.frameworks, 'Flask');
        
        // Ruby
        if (scripts.some(s => s.includes('rails')) || xPoweredBy?.content?.includes('Rails')) addUnique(result.backend.frameworks, 'Ruby on Rails');
        
        // Java
        if (xPoweredBy?.content?.includes('Java') || xPoweredBy?.content?.includes('Spring')) addUnique(result.backend.frameworks, 'Spring');
        
        // CMS Platforms
        if (window.Shopify || window.ShopifyAnalytics || document.querySelector('[data-shopify]')) addUnique(result.backend.cms, 'Shopify');
        if (window.Square || document.querySelector('[data-square]')) addUnique(result.backend.cms, 'Square');
        if (window.Wix || window.wixBiSession || document.querySelector('[data-wix]')) addUnique(result.backend.cms, 'Wix');
        if (document.querySelector('[data-wf-page]') || document.querySelector('[data-wf-site]')) addUnique(result.backend.cms, 'Webflow');
        if (window.Squarespace || document.querySelector('[data-squarespace]')) addUnique(result.backend.cms, 'Squarespace');
        if (window.Drupal || document.querySelector('[data-drupal]')) addUnique(result.backend.cms, 'Drupal');
        if (window.Joomla || document.querySelector('[data-joomla]')) addUnique(result.backend.cms, 'Joomla');
        if (window.Magento || window.Mage || document.querySelector('[data-magento]')) addUnique(result.backend.cms, 'Magento');
        if (window.PrestaShop || document.querySelector('[data-prestashop]')) addUnique(result.backend.cms, 'PrestaShop');
        if (window.WooCommerce || document.querySelector('[data-woocommerce]')) addUnique(result.backend.cms, 'WooCommerce');
        if (window.Ghost || window.GhostContentAPI) addUnique(result.backend.cms, 'Ghost');
        if (window.Strapi || window.strapi) addUnique(result.backend.cms, 'Strapi');
        if (window.Contentful || window.contentful) addUnique(result.backend.cms, 'Contentful');
        if (window.Sanity || window.sanity) addUnique(result.backend.cms, 'Sanity');
        if (window.Prismic || window.PrismicDom) addUnique(result.backend.cms, 'Prismic');
        if (window.Kentico || window.kentico) addUnique(result.backend.cms, 'Kentico');
        if (window.Sitecore || window.sitecore) addUnique(result.backend.cms, 'Sitecore');
        if (window.AEM || window.CQ || document.querySelector('[data-aem]')) addUnique(result.backend.cms, 'Adobe Experience Manager');
        if (window.Umbraco || window.umbraco) addUnique(result.backend.cms, 'Umbraco');
        if (window.Craft || window.CraftCMS) addUnique(result.backend.cms, 'Craft CMS');
        if (window.Statamic || window.statamic) addUnique(result.backend.cms, 'Statamic');
        if (window.Kirby || window.kirby) addUnique(result.backend.cms, 'Kirby');
        if (window.Payload || window.payload) addUnique(result.backend.cms, 'Payload CMS');
        if (window.BigCommerce || document.querySelector('[data-bigcommerce]')) addUnique(result.backend.cms, 'BigCommerce');
        
        // Database Hints
        if (window.Firebase || window.firebase || window.__FIREBASE__) addUnique(result.backend.databases, 'Firebase');
        if (window.supabase || window.Supabase) addUnique(result.backend.databases, 'Supabase');
        if (window.__APOLLO__ || window.__APOLLO_CLIENT__ || window.GraphQL || window.graphql) addUnique(result.backend.databases, 'GraphQL');
        if (scripts.some(s => s.includes('mongodb'))) addUnique(result.backend.databases, 'MongoDB');
        if (scripts.some(s => s.includes('postgres'))) addUnique(result.backend.databases, 'PostgreSQL');
        if (scripts.some(s => s.includes('mysql'))) addUnique(result.backend.databases, 'MySQL');
        
        // ===== HOSTING / INFRA =====
        
        // Host Providers
        if (window.netlify || window.__NETLIFY__ || document.querySelector('[data-netlify]')) addUnique(result.hosting.providers, 'Netlify');
        if (window.vercel || window.__VERCEL__ || document.querySelector('[data-vercel]')) addUnique(result.hosting.providers, 'Vercel');
        if (window.__AWS__ || window.AWS || scripts.some(s => s.includes('amazonaws.com'))) addUnique(result.hosting.providers, 'AWS');
        if (window.__GOOGLE_CLOUD__ || window.gcp || scripts.some(s => s.includes('googleapis.com'))) addUnique(result.hosting.providers, 'Google Cloud');
        if (window.__AZURE__ || window.azure || scripts.some(s => s.includes('azure.com'))) addUnique(result.hosting.providers, 'Microsoft Azure');
        if (scripts.some(s => s.includes('digitalocean.com'))) addUnique(result.hosting.providers, 'DigitalOcean');
        
        // CDN/Edge
        if (window.cloudflare || document.querySelector('[data-cf]') || scripts.some(s => s.includes('cloudflare.com'))) addUnique(result.hosting.cdns, 'Cloudflare');
        if (scripts.some(s => s.includes('akamai.com'))) addUnique(result.hosting.cdns, 'Akamai');
        if (scripts.some(s => s.includes('fastly.com'))) addUnique(result.hosting.cdns, 'Fastly');
        
        // SSL Info (from headers if available)
        // Note: Most SSL info requires server headers, which we can't access from content script
        // But we can check for common indicators
        if (window.location.protocol === 'https:') {
            if (scripts.some(s => s.includes('cloudflare'))) addUnique(result.hosting.ssl, 'Cloudflare SSL');
            // Let's Encrypt is typically not detectable client-side
        }
        
        // Server Headers (from meta or X-Powered-By)
        if (xPoweredBy) {
            const server = xPoweredBy.content.toLowerCase();
            if (server.includes('nginx')) addUnique(result.hosting.servers, 'Nginx');
            if (server.includes('apache')) addUnique(result.hosting.servers, 'Apache');
            if (server.includes('litespeed')) addUnique(result.hosting.servers, 'LiteSpeed');
            if (server.includes('iis')) addUnique(result.hosting.servers, 'IIS');
        }
        
        // ===== APIs & INTEGRATIONS =====
        
        // External APIs
        if (window.Stripe || window.StripeCheckout || scripts.some(s => s.includes('stripe.com'))) addUnique(result.apis.external, 'Stripe');
        if (window.PayPal || window.paypal || scripts.some(s => s.includes('paypal.com'))) addUnique(result.apis.external, 'PayPal');
        if (window.Square || window.square || scripts.some(s => s.includes('square.com'))) addUnique(result.apis.external, 'Square Payments');
        if (window.Braintree || window.braintree) addUnique(result.apis.external, 'Braintree');
        if (scripts.some(s => s.includes('maps.googleapis.com')) || document.querySelector('iframe[src*="maps.googleapis.com"]')) addUnique(result.apis.external, 'Google Maps');
        if (window.OpenAI || scripts.some(s => s.includes('openai.com'))) addUnique(result.apis.external, 'OpenAI');
        if (window.Firebase || window.firebase || window.__FIREBASE__) addUnique(result.apis.external, 'Firebase');
        
        // Social Embeds
        if (document.querySelector('iframe[src*="youtube.com"]') || document.querySelector('iframe[src*="youtu.be"]')) addUnique(result.apis.social, 'YouTube');
        if (document.querySelector('iframe[src*="twitter.com"]') || document.querySelector('blockquote[class*="twitter"]')) addUnique(result.apis.social, 'Twitter/X');
        if (document.querySelector('iframe[src*="spotify.com"]')) addUnique(result.apis.social, 'Spotify');
        if (document.querySelector('iframe[src*="instagram.com"]')) addUnique(result.apis.social, 'Instagram');
        if (document.querySelector('iframe[src*="facebook.com"]')) addUnique(result.apis.social, 'Facebook');
        
        // Headless CMS APIs
        if (window.Strapi || window.strapi) addUnique(result.apis.headlessCms, 'Strapi API');
        if (window.Contentful || window.contentful) addUnique(result.apis.headlessCms, 'Contentful API');
        if (window.Sanity || window.sanity) addUnique(result.apis.headlessCms, 'Sanity API');
        if (window.Prismic || window.PrismicDom) addUnique(result.apis.headlessCms, 'Prismic API');
        if (window.Ghost || window.GhostContentAPI) addUnique(result.apis.headlessCms, 'Ghost API');
        
        // ===== MISCELLANEOUS =====
        
        // Fonts
        const fontLinks = links.filter(l => l.href && (l.href.includes('fonts.googleapis.com') || l.href.includes('fonts.gstatic.com')));
        if (fontLinks.length > 0) addUnique(result.miscellaneous.fonts, 'Google Fonts');
        if (links.some(l => l.href && l.href.includes('typekit.net'))) addUnique(result.miscellaneous.fonts, 'Adobe Typekit');
        if (links.some(l => l.href && (l.href.endsWith('.woff') || l.href.endsWith('.woff2') || l.href.endsWith('.ttf')))) addUnique(result.miscellaneous.fonts, 'Local Fonts');
        
        // JS Bundlers
        if (window.webpackChunkName || window.__webpack_require__) addUnique(result.miscellaneous.bundlers, 'Webpack');
        if (window.__VITE__ || window.Vite) addUnique(result.miscellaneous.bundlers, 'Vite');
        if (window.__PARCEL__ || window.parcelRequire) addUnique(result.miscellaneous.bundlers, 'Parcel');
        if (window.__ROLLUP__ || window.rollup) addUnique(result.miscellaneous.bundlers, 'Rollup');
        if (window.__ESBUILD__ || window.esbuild) addUnique(result.miscellaneous.bundlers, 'esbuild');
        if (window.__SNOWPACK__ || window.Snowpack) addUnique(result.miscellaneous.bundlers, 'Snowpack');
        
        // Security Headers (check meta tags and CSP)
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (cspMeta) addUnique(result.miscellaneous.securityHeaders, 'Content-Security-Policy (CSP)');
        const corsMeta = document.querySelector('meta[http-equiv="Access-Control-Allow-Origin"]');
        if (corsMeta) addUnique(result.miscellaneous.securityHeaders, 'CORS');
        const xFrameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
        if (xFrameOptions) addUnique(result.miscellaneous.securityHeaders, 'X-Frame-Options');
        
        // Additional version detection from script sources
        scripts.forEach(src => {
            if (!src) return;
            const lowerSrc = src.toLowerCase();
            const versionMatch = lowerSrc.match(/(react|vue|angular|jquery|bootstrap|tailwind)[.-]?(\d+\.\d+\.\d+|\d+\.\d+)/i);
            if (versionMatch) {
                const tech = versionMatch[1].charAt(0).toUpperCase() + versionMatch[1].slice(1);
                if (tech === 'Jquery') result.miscellaneous.versions['jQuery'] = versionMatch[2];
                else if (tech === 'Tailwind') result.miscellaneous.versions['Tailwind CSS'] = versionMatch[2];
                else result.miscellaneous.versions[tech] = versionMatch[2];
            }
        });
        
        // Generator meta tag
        if (meta && meta.content) {
            result.miscellaneous.versions['Generator'] = meta.content;
        }
        
        return result;
    }
})();