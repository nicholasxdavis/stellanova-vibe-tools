/**
 * BN Vibe Tools - Screen Ruler Content Script
 * PowerToys-style screen ruler with resize capability
 */

(function() {
    'use strict';
    
    // Prevent multiple instances
    if (window.__BN_SCREENRULER_LOADED) {
        return;
    }
    window.__BN_SCREENRULER_LOADED = true;
    
    let isActive = false;
    let ruler = null;
    let exitButton = null;
    let startPoint = null;
    let endPoint = null;
    let isDragging = false;
    let isResizing = false;
    let resizeHandle = null;
    let currentMode = 'horizontal';
    let snapEnabled = true;
    
    // Create ruler overlay
    function createRuler() {
        if (ruler) return ruler;
        
        ruler = document.createElement('div');
        ruler.id = 'bn-screenruler-ruler';
        ruler.style.cssText = `
            position: fixed;
            z-index: 2147483645;
            background: rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(1px);
            -webkit-backdrop-filter: blur(1px);
            border: 1px dashed rgba(212, 97, 28, 0.7);
            pointer-events: auto;
            display: none;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
            font-family: 'Inter', 'Courier New', monospace;
            font-size: 11px;
            color: #f3f4f6;
            user-select: none;
            cursor: move;
        `;
        
        // Create resize handles
        const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
        handles.forEach(handle => {
            const handleEl = document.createElement('div');
            handleEl.className = `bn-ruler-handle bn-ruler-handle-${handle}`;
            handleEl.style.cssText = `
                position: absolute;
                width: 12px;
                height: 12px;
                background: #d4611c;
                border: 2px solid rgba(0, 0, 0, 0.8);
                border-radius: 50%;
                cursor: ${getCursorForHandle(handle)};
                opacity: 0;
                transition: opacity 0.2s, transform 0.2s;
                z-index: 100;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            `;
            handleEl.addEventListener('mouseenter', () => {
                handleEl.style.opacity = '1';
                handleEl.style.transform = 'scale(1.2)';
            });
            handleEl.addEventListener('mouseleave', () => {
                if (!isResizing) {
                    handleEl.style.opacity = '0';
                    handleEl.style.transform = 'scale(1)';
                }
            });
            ruler.appendChild(handleEl);
        });
        
        // Show handles on hover
        ruler.addEventListener('mouseenter', () => {
            ruler.querySelectorAll('.bn-ruler-handle').forEach(h => {
                h.style.opacity = '0.7';
            });
        });
        
        ruler.addEventListener('mouseleave', () => {
            if (!isResizing) {
                ruler.querySelectorAll('.bn-ruler-handle').forEach(h => {
                    h.style.opacity = '0';
                });
            }
        });
        
        document.body.appendChild(ruler);
        return ruler;
    }
    
    function getCursorForHandle(handle) {
        const cursors = {
            'nw': 'nw-resize',
            'ne': 'ne-resize',
            'sw': 'sw-resize',
            'se': 'se-resize',
            'n': 'n-resize',
            's': 's-resize',
            'e': 'e-resize',
            'w': 'w-resize'
        };
        return cursors[handle] || 'default';
    }
    
    function positionResizeHandles() {
        if (!ruler || !startPoint || !endPoint) return;
        
        const left = Math.min(startPoint.x, endPoint.x);
        const top = Math.min(startPoint.y, endPoint.y);
        const width = Math.abs(endPoint.x - startPoint.x);
        const height = Math.abs(endPoint.y - startPoint.y);
        
        const handles = {
            'nw': { left: 0, top: 0 },
            'ne': { left: width, top: 0 },
            'sw': { left: 0, top: height },
            'se': { left: width, top: height },
            'n': { left: width / 2, top: 0 },
            's': { left: width / 2, top: height },
            'e': { left: width, top: height / 2 },
            'w': { left: 0, top: height / 2 }
        };
        
        Object.keys(handles).forEach(handle => {
            const handleEl = ruler.querySelector(`.bn-ruler-handle-${handle}`);
            if (handleEl) {
                handleEl.style.left = (handles[handle].left - 6) + 'px';
                handleEl.style.top = (handles[handle].top - 6) + 'px';
            }
        });
    }
    
    function createExitButton() {
        const existing = document.getElementById('bn-screenruler-exit');
        if (existing) {
            existing.remove();
        }
        
        exitButton = document.createElement('button');
        exitButton.id = 'bn-screenruler-exit';
        exitButton.innerHTML = '<span style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Exit Screen Ruler</span>';
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
            
            disableScreenRuler();
            chrome.runtime.sendMessage({
                type: 'TOGGLE_SCREENRULER',
                enabled: false
            }).catch(() => {});
        }, true);
        
        document.body.appendChild(exitButton);
        return exitButton;
    }
    
    function removeExitButton() {
        if (exitButton) {
            exitButton.remove();
            exitButton = null;
        }
        const existing = document.getElementById('bn-screenruler-exit');
        if (existing) {
            existing.remove();
        }
    }
    
    function snapToElement(x, y) {
        if (!snapEnabled) return { x, y };
        
        const snapDistance = 8;
        const element = document.elementFromPoint(x, y);
        if (!element || element === document.body || element === document.documentElement) {
            return { x, y };
        }
        
        const rect = element.getBoundingClientRect();
        const snapPoints = [
            { x: rect.left, y: y },
            { x: rect.right, y: y },
            { x: x, y: rect.top },
            { x: x, y: rect.bottom },
            { x: rect.left, y: rect.top },
            { x: rect.right, y: rect.top },
            { x: rect.left, y: rect.bottom },
            { x: rect.right, y: rect.bottom }
        ];
        
        for (const point of snapPoints) {
            const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
            if (distance < snapDistance) {
                return point;
            }
        }
        
        return { x, y };
    }
    
    function calculateDistance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    
    function calculateAngle(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    }
    
    function updateRuler() {
        if (!ruler || !startPoint || !endPoint) return;
        
        const distance = calculateDistance(startPoint, endPoint);
        const angle = calculateAngle(startPoint, endPoint);
        
        const left = Math.min(startPoint.x, endPoint.x);
        const top = Math.min(startPoint.y, endPoint.y);
        const width = Math.abs(endPoint.x - startPoint.x);
        const height = Math.abs(endPoint.y - startPoint.y);
        
        // Auto-detect mode
        if (width > height * 2) {
            currentMode = 'horizontal';
        } else if (height > width * 2) {
            currentMode = 'vertical';
        } else {
            currentMode = 'diagonal';
        }
        
        // Position ruler
        ruler.style.left = left + 'px';
        ruler.style.top = top + 'px';
        ruler.style.width = Math.max(width, 50) + 'px';
        ruler.style.height = Math.max(height, 50) + 'px';
        
        // Update measurement text
        let measurementText;
        let fullMeasurementText; // For copying
        if (currentMode === 'diagonal') {
            const angleText = `${Math.round(distance)} px @ ${Math.round(angle)}°`;
            const dimensionsText = `${Math.round(width)} px x ${Math.round(height)} px`;
            measurementText = `${angleText}<br>${dimensionsText}`;
            fullMeasurementText = `${angleText} | ${dimensionsText}`;
        } else if (currentMode === 'vertical' && width > 150) {
            // Show both width and height when measuring height but width is significant
            measurementText = `${Math.round(width)} px x ${Math.round(height)} px`;
            fullMeasurementText = measurementText;
        } else if (currentMode === 'horizontal' && height > 60) {
            // Show both width and height when measuring width but height is significant
            measurementText = `${Math.round(width)} px x ${Math.round(height)} px`;
            fullMeasurementText = measurementText;
        } else {
            // Default: show just the primary measurement
            measurementText = `${Math.round(distance)} px`;
            fullMeasurementText = measurementText;
        }
        
        // Create measurement display
        const existingText = ruler.querySelector('.bn-ruler-measurement');
        if (existingText) {
            existingText.remove();
        }
        
        const measurement = document.createElement('div');
        measurement.className = 'bn-ruler-measurement';
        measurement.innerHTML = measurementText;
        measurement.dataset.measurement = fullMeasurementText;
        measurement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(212, 97, 28, 0.3);
            backdrop-filter: blur(0.1px);
            -webkit-backdrop-filter: blur(0.1px);
            padding: 6px 12px;
            border-radius: 6px;
            font-weight: 600;
            white-space: normal;
            text-align: center;
            line-height: 1.4;
            pointer-events: auto;
            cursor: pointer;
            border: 1px dashed rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            font-size: 12px;
            letter-spacing: 0.5px;
            transition: all 0.2s;
            z-index: 1000;
        `;
        
        // Hover effect
        measurement.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(212, 97, 28, 1)';
            this.style.transform = 'translate(-50%, -50%) scale(1.05)';
            this.textContent = 'Copy';
        });
        
        measurement.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(212, 97, 28, 0.9)';
            this.style.transform = 'translate(-50%, -50%) scale(1)';
            this.innerHTML = measurementText;
        });
        
        // Click to copy
        measurement.addEventListener('click', async function(e) {
            e.stopPropagation();
            const textToCopy = this.dataset.measurement;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Show feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.background = '#000';
                this.style.color = '#fff';
                
                setTimeout(() => {
                    this.textContent = this.dataset.measurement;
                    this.style.background = 'rgba(212, 97, 28, 0.9)';
                    this.style.color = '#f3f4f6';
                }, 1000);
                
                // Also send message to show feedback in extension
                chrome.runtime.sendMessage({
                    type: 'LOG_MESSAGE',
                    message: `Copied: ${textToCopy}`,
                    level: 'success'
                }).catch(() => {});
            } catch (err) {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                // Show feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.background = '#000';
                this.style.color = '#fff';
                
                setTimeout(() => {
                    this.textContent = this.dataset.measurement;
                    this.style.background = 'rgba(212, 97, 28, 0.9)';
                    this.style.color = '#f3f4f6';
                }, 1000);
            }
        });
        
        ruler.appendChild(measurement);
        
        // Position resize handles
        positionResizeHandles();
        
        // Draw measurement line
        const existingLine = ruler.querySelector('.bn-ruler-line:not(.bn-ruler-line-secondary)');
        if (existingLine) {
            existingLine.remove();
        }
        
        // Remove any existing secondary lines
        const existingSecondaryLines = ruler.querySelectorAll('.bn-ruler-line-secondary');
        existingSecondaryLines.forEach(line => line.remove());
        
        const line = document.createElement('div');
        line.className = 'bn-ruler-line';
        line.style.cssText = `
            position: absolute;
            background: repeating-linear-gradient(
                to right,
                #d4611c 0px,
                #d4611c 6px,
                transparent 6px,
                transparent 12px
            );
            opacity: 0.9;
            pointer-events: none;
            box-shadow: 0 0 4px rgba(212, 97, 28, 0.4);
            z-index: 1;
        `;
        
        if (currentMode === 'horizontal') {
            // Horizontal line - always centered vertically
            line.style.left = '0';
            line.style.top = '50%';
            line.style.width = width + 'px';
            line.style.height = '2px';
            line.style.transform = 'translateY(-50%)';
            line.style.transformOrigin = '0 50%';
            
            // If height is significant, also draw vertical line
            if (height > 60) {
                const verticalLine = document.createElement('div');
                verticalLine.className = 'bn-ruler-line bn-ruler-line-secondary';
                verticalLine.style.cssText = `
                    position: absolute;
                    left: 50%;
                    top: 0;
                    width: 2px;
                    height: ${height}px;
                    transform: translateX(-50%);
                    background: repeating-linear-gradient(
                        to bottom,
                        #d4611c 0px,
                        #d4611c 6px,
                        transparent 6px,
                        transparent 12px
                    );
                    opacity: 0.9;
                    pointer-events: none;
                    box-shadow: 0 0 4px rgba(212, 97, 28, 0.4);
                    z-index: 1;
                `;
                ruler.appendChild(verticalLine);
            }
        } else if (currentMode === 'vertical') {
            // Vertical line - always centered horizontally
            line.style.left = '50%';
            line.style.top = '0';
            line.style.width = '2px';
            line.style.height = height + 'px';
            line.style.transform = 'translateX(-50%)';
            line.style.transformOrigin = '50% 0';
            line.style.background = `repeating-linear-gradient(
                to bottom,
                #d4611c 0px,
                #d4611c 6px,
                transparent 6px,
                transparent 12px
            )`;
            
            // If width is significant, also draw horizontal line
            if (width > 150) {
                const horizontalLine = document.createElement('div');
                horizontalLine.className = 'bn-ruler-line bn-ruler-line-secondary';
                horizontalLine.style.cssText = `
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: ${width}px;
                    height: 2px;
                    transform: translateY(-50%);
                    background: repeating-linear-gradient(
                        to right,
                        #d4611c 0px,
                        #d4611c 6px,
                        transparent 6px,
                        transparent 12px
                    );
                    opacity: 0.9;
                    pointer-events: none;
                    box-shadow: 0 0 4px rgba(212, 97, 28, 0.4);
                    z-index: 1;
                `;
                ruler.appendChild(horizontalLine);
            }
        } else {
            // Diagonal - draw from center to center
            const centerX = width / 2;
            const centerY = height / 2;
            
            // Calculate the line from the actual start and end points relative to ruler
            const relStartX = startPoint.x - left;
            const relStartY = startPoint.y - top;
            const relEndX = endPoint.x - left;
            const relEndY = endPoint.y - top;
            
            // Find the actual center point of the line segment
            const lineCenterX = (relStartX + relEndX) / 2;
            const lineCenterY = (relStartY + relEndY) / 2;
            
            // Calculate the angle from the actual points
            const actualAngle = Math.atan2(relEndY - relStartY, relEndX - relStartX) * (180 / Math.PI);
            
            line.style.left = lineCenterX + 'px';
            line.style.top = lineCenterY + 'px';
            line.style.width = distance + 'px';
            line.style.height = '2px';
            line.style.transform = `translate(-50%, -50%) rotate(${actualAngle}deg)`;
            line.style.transformOrigin = '50% 50%';
        }
        
        ruler.appendChild(line);
    }
    
    function handleMouseDown(e) {
        if (!isActive) return;
        if (e.target && (e.target.id === 'bn-screenruler-exit' || e.target.closest('#bn-screenruler-exit'))) return;
        
        // Check if clicking on resize handle
        const handle = e.target.closest('.bn-ruler-handle');
        if (handle && ruler && startPoint && endPoint) {
            isResizing = true;
            resizeHandle = handle.className.match(/bn-ruler-handle-(\w+)/)[1];
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        
        // Check if clicking on ruler to move it
        if (e.target && e.target.closest('#bn-screenruler-ruler') && startPoint && endPoint) {
            const rulerRect = ruler.getBoundingClientRect();
            const offsetX = e.clientX - rulerRect.left;
            const offsetY = e.clientY - rulerRect.top;
            
            // Start moving the ruler
            const moveHandler = (moveE) => {
                const snapped = snapToElement(moveE.clientX - offsetX + (endPoint.x - startPoint.x) / 2, 
                                             moveE.clientY - offsetY + (endPoint.y - startPoint.y) / 2);
                const dx = snapped.x - (startPoint.x + endPoint.x) / 2;
                const dy = snapped.y - (startPoint.y + endPoint.y) / 2;
                
                startPoint.x += dx;
                startPoint.y += dy;
                endPoint.x += dx;
                endPoint.y += dy;
                
                updateRuler();
            };
            
            const upHandler = () => {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            };
            
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        
        // Start new measurement
        if (e.target && !e.target.closest('#bn-screenruler-ruler')) {
            const snapped = snapToElement(e.clientX, e.clientY);
            startPoint = { x: snapped.x, y: snapped.y };
            endPoint = { x: snapped.x, y: snapped.y };
            isDragging = true;
            
            updateRuler();
            if (ruler) ruler.style.display = 'block';
        }
    }
    
    function handleMouseMove(e) {
        if (!isActive) return;
        
        if (isResizing && resizeHandle && startPoint && endPoint) {
            const snapped = snapToElement(e.clientX, e.clientY);
            
            switch(resizeHandle) {
                case 'nw':
                    startPoint = snapped;
                    break;
                case 'ne':
                    startPoint.y = snapped.y;
                    endPoint.x = snapped.x;
                    break;
                case 'sw':
                    startPoint.x = snapped.x;
                    endPoint.y = snapped.y;
                    break;
                case 'se':
                    endPoint = snapped;
                    break;
                case 'n':
                    startPoint.y = snapped.y;
                    break;
                case 's':
                    endPoint.y = snapped.y;
                    break;
                case 'e':
                    endPoint.x = snapped.x;
                    break;
                case 'w':
                    startPoint.x = snapped.x;
                    break;
            }
            
            updateRuler();
        } else if (isDragging && startPoint) {
            const snapped = snapToElement(e.clientX, e.clientY);
            endPoint = { x: snapped.x, y: snapped.y };
            updateRuler();
        }
    }
    
    function handleMouseUp(e) {
        if (!isActive) return;
        isDragging = false;
        isResizing = false;
        resizeHandle = null;
        
        // Hide handles when not interacting
        if (ruler) {
            ruler.querySelectorAll('.bn-ruler-handle').forEach(h => {
                h.style.opacity = '0';
            });
        }
    }
    
    function handleKeyDown(e) {
        if (!isActive) return;
        
        if (e.key === 'h' || e.key === 'H') {
            currentMode = 'horizontal';
            if (startPoint && endPoint) updateRuler();
        } else if (e.key === 'v' || e.key === 'V') {
            currentMode = 'vertical';
            if (startPoint && endPoint) updateRuler();
        } else if (e.key === 'd' || e.key === 'D') {
            currentMode = 'diagonal';
            if (startPoint && endPoint) updateRuler();
        } else if (e.key === 's' || e.key === 'S') {
            snapEnabled = !snapEnabled;
            if (startPoint && endPoint) {
                const snapped = snapToElement(endPoint.x, endPoint.y);
                endPoint = snapped;
                updateRuler();
            }
        } else if (e.key === 'Escape') {
            disableScreenRuler();
            chrome.runtime.sendMessage({
                type: 'TOGGLE_SCREENRULER',
                enabled: false
            }).catch(() => {});
        }
    }
    
    function enableScreenRuler() {
        if (isActive) {
            if (exitButton) exitButton.style.display = 'flex';
            return;
        }
        
        isActive = true;
        
        createRuler();
        createExitButton();
        
        document.addEventListener('mousedown', handleMouseDown, { capture: true });
        document.addEventListener('mousemove', handleMouseMove, { capture: true });
        document.addEventListener('mouseup', handleMouseUp, { capture: true });
        document.addEventListener('keydown', handleKeyDown, { capture: true });
        
        document.body.style.cursor = 'crosshair';
    }
    
    function disableScreenRuler() {
        if (!isActive) return;
        
        isActive = false;
        isDragging = false;
        isResizing = false;
        resizeHandle = null;
        
        document.removeEventListener('mousedown', handleMouseDown, { capture: true });
        document.removeEventListener('mousemove', handleMouseMove, { capture: true });
        document.removeEventListener('mouseup', handleMouseUp, { capture: true });
        document.removeEventListener('keydown', handleKeyDown, { capture: true });
        
        document.body.style.cursor = '';
        removeExitButton();
        
        if (ruler) {
            ruler.style.display = 'none';
        }
        
        startPoint = null;
        endPoint = null;
    }
    
    // Listen for toggle messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message && message.type === 'TOGGLE_SCREENRULER') {
            try {
                if (message.enabled) {
                    enableScreenRuler();
                } else {
                    disableScreenRuler();
                }
                sendResponse({ success: true });
                return true;
            } catch (e) {
                sendResponse({ success: false, error: e.message });
                return true;
            }
        }
        return false;
    });
    
    window.enableScreenRuler = enableScreenRuler;
    window.disableScreenRuler = disableScreenRuler;
})();
