/**
 * BN Vibe Tools - Design Documentation Generator
 * Generates comprehensive design documentation for recreating the UI
 */

// Immediately execute and define the function in global scope
(function() {
    'use strict';
    
    function generateDesignDocumentation() {
        try {
            const doc = {
                title: 'UI Design Documentation',
                url: window.location.href,
                timestamp: new Date().toISOString(),
                sections: []
            };
        
        // 1. COLOR PALETTE
        const colors = extractColors();
        doc.sections.push({
            title: 'COLOR PALETTE',
            content: colors
        });
        
        // 2. TYPOGRAPHY
        const typography = extractTypography();
        doc.sections.push({
            title: 'TYPOGRAPHY',
            content: typography
        });
        
        // 3. LAYOUT & STRUCTURE
        const layout = extractLayout();
        doc.sections.push({
            title: 'LAYOUT & STRUCTURE',
            content: layout
        });
        
        // 4. BUTTONS & INTERACTIVE ELEMENTS
        const buttons = extractButtons();
        doc.sections.push({
            title: 'BUTTONS & INTERACTIVE ELEMENTS',
            content: buttons
        });
        
        // 5. CARDS & CONTAINERS
        const cards = extractCards();
        doc.sections.push({
            title: 'CARDS & CONTAINERS',
            content: cards
        });
        
        // 6. SPACING & SIZING
        const spacing = extractSpacing();
        doc.sections.push({
            title: 'SPACING & SIZING',
            content: spacing
        });
        
        // 7. HTML STRUCTURE
        const htmlStructure = extractHTMLStructure();
        doc.sections.push({
            title: 'HTML STRUCTURE',
            content: htmlStructure
        });
        
        // 8. CSS STYLES
        const cssStyles = extractCSSStyles();
        doc.sections.push({
            title: 'IMPORTANT CSS STYLES',
            content: cssStyles
        });
        
        // Format as markdown
        return formatAsMarkdown(doc);
        
        } catch (error) {
            return `# Design Documentation\n\nError: ${error.message}\n\nStack: ${error.stack}`;
        }
    }
    
    function extractColors() {
        const colors = new Set();
        const computedStyles = new Map();
        
        // Get all elements
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
            try {
                const style = window.getComputedStyle(el);
                
                // Background colors
                if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') {
                    colors.add(`Background: ${style.backgroundColor}`);
                }
                
                // Text colors
                if (style.color && style.color !== 'rgba(0, 0, 0, 0)' && style.color !== 'transparent') {
                    colors.add(`Text: ${style.color}`);
                }
                
                // Border colors
                if (style.borderColor && style.borderColor !== 'rgba(0, 0, 0, 0)' && style.borderColor !== 'transparent') {
                    colors.add(`Border: ${style.borderColor}`);
                }
            } catch (e) {
                // Skip elements we can't access
            }
        });
        
        // Extract from inline styles and style tags
        const styleSheets = Array.from(document.styleSheets);
        styleSheets.forEach(sheet => {
            try {
                const rules = sheet.cssRules || sheet.rules;
                if (rules) {
                    Array.from(rules).forEach(rule => {
                        if (rule.style) {
                            if (rule.style.backgroundColor) colors.add(`Background: ${rule.style.backgroundColor}`);
                            if (rule.style.color) colors.add(`Text: ${rule.style.color}`);
                            if (rule.style.borderColor) colors.add(`Border: ${rule.style.borderColor}`);
                        }
                    });
                }
            } catch (e) {
                // Cross-origin stylesheets
            }
        });
        
        // Get inline styles
        allElements.forEach(el => {
            if (el.hasAttribute('style')) {
                const styleText = el.getAttribute('style');
                const colorMatches = styleText.match(/(?:background|color|border)[-a-z]*:\s*([^;]+)/gi);
                if (colorMatches) {
                    colorMatches.forEach(match => colors.add(match));
                }
            }
        });
        
        return Array.from(colors).join('\n');
    }
    
    function extractTypography() {
        const fonts = new Set();
        const textSizes = new Set();
        const weights = new Set();
        
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            try {
                const style = window.getComputedStyle(el);
                
                if (style.fontFamily) {
                    fonts.add(style.fontFamily);
                }
                if (style.fontSize) {
                    textSizes.add(`${el.tagName.toLowerCase()}: ${style.fontSize}`);
                }
                if (style.fontWeight) {
                    weights.add(`${el.tagName.toLowerCase()}: ${style.fontWeight}`);
                }
            } catch (e) {}
        });
        
        return `Font Families Used:\n${Array.from(fonts).join('\n')}\n\nFont Sizes:\n${Array.from(textSizes).slice(0, 20).join('\n')}\n\nFont Weights:\n${Array.from(weights).slice(0, 20).join('\n')}`;
    }
    
    function extractLayout() {
        const layoutInfo = [];
        
        // Get body layout
        const body = document.body;
        if (body) {
            const bodyStyle = window.getComputedStyle(body);
            layoutInfo.push(`Body Layout: ${bodyStyle.display}, flex-direction: ${bodyStyle.flexDirection || 'none'}`);
            layoutInfo.push(`Body Width: ${bodyStyle.width || 'auto'}`);
            layoutInfo.push(`Body Padding: ${bodyStyle.padding || 'none'}`);
        }
        
        // Get main containers
        const containers = document.querySelectorAll('[class*="container"], [class*="wrapper"], [id*="container"], [id*="wrapper"], main, section, header, footer');
        containers.forEach(container => {
            const style = window.getComputedStyle(container);
            layoutInfo.push(`\nContainer: ${container.tagName}${container.className ? '.' + container.className : ''}${container.id ? '#' + container.id : ''}`);
            layoutInfo.push(`  Display: ${style.display}`);
            layoutInfo.push(`  Flex Direction: ${style.flexDirection || 'none'}`);
            layoutInfo.push(`  Width: ${style.width}`);
            layoutInfo.push(`  Max Width: ${style.maxWidth || 'none'}`);
            layoutInfo.push(`  Padding: ${style.padding}`);
            layoutInfo.push(`  Margin: ${style.margin}`);
        });
        
        return layoutInfo.join('\n');
    }
    
    function extractButtons() {
        const buttons = document.querySelectorAll('button, [role="button"], a.button, .btn, [class*="button"]');
        const buttonInfo = [];
        
        buttons.forEach((btn, index) => {
            if (index > 10) return; // Limit to first 10 buttons
            
            const style = window.getComputedStyle(btn);
            const text = btn.textContent.trim().substring(0, 50);
            
            buttonInfo.push(`\nButton ${index + 1}: "${text}"`);
            buttonInfo.push(`  Background: ${style.backgroundColor}`);
            buttonInfo.push(`  Text Color: ${style.color}`);
            buttonInfo.push(`  Border: ${style.border || 'none'}`);
            buttonInfo.push(`  Border Radius: ${style.borderRadius || 'none'}`);
            buttonInfo.push(`  Padding: ${style.padding}`);
            buttonInfo.push(`  Font Size: ${style.fontSize}`);
            buttonInfo.push(`  Font Weight: ${style.fontWeight}`);
            buttonInfo.push(`  Font Family: ${style.fontFamily}`);
            
            // Get hover state if available in stylesheets
            try {
                const styleSheets = Array.from(document.styleSheets);
                styleSheets.forEach(sheet => {
                    try {
                        const rules = sheet.cssRules || sheet.rules;
                        if (rules) {
                            Array.from(rules).forEach(rule => {
                                if (rule.selectorText && rule.selectorText.includes(':hover') && btn.matches(rule.selectorText.replace(':hover', ''))) {
                                    buttonInfo.push(`  Hover Background: ${rule.style.backgroundColor || 'not specified'}`);
                                    buttonInfo.push(`  Hover Text Color: ${rule.style.color || 'not specified'}`);
                                }
                            });
                        }
                    } catch (e) {}
                });
            } catch (e) {}
            
            // Get classes
            if (btn.className) {
                buttonInfo.push(`  Classes: ${btn.className}`);
            }
        });
        
        return buttonInfo.join('\n');
    }
    
    function extractCards() {
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"], .bg-bn-dark, [class*="rounded"]');
        const cardInfo = [];
        
        Array.from(cards).slice(0, 5).forEach((card, index) => {
            const style = window.getComputedStyle(card);
            
            cardInfo.push(`\nCard ${index + 1}:`);
            cardInfo.push(`  Background: ${style.backgroundColor}`);
            cardInfo.push(`  Border: ${style.border || 'none'}`);
            cardInfo.push(`  Border Radius: ${style.borderRadius || 'none'}`);
            cardInfo.push(`  Padding: ${style.padding}`);
            cardInfo.push(`  Margin: ${style.margin}`);
            cardInfo.push(`  Box Shadow: ${style.boxShadow || 'none'}`);
            if (card.className) {
                cardInfo.push(`  Classes: ${card.className}`);
            }
        });
        
        return cardInfo.join('\n');
    }
    
    function extractSpacing() {
        const spacingInfo = [];
        
        // Analyze common spacing patterns
        const elements = document.querySelectorAll('*');
        const paddings = new Set();
        const margins = new Set();
        
        Array.from(elements).slice(0, 50).forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.padding && style.padding !== '0px') {
                paddings.add(style.padding);
            }
            if (style.margin && style.margin !== '0px') {
                margins.add(style.margin);
            }
        });
        
        spacingInfo.push('Common Padding Values:');
        Array.from(paddings).slice(0, 10).forEach(p => spacingInfo.push(`  ${p}`));
        
        spacingInfo.push('\nCommon Margin Values:');
        Array.from(margins).slice(0, 10).forEach(m => spacingInfo.push(`  ${m}`));
        
        return spacingInfo.join('\n');
    }
    
    function extractHTMLStructure() {
        const structure = [];
        
        // Get main structure (limit depth)
        function getStructure(el, depth = 0, maxDepth = 4) {
            if (depth > maxDepth) return '';
            
            const tag = el.tagName.toLowerCase();
            const classes = el.className ? ` class="${el.className}"` : '';
            const id = el.id ? ` id="${el.id}"` : '';
            const indent = '  '.repeat(depth);
            
            let line = `${indent}<${tag}${id}${classes}>`;
            const text = el.textContent?.trim().substring(0, 50);
            if (text && !el.children.length && text) {
                line += ` ${text}`;
            }
            
            let children = '';
            Array.from(el.children).slice(0, 5).forEach(child => {
                children += '\n' + getStructure(child, depth + 1, maxDepth);
            });
            
            if (!children && !text) {
                line += `</${tag}>`;
            } else {
                line += children + (children ? '\n' + indent : '') + `</${tag}>`;
            }
            
            return line;
        }
        
        // Get body structure
        if (document.body) {
            structure.push('Body Structure:');
            structure.push(getStructure(document.body, 0, 3));
        }
        
        return structure.join('\n');
    }
    
    function extractCSSStyles() {
        const cssInfo = [];
        
        // Get inline styles from style tag
        const styleTags = document.querySelectorAll('style');
        styleTags.forEach((tag, index) => {
            cssInfo.push(`\nStyle Tag ${index + 1}:`);
            const content = tag.textContent || tag.innerHTML;
            // Limit to first 2000 chars
            cssInfo.push(content.substring(0, 2000));
            if (content.length > 2000) {
                cssInfo.push('\n... (truncated)');
            }
        });
        
        // Get important computed styles for common elements
        cssInfo.push('\n\nImportant Element Styles:');
        const importantSelectors = ['body', 'button', '.btn', '[class*="card"]', 'header', 'main', 'section'];
        
        importantSelectors.forEach(selector => {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    const style = window.getComputedStyle(el);
                    cssInfo.push(`\n${selector}:`);
                    cssInfo.push(`  background: ${style.backgroundColor}`);
                    cssInfo.push(`  color: ${style.color}`);
                    cssInfo.push(`  font-family: ${style.fontFamily}`);
                    cssInfo.push(`  font-size: ${style.fontSize}`);
                    cssInfo.push(`  padding: ${style.padding}`);
                    cssInfo.push(`  margin: ${style.margin}`);
                    cssInfo.push(`  border-radius: ${style.borderRadius}`);
                }
            } catch (e) {}
        });
        
        return cssInfo.join('\n');
    }
    
    function formatAsMarkdown(doc) {
        let markdown = `# ${doc.title}\n\n`;
        markdown += `**URL:** ${doc.url}\n\n`;
        markdown += `**Generated:** ${doc.timestamp}\n\n`;
        markdown += `---\n\n`;
        
        doc.sections.forEach(section => {
            markdown += `## ${section.title}\n\n`;
            markdown += `${section.content}\n\n`;
            markdown += `---\n\n`;
        });
        
        return markdown;
    }
    
    // Expose function globally - do this BEFORE the IIFE closes
    if (typeof window !== 'undefined') {
        window.generateDesignDocumentation = generateDesignDocumentation;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.generateDesignDocumentation = generateDesignDocumentation;
    }
    
    // Also make it available directly
    if (typeof global !== 'undefined') {
        global.generateDesignDocumentation = generateDesignDocumentation;
    }
})();

