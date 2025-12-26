/**
 * BN Vibe Tools - ColorPick Content Script
 * Fixed message handling and proper initialization
 */

(function() {
    'use strict';
    
    // Prevent multiple instances - but allow re-initialization
    if (window.__BN_COLORPICK_LOADED && window.__BN_COLORPICK_INSTANCE) {
        // If already loaded, just update the instance reference
        const existingInstance = window.__BN_COLORPICK_INSTANCE;
        // Re-enable if needed
        if (existingInstance.isActive) {
            return; // Already active, don't reload
        }
    }
    window.__BN_COLORPICK_LOADED = true;
    
    let isActive = false;
    let cursor = null;
    let tooltip = null;
    let exitButton = null;
    let currentColorData = null;
    let isPicking = false;
    
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }
    
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // Get actual pixel color - improved detection that walks up the DOM tree
    function getPixelColorAtPoint(x, y) {
        try {
            const element = document.elementFromPoint(x, y);
            if (!element || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) {
                return null;
            }
            
            // For images, get actual pixel color from canvas
            if (element.tagName === 'IMG' && element.complete) {
                try {
                    const imgCanvas = document.createElement('canvas');
                    const imgCtx = imgCanvas.getContext('2d');
                    imgCanvas.width = element.naturalWidth || element.width;
                    imgCanvas.height = element.naturalHeight || element.height;
                    imgCtx.drawImage(element, 0, 0);
                    
                    const rect = element.getBoundingClientRect();
                    const scaleX = imgCanvas.width / rect.width;
                    const scaleY = imgCanvas.height / rect.height;
                    const pixelX = Math.floor((x - rect.left) * scaleX);
                    const pixelY = Math.floor((y - rect.top) * scaleY);
                    
                    if (pixelX >= 0 && pixelX < imgCanvas.width && pixelY >= 0 && pixelY < imgCanvas.height) {
                        const imageData = imgCtx.getImageData(pixelX, pixelY, 1, 1);
                        const [r, g, b, a] = imageData.data;
                        if (a > 0) {
                            return {
                                r: r,
                                g: g,
                                b: b,
                                a: a / 255,
                                hex: rgbToHex(r, g, b),
                                rgb: `rgb(${r}, ${g}, ${b})`,
                                rgba: `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`,
                                source: 'image-pixel'
                            };
                        }
                    }
                } catch (e) {
                    // Fall through
                }
            }
            
            // Walk up the DOM tree to find the actual color
            let currentEl = element;
            let maxDepth = 10; // Prevent infinite loops
            let depth = 0;
            let foundColor = null;
            
            while (currentEl && depth < maxDepth) {
                // Skip body/html unless we're actually on them
                if (depth > 0 && (currentEl.tagName === 'BODY' || currentEl.tagName === 'HTML')) {
                    // Only use body/html if we found nothing else and it's not white
                    if (foundColor) break;
                }
                
                const style = window.getComputedStyle(currentEl);
                const rect = currentEl.getBoundingClientRect();
                
                // Check if point is within this element
                const relX = x - rect.left;
                const relY = y - rect.top;
                
                if (relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height) {
                    // Try background color first (most common)
                    let bgColor = style.backgroundColor;
                    
                    // Handle named colors
                    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent' && bgColor !== 'initial' && bgColor !== 'inherit') {
                        // Convert named colors to RGB
                        if (!bgColor.match(/^rgba?\(/)) {
                            const tempDiv = document.createElement('div');
                            tempDiv.style.color = bgColor;
                            document.body.appendChild(tempDiv);
                            bgColor = window.getComputedStyle(tempDiv).color;
                            document.body.removeChild(tempDiv);
                        }
                        
                        const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                        if (match) {
                            const r = parseInt(match[1]);
                            const g = parseInt(match[2]);
                            const b = parseInt(match[3]);
                            const a = match[4] ? parseFloat(match[4]) : 1;
                            
                            // Return any valid non-transparent color
                            // Skip pure white from body/html unless it's the actual element
                            if (a > 0.1) {
                                const isWhite = (r === 255 && g === 255 && b === 255);
                                const isBodyHtml = (currentEl.tagName === 'BODY' || currentEl.tagName === 'HTML');
                                
                                // If it's white from body/html and we're not directly on it, skip it
                                if (isWhite && isBodyHtml && depth > 0) {
                                    // Continue searching
                                } else {
                                    // Return this color
                                    return {
                                        r: r,
                                        g: g,
                                        b: b,
                                        a: a,
                                        hex: rgbToHex(r, g, b),
                                        rgb: `rgb(${r}, ${g}, ${b})`,
                                        rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
                                        source: 'background'
                                    };
                                }
                            }
                        }
                    }
                    
                    // Try border color if background is transparent
                    let borderColor = style.borderColor;
                    if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent' && borderColor !== 'initial') {
                        if (!borderColor.match(/^rgba?\(/)) {
                            const tempDiv = document.createElement('div');
                            tempDiv.style.color = borderColor;
                            document.body.appendChild(tempDiv);
                            borderColor = window.getComputedStyle(tempDiv).color;
                            document.body.removeChild(tempDiv);
                        }
                        
                        const match = borderColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                        if (match) {
                            const r = parseInt(match[1]);
                            const g = parseInt(match[2]);
                            const b = parseInt(match[3]);
                            const a = match[4] ? parseFloat(match[4]) : 1;
                            
                            if (a > 0.1) {
                                return {
                                    r: r,
                                    g: g,
                                    b: b,
                                    a: a,
                                    hex: rgbToHex(r, g, b),
                                    rgb: `rgb(${r}, ${g}, ${b})`,
                                    rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
                                    source: 'border'
                                };
                            }
                        }
                    }
                    
                    // Try text color as last resort
                    let textColor = style.color;
                    if (textColor && textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent' && textColor !== 'initial') {
                        if (!textColor.match(/^rgba?\(/)) {
                            const tempDiv = document.createElement('div');
                            tempDiv.style.color = textColor;
                            document.body.appendChild(tempDiv);
                            textColor = window.getComputedStyle(tempDiv).color;
                            document.body.removeChild(tempDiv);
                        }
                        
                        const match = textColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                        if (match) {
                            const r = parseInt(match[1]);
                            const g = parseInt(match[2]);
                            const b = parseInt(match[3]);
                            const a = match[4] ? parseFloat(match[4]) : 1;
                            
                            if (a > 0.1) {
                                return {
                                    r: r,
                                    g: g,
                                    b: b,
                                    a: a,
                                    hex: rgbToHex(r, g, b),
                                    rgb: `rgb(${r}, ${g}, ${b})`,
                                    rgba: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
                                    source: 'text'
                                };
                            }
                        }
                    }
                }
                
                // Move to parent element
                currentEl = currentEl.parentElement;
                depth++;
            }
            
            return null;
        } catch (e) {
            return null;
        }
    }
    
    function createCursor() {
        if (cursor) return cursor;
        
        cursor = document.createElement('div');
        cursor.id = 'bn-colorpick-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 28px;
            height: 28px;
            border: 3px solid #fff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 2147483645;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6), 0 0 0 3px rgba(212,97,28,0.3);
            display: none;
            transform: translate(-50%, -50%);
            transition: background-color 0.1s ease;
        `;
        document.body.appendChild(cursor);
        return cursor;
    }
    
    function createExitButton() {
        const existing = document.getElementById('bn-colorpick-exit');
        if (existing) {
            existing.remove();
        }
        
        exitButton = document.createElement('button');
        exitButton.id = 'bn-colorpick-exit';
        exitButton.textContent = 'Exit ColorPick';
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
            
            disableColorPick();
            chrome.runtime.sendMessage({
                type: 'TOGGLE_COLORPICK',
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
        const existing = document.getElementById('bn-colorpick-exit');
        if (existing) {
            existing.remove();
        }
    }
    
    function createTooltip() {
        if (tooltip) return tooltip;
        
        tooltip = document.createElement('div');
        tooltip.id = 'bn-colorpick-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            z-index: 2147483646;
            background: #1A1A1A;
            border: 2px solid #d4611c;
            border-radius: 8px;
            padding: 16px;
            color: #f3f4f6;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
            pointer-events: none;
            min-width: 240px;
            display: none;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }
    
    function showTooltip(x, y, colorData) {
        if (!colorData) return;
        
        const tip = createTooltip();
        
        tip.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 12px; color: #d4611c; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-eye-dropper" style="font-size: 14px;"></i>
                Pixel Color
            </div>
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
                <div style="width: 60px; height: 60px; border-radius: 10px; border: 3px solid rgba(255,255,255,0.3); background-color: ${colorData.hex}; flex-shrink: 0; box-shadow: inset 0 0 12px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.3);"></div>
                <div style="flex: 1; line-height: 1.8; font-size: 11px;">
                    <div style="margin-bottom: 5px;"><strong style="color: #9ca3af;">HEX:</strong> <span style="font-family: 'Courier New', monospace; color: #d4611c; font-weight: 600; font-size: 12px;">${colorData.hex}</span></div>
                    <div style="margin-bottom: 5px;"><strong style="color: #9ca3af;">RGB:</strong> <span style="font-family: 'Courier New', monospace;">${colorData.rgb}</span></div>
                    <div><strong style="color: #9ca3af;">RGBA:</strong> <span style="font-family: 'Courier New', monospace;">${colorData.rgba}</span></div>
                </div>
            </div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 10px; color: #6b7280; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-info-circle" style="font-size: 10px;"></i>
                Source: <span style="font-family: monospace; text-transform: capitalize; color: #d4611c;">${colorData.source || 'element'}</span>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #d4611c; font-weight: 600; text-align: center;">
                <i class="fas fa-mouse-pointer" style="margin-right: 6px;"></i>Click to save
            </div>
        `;
        
        const tooltipRect = tip.getBoundingClientRect();
        let left = x + 20;
        let top = y - tooltipRect.height - 20;
        
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = x - tooltipRect.width - 20;
        }
        if (left < 10) left = 10;
        if (top < 10) {
            top = y + 20;
        }
        if (top + tooltipRect.height > window.innerHeight - 10) {
            top = window.innerHeight - tooltipRect.height - 10;
        }
        
        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
        tip.style.display = 'block';
        
        currentColorData = colorData;
    }
    
    function hideTooltip() {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    function showSavedFeedback(colorData) {
        if (tooltip) {
            const originalHTML = tooltip.innerHTML;
            tooltip.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 12px; color: #10b981; font-size: 16px; text-align: center;">
                    <i class="fas fa-check-circle" style="margin-right: 8px;"></i>Color Saved!
                </div>
                <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
                    <div style="width: 60px; height: 60px; border-radius: 10px; border: 3px solid rgba(255,255,255,0.3); background-color: ${colorData.hex}; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>
                    <div style="flex: 1; font-size: 12px;">
                        <div><strong style="color: #9ca3af;">HEX:</strong> <span style="font-family: 'Courier New', monospace; color: #10b981; font-weight: 600;">${colorData.hex}</span></div>
                    </div>
                </div>
            `;
            setTimeout(() => {
                if (tooltip && isActive && currentColorData) {
                    showTooltip(window.innerWidth / 2, window.innerHeight / 2, currentColorData);
                }
            }, 1500);
        }
    }
    
    // Use EyeDropper API with our custom UI (like old color picker)
    async function useEyeDropper() {
        try {
            if (!window.EyeDropper) {
                // Fallback mode - show message and enable hover mode
                if (tooltip) {
                    tooltip.innerHTML = `
                        <div style="font-weight: 600; margin-bottom: 12px; color: #d4611c; font-size: 14px; text-align: center;">
                            <i class="fas fa-info-circle" style="margin-right: 8px;"></i>Hover Mode
                        </div>
                        <div style="text-align: center; font-size: 11px; color: #9ca3af;">
                            EyeDropper not available. Hover and click to pick colors.
                        </div>
                    `;
                    tooltip.style.left = '50%';
                    tooltip.style.top = '50%';
                    tooltip.style.transform = 'translate(-50%, -50%)';
                    tooltip.style.display = 'block';
                    setTimeout(() => {
                        if (tooltip) tooltip.style.display = 'none';
                    }, 2000);
                }
                return null;
            }
            
            isPicking = true;
            
            // Show our custom UI while picking
            if (cursor) {
                cursor.style.display = 'block';
                cursor.style.left = '50%';
                cursor.style.top = '50%';
                cursor.style.backgroundColor = '#d4611c';
            }
            
            if (tooltip) {
                tooltip.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 12px; color: #d4611c; font-size: 14px; text-align: center;">
                        <i class="fas fa-eye-dropper" style="margin-right: 8px;"></i>Picking Color...
                    </div>
                    <div style="text-align: center; font-size: 11px; color: #9ca3af;">
                        Move your cursor and click to pick a color
                    </div>
                `;
                tooltip.style.left = '50%';
                tooltip.style.top = '50%';
                tooltip.style.transform = 'translate(-50%, -50%)';
                tooltip.style.display = 'block';
            }
            
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open().catch(() => null);
            
            isPicking = false;
            
            if (result && result.sRGBHex) {
                const hex = result.sRGBHex.toUpperCase();
                const rgb = hexToRgb(hex);
                
                if (!rgb) return null;
                
                const colorData = {
                    r: rgb.r,
                    g: rgb.g,
                    b: rgb.b,
                    a: 1,
                    hex: hex,
                    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
                    source: 'eyedropper'
                };
                
                currentColorData = colorData;
                
                // Update cursor to show picked color
                if (cursor) {
                    cursor.style.backgroundColor = hex;
                }
                
                // Show picked color in our custom tooltip
                showTooltip(window.innerWidth / 2, window.innerHeight / 2, colorData);
                
                // Auto-save like old color picker - send message without waiting for response
                chrome.runtime.sendMessage({
                    type: 'SAVE_COLOR',
                    color: colorData
                }).catch(() => {});
                
                // Show saved feedback
                setTimeout(() => {
                    showSavedFeedback(colorData);
                    
                    // Auto-close after showing feedback
                    setTimeout(() => {
                        disableColorPick();
                        chrome.runtime.sendMessage({
                            type: 'TOGGLE_COLORPICK',
                            enabled: false
                        }).catch(() => {});
                    }, 1500);
                }, 500);
                
                return colorData;
            } else {
                // User cancelled
                if (cursor) cursor.style.display = 'none';
                hideTooltip();
            }
        } catch (err) {
            isPicking = false;
            if (cursor) cursor.style.display = 'none';
            hideTooltip();
        }
        
        return null;
    }
    
    // Fallback mode: hover and click to pick (when EyeDropper not available)
    let lastMouseMoveTime = 0;
    let lastX = -1;
    let lastY = -1;
    const throttleDelay = 50;
    
    function handleMouseMove(e) {
        if (!isActive || isPicking) return;
        
        const now = Date.now();
        const x = e.clientX;
        const y = e.clientY;
        
        if (Math.abs(x - lastX) < 3 && Math.abs(y - lastY) < 3 && now - lastMouseMoveTime < throttleDelay) {
            return;
        }
        
        lastX = x;
        lastY = y;
        lastMouseMoveTime = now;
        
        const colorData = getPixelColorAtPoint(x, y);
        
        if (colorData) {
            if (cursor) {
                cursor.style.left = x + 'px';
                cursor.style.top = y + 'px';
                cursor.style.backgroundColor = colorData.hex;
                cursor.style.display = 'block';
            }
            
            showTooltip(x, y, colorData);
            
            // Send message without waiting for response
            chrome.runtime.sendMessage({
                type: 'COLORPICK_DATA',
                color: colorData
            }).catch(() => {});
        } else {
            if (cursor) cursor.style.display = 'none';
            hideTooltip();
        }
    }
    
    function handleMouseOut(e) {
        if (cursor) cursor.style.display = 'none';
        hideTooltip();
    }
    
    function handleClick(e) {
        if (!isActive || isPicking) return;
        
        // Don't interfere with exit button, tooltip, or cursor
        if (e.target && (e.target.id === 'bn-colorpick-exit' || 
                         e.target.closest('#bn-colorpick-tooltip') ||
                         e.target.id === 'bn-colorpick-cursor')) {
            return;
        }
        
        const colorData = getPixelColorAtPoint(e.clientX, e.clientY);
        if (!colorData) {
            return; // Let the click pass through normally if no color detected
        }
        
        // Block the click only when we're actually saving
        e.preventDefault();
        e.stopPropagation();
        
        if (colorData) {
            currentColorData = colorData;
            
            // Send message without waiting for response
            chrome.runtime.sendMessage({
                type: 'SAVE_COLOR',
                color: colorData
            }).catch(() => {});
            
            showSavedFeedback(colorData);
            
            // Auto-close after showing feedback
            setTimeout(() => {
                disableColorPick();
                chrome.runtime.sendMessage({
                    type: 'TOGGLE_COLORPICK',
                    enabled: false
                }).catch(() => {});
            }, 1500);
        }
    }
    
    function enableColorPick() {
        if (isActive) {
            if (exitButton) exitButton.style.display = 'flex';
            if (cursor) cursor.style.display = 'block';
            return;
        }
        
        isActive = true;
        
        createCursor();
        createTooltip();
        createExitButton();
        
        // Always set up hover mode listeners first
        document.addEventListener('mousemove', handleMouseMove, { passive: true, capture: false });
        document.addEventListener('mouseout', handleMouseOut, { passive: true, capture: false });
        document.addEventListener('click', handleClick, { capture: false, passive: false });
        
        document.body.style.cursor = 'crosshair';
        
        // Show initial tooltip
        if (tooltip) {
            tooltip.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 12px; color: #d4611c; font-size: 14px; text-align: center;">
                    <i class="fas fa-eye-dropper" style="margin-right: 8px;"></i>Color Picker Active
                </div>
                <div style="text-align: center; font-size: 11px; color: #9ca3af;">
                    ${window.EyeDropper ? 'Using browser EyeDropper - click anywhere to pick' : 'Hover and click to pick colors'}
                </div>
            `;
            tooltip.style.left = '50%';
            tooltip.style.top = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            tooltip.style.display = 'block';
            
            setTimeout(() => {
                if (tooltip && isActive) {
                    tooltip.style.display = 'none';
                }
            }, 2000);
        }
        
        // Try EyeDropper API (like old color picker) - but keep hover mode active
        if (window.EyeDropper) {
            // Use EyeDropper in background, but don't block - hover mode is already active
            setTimeout(() => {
                useEyeDropper().catch(() => {
                    // If EyeDropper fails, hover mode is already active
                });
            }, 100);
        }
    }
    
    function disableColorPick() {
        if (!isActive) return;
        
        isActive = false;
        isPicking = false;
        
        // Remove all event listeners
        try {
            document.removeEventListener('mousemove', handleMouseMove, { capture: false });
            document.removeEventListener('mouseout', handleMouseOut, { capture: false });
            document.removeEventListener('click', handleClick, { capture: false });
        } catch (e) {
            // Fallback if removeEventListener fails
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('click', handleClick);
        }
        
        document.body.style.cursor = '';
        hideTooltip();
        removeExitButton();
        
        if (cursor) {
            cursor.style.display = 'none';
        }
        
        currentColorData = null;
    }
    
    // Listen for toggle messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message && message.type === 'TOGGLE_COLORPICK') {
            try {
                if (message.enabled) {
                    enableColorPick();
                } else {
                    disableColorPick();
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
    window.__BN_COLORPICK_INSTANCE = {
        isActive: () => isActive,
        enable: enableColorPick,
        disable: disableColorPick
    };
    
    window.enableColorPick = enableColorPick;
    window.disableColorPick = disableColorPick;
})();
