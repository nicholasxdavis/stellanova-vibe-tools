/**
 * BN Vibe Tools - FontGrab Content Script
 * Fixed exit button centering and improved performance
 */

(function() {
    'use strict';
    
    // Prevent multiple instances - but allow re-initialization
    if (window.__BN_FONTGRAB_LOADED && window.__BN_FONTGRAB_INSTANCE) {
        // If already loaded, just update the instance reference
        const existingInstance = window.__BN_FONTGRAB_INSTANCE;
        // Re-enable if needed
        if (existingInstance.isActive) {
            return; // Already active, don't reload
        }
    }
    window.__BN_FONTGRAB_LOADED = true;
    
    let isActive = false;
    let tooltip = null;
    let exitButton = null;
    let currentFontData = null;
    let mouseOverTimer = null;
    let lastElement = null;
    
    function createTooltip() {
        if (tooltip) return tooltip;
        
        tooltip = document.createElement('div');
        tooltip.id = 'bn-whatfont-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            z-index: 2147483645;
            background: #1A1A1A;
            border: 2px solid #d4611c;
            border-radius: 8px;
            padding: 16px;
            color: #f3f4f6;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
            pointer-events: none;
            max-width: 360px;
            display: none;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }
    
    function getFontInfo(element) {
        try {
            if (!element || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'HTML', 'BODY'].includes(element.tagName)) {
                return null;
            }
            
            const text = element.textContent?.trim();
            if (!text || text.length === 0) {
                return null;
            }
            
            const style = window.getComputedStyle(element);
            
            const fontFamily = style.fontFamily;
            const fontSize = style.fontSize;
            const fontWeight = style.fontWeight;
            const fontStyle = style.fontStyle;
            const color = style.color;
            const lineHeight = style.lineHeight;
            const letterSpacing = style.letterSpacing;
            
            const primaryFont = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
            
            let normalizedWeight = fontWeight;
            if (fontWeight === 'normal') normalizedWeight = '400';
            if (fontWeight === 'bold') normalizedWeight = '700';
            
            const sampleText = text.substring(0, 40).trim() || 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqR';
            
            return {
                family: fontFamily,
                primaryFont: primaryFont,
                style: fontStyle,
                weight: normalizedWeight,
                size: fontSize,
                color: color,
                lineHeight: lineHeight,
                letterSpacing: letterSpacing,
                sampleText: sampleText,
                element: element.tagName.toLowerCase()
            };
        } catch (e) {
            return null;
        }
    }
    
    function showTooltip(element, fontData) {
        if (!fontData) return;
        
        const tip = createTooltip();
        const rect = element.getBoundingClientRect();
        
        let hexColor = fontData.color;
        try {
            const match = fontData.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
                hexColor = '#' + [r, g, b].map(x => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }).join('');
            }
        } catch (e) {}
        
        tip.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 12px; color: #d4611c; font-size: 14px;">
                ${fontData.primaryFont} - ${fontData.weight}
            </div>
            <div style="line-height: 1.7; font-size: 11px; margin-bottom: 10px;">
                <div style="margin-bottom: 4px;"><strong style="color: #9ca3af;">Family:</strong> <span style="font-family: 'Courier New', monospace; color: #f3f4f6;">${fontData.family}</span></div>
                <div style="margin-bottom: 4px;"><strong style="color: #9ca3af;">Style:</strong> <span style="font-family: 'Courier New', monospace;">${fontData.style}</span></div>
                <div style="margin-bottom: 4px;"><strong style="color: #9ca3af;">Weight:</strong> <span style="font-family: 'Courier New', monospace;">${fontData.weight}</span></div>
                <div style="margin-bottom: 4px;"><strong style="color: #9ca3af;">Color:</strong> <span style="font-family: 'Courier New', monospace; color: ${fontData.color};">${fontData.color}</span> <span style="display: inline-block; width: 16px; height: 16px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.3); background: ${fontData.color}; vertical-align: middle; margin-left: 4px;"></span></div>
                <div style="margin-bottom: 4px;"><strong style="color: #9ca3af;">Size:</strong> <span style="font-family: 'Courier New', monospace;">${fontData.size}</span></div>
                <div><strong style="color: #9ca3af;">Line Height:</strong> <span style="font-family: 'Courier New', monospace;">${fontData.lineHeight}</span></div>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; font-size: 18px; color: ${fontData.color}; font-family: ${fontData.family}; font-weight: ${fontData.weight}; font-style: ${fontData.style}; line-height: ${fontData.lineHeight}; letter-spacing: ${fontData.letterSpacing};">
                ${fontData.sampleText.substring(0, 35)}
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 10px; color: #d4611c; font-weight: 600;">
                Click to save
            </div>
        `;
        
        const tooltipRect = tip.getBoundingClientRect();
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }
        if (top + tooltipRect.height > window.innerHeight - 10) {
            top = window.innerHeight - tooltipRect.height - 10;
        }
        
        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
        tip.style.display = 'block';
        
        currentFontData = fontData;
    }
    
    function hideTooltip() {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    function createExitButton() {
        const existing = document.getElementById('bn-fontgrab-exit');
        if (existing) {
            existing.remove();
        }
        
        exitButton = document.createElement('button');
        exitButton.id = 'bn-fontgrab-exit';
        exitButton.innerHTML = '<span style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Exit FontGrab</span>';
        exitButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 2147483647;
            background: #d4611c;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 10px 18px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            min-height: 38px;
        `;
        
        exitButton.addEventListener('mouseenter', function() {
            this.style.background = '#e67a35';
            this.style.transform = 'scale(1.05)';
        }, true);
        
        exitButton.addEventListener('mouseleave', function() {
            this.style.background = '#d4611c';
            this.style.transform = 'scale(1)';
        }, true);
        
        exitButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            disableFontGrab();
            chrome.runtime.sendMessage({
                type: 'TOGGLE_FONTGRAB',
                enabled: false
            }).catch(() => {});
            
            return false;
        }, true);
        
        document.body.appendChild(exitButton);
        return exitButton;
    }
    
    function removeExitButton() {
        if (exitButton) {
            exitButton.remove();
            exitButton = null;
        }
        const existing = document.getElementById('bn-fontgrab-exit');
        if (existing) {
            existing.remove();
        }
    }
    
    // Throttled mouse over handler
    let lastMouseOverTime = 0;
    
    function handleMouseOver(e) {
        if (!isActive) return;
        
        const now = Date.now();
        const element = e.target;
        
        if (element === lastElement && now - lastMouseOverTime < 50) {
            return;
        }
        
        lastElement = element;
        lastMouseOverTime = now;
        
        if (mouseOverTimer) {
            clearTimeout(mouseOverTimer);
        }
        
        mouseOverTimer = setTimeout(() => {
            if (element.tagName && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) {
                hideTooltip();
                return;
            }
            
            const fontData = getFontInfo(element);
            if (fontData) {
                showTooltip(element, fontData);
                
                chrome.runtime.sendMessage({
                    type: 'FONTGRAB_DATA',
                    fontData: fontData
                }).catch(() => {});
            } else {
                hideTooltip();
            }
        }, 30);
    }
    
    function handleMouseOut(e) {
        hideTooltip();
        lastElement = null;
    }
    
    function handleClick(e) {
        if (!isActive) return;
        
        // Don't interfere with exit button or tooltip
        if (e.target && (e.target.id === 'bn-fontgrab-exit' || e.target.closest('#bn-whatfont-tooltip'))) {
            return;
        }
        
        const element = e.target;
        const fontData = getFontInfo(element);
        
        // Only process if we have valid font data
        if (!fontData && !currentFontData) {
            return; // Let the click pass through normally - don't interfere
        }
        
        // Block the click only when we're actually saving
        e.preventDefault();
        e.stopPropagation();
        
        if (fontData) {
            currentFontData = fontData;
            
            chrome.runtime.sendMessage({
                type: 'SAVE_FONT',
                fontData: fontData
            }).catch(() => {});
            
            if (tooltip) {
                const originalHTML = tooltip.innerHTML;
                tooltip.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 12px; color: #10b981; font-size: 16px; text-align: center;">
                        <i class="fas fa-check-circle" style="margin-right: 8px;"></i>Font Saved!
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #9ca3af; margin-bottom: 8px;">
                        ${fontData.primaryFont} - ${fontData.weight}
                    </div>
                    <div style="text-align: center; font-size: 11px; color: #6b7280;">
                        Saved to your collection
                    </div>
                `;
                
                // Auto-close after showing feedback
                setTimeout(() => {
                    disableFontGrab();
                    chrome.runtime.sendMessage({
                        type: 'TOGGLE_FONTGRAB',
                        enabled: false
                    }).catch(() => {});
                }, 1500);
            }
        } else if (currentFontData) {
            chrome.runtime.sendMessage({
                type: 'SAVE_FONT',
                fontData: currentFontData
            }).catch(() => {});
            
            if (tooltip) {
                const originalHTML = tooltip.innerHTML;
                tooltip.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 12px; color: #10b981; font-size: 16px; text-align: center;">
                        <i class="fas fa-check-circle" style="margin-right: 8px;"></i>Font Saved!
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #9ca3af;">
                        ${currentFontData.primaryFont} - ${currentFontData.weight}
                    </div>
                `;
                
                // Auto-close after showing feedback
                setTimeout(() => {
                    disableFontGrab();
                    chrome.runtime.sendMessage({
                        type: 'TOGGLE_FONTGRAB',
                        enabled: false
                    }).catch(() => {});
                }, 1500);
            }
        }
    }
    
    function enableFontGrab() {
        if (isActive) {
            if (exitButton) exitButton.style.display = 'flex';
            return;
        }
        
        isActive = true;
        
        createTooltip();
        createExitButton();
        
        document.addEventListener('mouseover', handleMouseOver, { passive: true, capture: false });
        document.addEventListener('mouseout', handleMouseOut, { passive: true, capture: false });
        document.addEventListener('click', handleClick, { capture: false, passive: false });
        
        document.body.style.cursor = 'crosshair';
    }
    
    function disableFontGrab() {
        if (!isActive) return;
        
        isActive = false;
        
        if (mouseOverTimer) {
            clearTimeout(mouseOverTimer);
            mouseOverTimer = null;
        }
        
        // Remove all event listeners
        try {
            document.removeEventListener('mouseover', handleMouseOver, { capture: false });
            document.removeEventListener('mouseout', handleMouseOut, { capture: false });
            document.removeEventListener('click', handleClick, { capture: false });
        } catch (e) {
            // Fallback if removeEventListener fails
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('click', handleClick);
        }
        
        hideTooltip();
        document.body.style.cursor = '';
        removeExitButton();
        
        lastElement = null;
        
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
    
    // Listen for toggle messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message && (message.type === 'TOGGLE_FONTGRAB' || message.type === 'TOGGLE_WHATFONT')) {
            try {
                if (message.enabled) {
                    enableFontGrab();
                } else {
                    disableFontGrab();
                }
                // Send response synchronously
                sendResponse({ success: true });
            } catch (e) {
                sendResponse({ success: false, error: e.message });
            }
            return true; // Indicate we will send response
        }
        return false; // Not handled
    });
    
    // Store instance reference
    window.__BN_FONTGRAB_INSTANCE = {
        isActive: () => isActive,
        enable: enableFontGrab,
        disable: disableFontGrab
    };
    
    window.enableFontGrab = enableFontGrab;
    window.disableFontGrab = disableFontGrab;
})();
