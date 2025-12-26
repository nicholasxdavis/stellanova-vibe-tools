/**
 * BN Vibe Tools - Enhanced Asset Scraper Content Script (v1.8)
 * Significantly improved asset detection from all sources
 */

(function() {
    'use strict';
    
    function scrapeAssets() {
        const assets = {
            images: [],
            stylesheets: [],
            scripts: [],
            fonts: [],
            other: []
        };
        
        const baseUrl = window.location.origin;
        const pageUrl = window.location.href;
        const seenUrls = new Set();
        
        // Helper to resolve URLs
        function resolveUrl(url) {
            if (!url) return null;
            if (url.startsWith('data:')) return url; // Keep data URIs as-is
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
                if (url.startsWith('//')) {
                    return window.location.protocol + url;
                }
                return url;
            }
            if (url.startsWith('/')) {
                return baseUrl + url;
            }
            try {
                return new URL(url, pageUrl).href;
            } catch (e) {
                return baseUrl + '/' + url;
            }
        }
        
        function addUniqueAsset(category, asset) {
            const key = asset.url || asset;
            if (key && !seenUrls.has(key)) {
                seenUrls.add(key);
                assets[category].push(asset);
            }
        }
        
        // Extract images from img tags
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Primary src
            if (img.src) {
                const resolvedUrl = resolveUrl(img.src);
                addUniqueAsset('images', {
                    url: resolvedUrl,
                    type: 'image',
                    name: img.alt || img.title || img.getAttribute('data-name') || resolvedUrl.split('/').pop() || 'image',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown',
                    width: img.naturalWidth || img.width || null,
                    height: img.naturalHeight || img.height || null
                });
            }
            
            // srcset
            if (img.srcset) {
                const srcset = img.srcset.split(',');
                srcset.forEach(src => {
                    const url = src.trim().split(' ')[0];
                    const resolvedUrl = resolveUrl(url);
                    addUniqueAsset('images', {
                        url: resolvedUrl,
                        type: 'image',
                        name: img.alt || resolvedUrl.split('/').pop() || 'image',
                        format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                    });
                });
            }
            
            // data-src (lazy loading)
            if (img.dataset.src) {
                const resolvedUrl = resolveUrl(img.dataset.src);
                addUniqueAsset('images', {
                    url: resolvedUrl,
                    type: 'image',
                    name: img.alt || resolvedUrl.split('/').pop() || 'image',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                });
            }
        });
        
        // Extract images from picture > source tags
        const pictureSources = document.querySelectorAll('picture source[srcset]');
        pictureSources.forEach(source => {
            const srcset = source.srcset;
            srcset.split(',').forEach(src => {
                const url = src.trim().split(' ')[0];
                const resolvedUrl = resolveUrl(url);
                addUniqueAsset('images', {
                    url: resolvedUrl,
                    type: 'image',
                    name: resolvedUrl.split('/').pop() || 'image',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                });
            });
        });
        
        // Extract CSS background images from all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            try {
                const style = window.getComputedStyle(el);
                const bgImage = style.backgroundImage;
                
                if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
                    // Match all url() instances (can be multiple in gradients)
                    const matches = bgImage.matchAll(/url\(['"]?([^'"]+)['"]?\)/g);
                    for (const match of matches) {
                        if (match[1]) {
                            const resolvedUrl = resolveUrl(match[1]);
                            if (resolvedUrl && !resolvedUrl.startsWith('data:')) {
                                addUniqueAsset('images', {
                                    url: resolvedUrl,
                                    type: 'background-image',
                                    name: resolvedUrl.split('/').pop() || 'background-image',
                                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                                });
                            }
                        }
                    }
                }
                
                // Check for mask-image
                const maskImage = style.maskImage;
                if (maskImage && maskImage !== 'none' && maskImage.includes('url(')) {
                    const match = maskImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (match && match[1]) {
                        const resolvedUrl = resolveUrl(match[1]);
                        if (resolvedUrl && !resolvedUrl.startsWith('data:')) {
                            addUniqueAsset('images', {
                                url: resolvedUrl,
                                type: 'mask-image',
                                name: resolvedUrl.split('/').pop() || 'mask-image',
                                format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                            });
                        }
                    }
                }
            } catch (e) {
                // Skip elements we can't access (cross-origin, etc.)
            }
        });
        
        // Extract background images from inline styles
        allElements.forEach(el => {
            if (el.hasAttribute('style')) {
                const styleText = el.getAttribute('style');
                const bgMatches = styleText.match(/background(?:-image)?:\s*url\(['"]?([^'"]+)['"]?\)/gi);
                if (bgMatches) {
                    bgMatches.forEach(match => {
                        const urlMatch = match.match(/url\(['"]?([^'"]+)['"]?\)/);
                        if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith('data:')) {
                            const resolvedUrl = resolveUrl(urlMatch[1]);
                            addUniqueAsset('images', {
                                url: resolvedUrl,
                                type: 'background-image',
                                name: resolvedUrl.split('/').pop() || 'background-image',
                                format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                            });
                        }
                    });
                }
            }
        });
        
        // Extract SVG sources
        // Note: xlink:href needs to be accessed directly, not via querySelector
        const svgImages = document.querySelectorAll('svg image');
        svgImages.forEach(img => {
            // Try href first (SVG 2), then xlink:href (SVG 1.1)
            const href = img.getAttribute('href') || img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
            if (href) {
                const resolvedUrl = resolveUrl(href);
                addUniqueAsset('images', {
                    url: resolvedUrl,
                    type: 'svg-image',
                    name: resolvedUrl.split('/').pop() || 'svg-image',
                    format: 'svg'
                });
            }
        });
        
        // Extract stylesheets
        const stylesheetLinks = document.querySelectorAll('link[rel="stylesheet"], link[rel="preload"][as="style"], link[rel="prefetch"][as="style"]');
        stylesheetLinks.forEach(link => {
            const href = link.href;
            if (href && !href.startsWith('chrome-extension://')) {
                const resolvedUrl = resolveUrl(href);
                addUniqueAsset('stylesheets', {
                    url: resolvedUrl,
                    type: 'stylesheet',
                    name: link.getAttribute('title') || link.getAttribute('data-name') || resolvedUrl.split('/').pop() || 'stylesheet',
                    format: 'css',
                    media: link.getAttribute('media') || null
                });
            }
        });
        
        // Extract stylesheets from @import rules
        try {
            const styleSheets = Array.from(document.styleSheets);
            styleSheets.forEach(sheet => {
                try {
                    const rules = sheet.cssRules || sheet.rules || [];
                    Array.from(rules).forEach(rule => {
                        if (rule instanceof CSSImportRule) {
                            const href = rule.href;
                            if (href) {
                                const resolvedUrl = resolveUrl(href);
                                addUniqueAsset('stylesheets', {
                                    url: resolvedUrl,
                                    type: 'imported-stylesheet',
                                    name: resolvedUrl.split('/').pop() || 'imported-stylesheet',
                                    format: 'css'
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
        
        // Extract scripts
        const scriptTags = document.querySelectorAll('script[src]');
        scriptTags.forEach(script => {
            const src = script.src;
            if (src && !src.startsWith('chrome-extension://') && !src.startsWith('moz-extension://')) {
                const resolvedUrl = resolveUrl(src);
                addUniqueAsset('scripts', {
                    url: resolvedUrl,
                    type: 'script',
                    name: script.getAttribute('data-name') || script.id || resolvedUrl.split('/').pop() || 'script',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'js',
                    async: script.hasAttribute('async'),
                    defer: script.hasAttribute('defer'),
                    module: script.type === 'module'
                });
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
                            const src = rule.style.src;
                            // Match all url() instances in src
                            const urlMatches = src.matchAll(/url\(['"]?([^'"]+)['"]?\)/g);
                            for (const match of urlMatches) {
                                if (match[1] && !match[1].startsWith('data:')) {
                                    const resolvedUrl = resolveUrl(match[1]);
                                    const fontFamily = rule.style.fontFamily?.replace(/['"]/g, '') || 'Unknown Font';
                                    addUniqueAsset('fonts', {
                                        url: resolvedUrl,
                                        type: 'font',
                                        name: fontFamily,
                                        format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'woff2',
                                        weight: rule.style.fontWeight || 'normal',
                                        style: rule.style.fontStyle || 'normal'
                                    });
                                }
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
        
        // Extract fonts from link[rel="preload"][as="font"]
        const fontPreloads = document.querySelectorAll('link[rel="preload"][as="font"]');
        fontPreloads.forEach(link => {
            const href = link.href;
            if (href) {
                const resolvedUrl = resolveUrl(href);
                addUniqueAsset('fonts', {
                    url: resolvedUrl,
                    type: 'font',
                    name: link.getAttribute('data-name') || resolvedUrl.split('/').pop() || 'font',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'woff2'
                });
            }
        });
        
        // Extract other media resources
        const videos = document.querySelectorAll('video[src], video source[src], video source[srcset]');
        videos.forEach(video => {
            const src = video.src || video.getAttribute('src');
            const srcset = video.getAttribute('srcset');
            
            if (src) {
                const resolvedUrl = resolveUrl(src);
                addUniqueAsset('other', {
                    url: resolvedUrl,
                    type: 'video',
                    name: video.getAttribute('data-name') || resolvedUrl.split('/').pop() || 'video',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                });
            }
            
            if (srcset) {
                srcset.split(',').forEach(src => {
                    const url = src.trim().split(' ')[0];
                    const resolvedUrl = resolveUrl(url);
                    addUniqueAsset('other', {
                        url: resolvedUrl,
                        type: 'video',
                        name: resolvedUrl.split('/').pop() || 'video',
                        format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                    });
                });
            }
        });
        
        const audios = document.querySelectorAll('audio[src], audio source[src]');
        audios.forEach(audio => {
            const src = audio.src || audio.getAttribute('src');
            if (src) {
                const resolvedUrl = resolveUrl(src);
                addUniqueAsset('other', {
                    url: resolvedUrl,
                    type: 'audio',
                    name: audio.getAttribute('data-name') || resolvedUrl.split('/').pop() || 'audio',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                });
            }
        });
        
        // Extract iframe sources
        const iframes = document.querySelectorAll('iframe[src]');
        iframes.forEach(iframe => {
            const src = iframe.src;
            if (src && !src.startsWith('about:') && !src.startsWith('javascript:')) {
                const resolvedUrl = resolveUrl(src);
                addUniqueAsset('other', {
                    url: resolvedUrl,
                    type: 'iframe',
                    name: iframe.getAttribute('data-name') || iframe.title || resolvedUrl.split('/').pop() || 'iframe',
                    format: 'html'
                });
            }
        });
        
        // Extract object/embed sources
        const objects = document.querySelectorAll('object[data], embed[src]');
        objects.forEach(obj => {
            const src = obj.data || obj.src;
            if (src) {
                const resolvedUrl = resolveUrl(src);
                addUniqueAsset('other', {
                    url: resolvedUrl,
                    type: 'object',
                    name: obj.getAttribute('data-name') || resolvedUrl.split('/').pop() || 'object',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'unknown'
                });
            }
        });
        
        // Extract manifest files
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink && manifestLink.href) {
            const resolvedUrl = resolveUrl(manifestLink.href);
            addUniqueAsset('other', {
                url: resolvedUrl,
                type: 'manifest',
                name: 'manifest.json',
                format: 'json'
            });
        }
        
        // Extract favicons and icons
        const icons = document.querySelectorAll('link[rel*="icon"], link[rel*="apple-touch-icon"], link[rel*="shortcut"]');
        icons.forEach(icon => {
            const href = icon.href;
            if (href) {
                const resolvedUrl = resolveUrl(href);
                addUniqueAsset('images', {
                    url: resolvedUrl,
                    type: 'icon',
                    name: icon.getAttribute('data-name') || resolvedUrl.split('/').pop() || 'icon',
                    format: resolvedUrl.split('.').pop()?.toLowerCase().split('?')[0] || 'ico'
                });
            }
        });
        
        return assets;
    }
    
    // Expose function globally
    if (typeof window !== 'undefined') {
        window.scrapeAssets = scrapeAssets;
    }
})();