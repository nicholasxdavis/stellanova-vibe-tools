/**
 * BN Vibe Tools - Scraper Content Script
 * This script sanitizes the page to remove all JavaScript/logic before capture,
 * keeping only UI/visual elements (HTML structure, CSS, images).
 */

(function() {
    'use strict';
    
    // Remove all script tags (including inline and external)
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove all event handlers from elements
    const allElements = document.querySelectorAll('*');
    let eventHandlerCount = 0;
    let javascriptProtocolCount = 0;
    
    allElements.forEach(element => {
        // Remove all inline event handlers (onclick, onload, etc.)
        const attributes = Array.from(element.attributes);
        attributes.forEach(attr => {
            if (attr.name.startsWith('on') && attr.name.length > 2) {
                element.removeAttribute(attr.name);
                eventHandlerCount++;
            }
        });
        
        // Remove javascript: protocols from href/src attributes
        if (element.hasAttribute('href')) {
            const href = element.getAttribute('href');
            if (href && href.toLowerCase().startsWith('javascript:')) {
                element.removeAttribute('href');
                javascriptProtocolCount++;
            }
        }
        if (element.hasAttribute('src')) {
            const src = element.getAttribute('src');
            if (src && src.toLowerCase().startsWith('javascript:')) {
                element.removeAttribute('src');
                javascriptProtocolCount++;
            }
        }
    });
    
    // Remove noscript tags (they're not needed for UI capture)
    const noscripts = document.querySelectorAll('noscript');
    noscripts.forEach(noscript => noscript.remove());
    
    // Handle iframes - replace with placeholder to avoid embedded scripts
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        // Replace iframe with a placeholder div showing the src
        const placeholder = document.createElement('div');
        placeholder.className = 'iframe-placeholder';
        placeholder.style.cssText = 'padding: 20px; border: 1px dashed #ccc; text-align: center; color: #666; background: #f5f5f5;';
        placeholder.textContent = `[Iframe: ${iframe.src || 'no src'}]`;
        if (iframe.parentNode) {
            iframe.parentNode.replaceChild(placeholder, iframe);
        }
    });
    
    // Remove potentially dangerous data attributes while keeping UI-related ones
    const safeDataAttrs = ['data-tab', 'data-toggle', 'data-target', 'data-bs-toggle', 'data-bs-target', 
                          'data-id', 'data-index', 'data-value', 'data-label', 'data-name'];
    let removedDataAttrs = 0;
    
    // Find all elements with data attributes (can't use [data-*] selector, so filter manually)
    const allElementsWithAttrs = document.querySelectorAll('*');
    const elementsWithDataAttrs = Array.from(allElementsWithAttrs).filter(el => {
        return Array.from(el.attributes).some(attr => attr.name.startsWith('data-'));
    });
    
    elementsWithDataAttrs.forEach(element => {
        const dataAttrs = Array.from(element.attributes)
            .filter(attr => attr.name.startsWith('data-') && !safeDataAttrs.includes(attr.name));
        
        dataAttrs.forEach(attr => {
            const attrName = attr.name.toLowerCase();
            // Remove data attributes that are clearly for JavaScript functionality
            if (attrName.includes('click') || 
                attrName.includes('action') || 
                attrName.includes('handler') ||
                attrName.includes('event') ||
                attrName.includes('js-') ||
                attrName.includes('function') ||
                attrName.includes('callback')) {
                element.removeAttribute(attr.name);
                removedDataAttrs++;
            }
        });
    });
    
    // Clean up any remaining JavaScript references in style attributes
    let styleCleanedCount = 0;
    allElements.forEach(element => {
        if (element.hasAttribute('style')) {
            const style = element.getAttribute('style');
            if (style && style.includes('javascript:')) {
                element.removeAttribute('style');
                styleCleanedCount++;
            }
        }
    });
    
    // Remove any remaining script-related meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
        const httpEquiv = meta.getAttribute('http-equiv');
        if (httpEquiv && httpEquiv.toLowerCase() === 'content-security-policy') {
            // Remove CSP that might block resources
            meta.remove();
        }
    });
    
    // Ensure all external script references in link tags are removed
    const linkTags = document.querySelectorAll('link[rel="preload"], link[as="script"]');
    linkTags.forEach(link => link.remove());
    
    // Mark the page as sanitized
    document.documentElement.setAttribute('data-bn-sanitized', 'true');
})();

