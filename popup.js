;(function($, _) {
    'use strict';
    const popupStyle = document.createElement('style');
    popupStyle.textContent = `
        .bn-custom-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            backdrop-filter: blur(4px);
        }
        
        .bn-custom-popup-container {
            background-color: #000000;
            color: #f3f4f6;
            border-radius: 12px;
            padding: 20px;
            width: 90%;
            max-width: 360px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(212, 97, 28, 0.1);
            animation: bnFadeIn 0.3s ease-out;
            border: 1px solid rgba(212, 97, 28, 0.2);
            font-family: 'Inter', sans-serif;
        }
        
        .bn-custom-popup-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 12px;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .bn-custom-popup-title i {
            color: #d4611c;
            font-size: 14px;
        }
        
        .bn-custom-popup-message {
            font-size: 13px;
            margin-bottom: 20px;
            line-height: 1.5;
            color: #d1d5db;
            word-wrap: break-word;
        }
        
        .bn-custom-popup-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
        
        .bn-custom-popup-button {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            font-size: 13px;
            transition: all 0.2s ease;
            font-family: 'Inter', sans-serif;
        }
        
        .bn-custom-popup-button-cancel {
            background-color: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
        }
        
        .bn-custom-popup-button-cancel:hover {
            background-color: rgba(255, 255, 255, 0.15);
            color: #ffffff;
        }
        
        .bn-custom-popup-button-confirm {
            background-color: #d4611c;
            color: white;
        }
        
        .bn-custom-popup-button-confirm:hover {
            background-color: #e67a35;
        }
        
        .bn-custom-popup-button-close {
            background-color: #d4611c;
            color: white;
        }
        
        .bn-custom-popup-button-close:hover {
            background-color: #e67a35;
        }
        
        .bn-custom-popup-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background-color: #000000;
            color: #ffffff;
            font-size: 13px;
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }
        
        .bn-custom-popup-input:focus {
            outline: none;
            border-color: #d4611c;
            box-shadow: 0 0 0 2px rgba(212, 97, 28, 0.2);
        }
        
        @keyframes bnFadeIn {
            from { 
                opacity: 0; 
                transform: translateY(-10px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
    `;
    document.head.appendChild(popupStyle);

    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    window.alert = function(message) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'bn-custom-popup-overlay';
            
            const container = document.createElement('div');
            container.className = 'bn-custom-popup-container';
            
            const title = document.createElement('div');
            title.className = 'bn-custom-popup-title';
            title.innerHTML = '<i class="fas fa-info-circle"></i><span>Alert</span>';
            
            const msg = document.createElement('div');
            msg.className = 'bn-custom-popup-message';
            msg.textContent = message;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'bn-custom-popup-buttons';
            
            const closeButton = document.createElement('button');
            closeButton.className = 'bn-custom-popup-button bn-custom-popup-button-close';
            closeButton.textContent = 'OK';
            closeButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve();
            });
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve();
                }
            });
            
            buttonContainer.appendChild(closeButton);
            container.appendChild(title);
            container.appendChild(msg);
            container.appendChild(buttonContainer);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
        });
    };

    window.confirm = function(message) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'bn-custom-popup-overlay';
            
            const container = document.createElement('div');
            container.className = 'bn-custom-popup-container';
            
            const title = document.createElement('div');
            title.className = 'bn-custom-popup-title';
            title.innerHTML = '<i class="fas fa-question-circle"></i><span>Confirm</span>';
            
            const msg = document.createElement('div');
            msg.className = 'bn-custom-popup-message';
            msg.textContent = message;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'bn-custom-popup-buttons';
            
            const cancelButton = document.createElement('button');
            cancelButton.className = 'bn-custom-popup-button bn-custom-popup-button-cancel';
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(false);
            });
            
            const confirmButton = document.createElement('button');
            confirmButton.className = 'bn-custom-popup-button bn-custom-popup-button-confirm';
            confirmButton.textContent = 'OK';
            confirmButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(true);
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            });
            
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(confirmButton);
            container.appendChild(title);
            container.appendChild(msg);
            container.appendChild(buttonContainer);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
        });
    };

    window.prompt = function(message, defaultValue = '') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'bn-custom-popup-overlay';
            
            const container = document.createElement('div');
            container.className = 'bn-custom-popup-container';
            
            const title = document.createElement('div');
            title.className = 'bn-custom-popup-title';
            title.innerHTML = '<i class="fas fa-keyboard"></i><span>Prompt</span>';
            
            const msg = document.createElement('div');
            msg.className = 'bn-custom-popup-message';
            msg.textContent = message;
            
            const input = document.createElement('input');
            input.className = 'bn-custom-popup-input';
            input.type = 'text';
            input.value = defaultValue;
            input.autofocus = true;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'bn-custom-popup-buttons';
            
            const cancelButton = document.createElement('button');
            cancelButton.className = 'bn-custom-popup-button bn-custom-popup-button-cancel';
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(null);
            });
            
            const confirmButton = document.createElement('button');
            confirmButton.className = 'bn-custom-popup-button bn-custom-popup-button-confirm';
            confirmButton.textContent = 'OK';
            confirmButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(input.value);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.body.removeChild(overlay);
                    resolve(input.value);
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(overlay);
                    resolve(null);
                }
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(null);
                }
            });
            
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(confirmButton);
            container.appendChild(title);
            container.appendChild(msg);
            container.appendChild(input);
            container.appendChild(buttonContainer);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
            
            setTimeout(() => input.focus(), 10);
        });
    };

    window._original = {
        alert: originalAlert,
        confirm: originalConfirm,
        prompt: originalPrompt
    };

    const $scrapeBtn = $('#scrape-btn');
    const $cssAnalyzerBtn = $('#css-analyzer-btn');
    const $seoAnalyzerBtn = $('#seo-analyzer-btn');
    const $stackAnalyzerBtn = $('#stack-analyzer-btn');
    const $assetScraperBtn = $('#asset-scraper-btn');
    const $clearCacheBtn = $('#clear-cache-btn');
    
    const $scraperStatus = $('#scraper-status');
    const $assetScraperResults = $('#asset-scraper-results');
    const $analyzerStatus = $('#analyzer-status');
    const $logsList = $('#logs-list');
    const $copyHelper = $('#copy-helper');
    const $copiedNotification = $('#copied-notification');

    const $cssResults = $('#css-results');
    const $colorsResults = $('#colors-results');
    const $colorsList = $('#colors-list');
    const $fontsResults = $('#fonts-results');
    const $fontsList = $('#fonts-list');
    
    const $seoResults = $('#seo-results');
    const $seoList = $('#seo-list');
    
    const $stackResults = $('#stack-results');
    const $stackList = $('#stack-list');

    const $tabs = $('#tabs');
    const $tabButtons = $('.tab-btn');
    const $tabContents = $('.tab-content');

    const $fontgrabToggleBtn = $('#fontgrab-toggle-btn');
    const $colorpickToggleBtn = $('#colorpick-toggle-btn');
    const $screenrulerToggleBtn = $('#screenruler-toggle-btn');
    
    // Saved items elements
    const $savedFontsList = $('#saved-fonts-list');
    const $savedColorsList = $('#saved-colors-list');
    const $savedAssetsList = $('#saved-assets-list');
    const $savedEmpty = $('#saved-empty');
    const $clearSavedBtn = $('#clear-saved-btn');


    /**
     * Escapes HTML special characters to prevent XSS.
     * @param {string} text - The text to escape.
     * @returns {string} The escaped text.
     */
    function escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    function logMessage(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);

        let colorClass = 'text-gray-400';
        let icon = 'fas fa-info-circle';
        
        switch (type) {
            case 'success':
                colorClass = 'text-green-400';
                icon = 'fas fa-check-circle';
                break;
            case 'error':
                colorClass = 'text-red-400';
                icon = 'fas fa-exclamation-triangle';
                break;
            case 'warn':
                colorClass = 'text-yellow-400';
                icon = 'fas fa-exclamation-circle';
                break;
        }

        const logEntry = `
            <li class="flex items-start ${colorClass}">
                <i class="${icon} w-4 mt-0.5 mr-2 flex-shrink-0"></i>
                <span class="flex-1">${_.escape(message)}</span>
            </li>
        `;
        $logsList.prepend(logEntry);
    }

    function showActionFeedback(message, event) {
        $('.action-feedback').remove();

        const $feedback = $('<div>')
            .text(message)
            .addClass('action-feedback')
            .css({
                position: 'fixed',
                top: `${event.clientY - 35}px`,
                left: `${event.clientX}px`,
                transform: 'translateX(-50%)',
                padding: '3px 8px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '500',
                zIndex: 9999,
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.3s ease-out, top 0.3s ease-out',
                whiteSpace: 'nowrap'
            });

        $('body').append($feedback);

        setTimeout(() => {
            $feedback.css({
                opacity: 1,
                top: `${event.clientY - 40}px`
            });
        }, 10);

        setTimeout(() => {
            $feedback.css({
                opacity: 0,
                top: `${event.clientY - 50}px`
            });
            setTimeout(() => $feedback.remove(), 300);
        }, 1200);
    }

    function showLoading($button, loadingText = 'Loading...') {
        $button.prop('disabled', true);
        $button.data('original-text', $button.text());
        $button.text(loadingText);
    }

    function hideLoading($button, originalText) {
        $button.prop('disabled', false);
        const savedText = $button.data('original-text') || originalText;
        $button.text(savedText);
    }

    let notificationTimeout;
    
    function showNotification(text) {
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
        $copiedNotification.text(text);
        $copiedNotification[0].offsetHeight;
        $copiedNotification.addClass('show');
        notificationTimeout = setTimeout(() => {
            $copiedNotification.removeClass('show');
        }, 1500);
    }

    function copyToClipboard(text, $element) {
        try {
            $copyHelper.val(text).select();
            document.execCommand('copy');
            
            showNotification('Copied!');

            // Show inline feedback if element is provided
            if ($element) {
                const copyButton = $element.is('button') ? $element : $element.closest('.copy-btn, .saved-item-copy-btn, .asset-copy-btn, .prompt-copy-btn');
                if (copyButton.length) {
                    const originalIcon = copyButton.html();
                    copyButton.html('<i class="fas fa-check text-green-400"></i>');
                setTimeout(() => {
                        copyButton.html(originalIcon);
                }, 2000);
                }
            }
        } catch (e) {
            logMessage('Failed to copy text.', 'error');
            showNotification('Copy Failed!');
        }
    }

    function showTab(tabId) {
        $tabs.find(`[data-tab="${tabId}"]`).click();
    }

    function isGoogleDomain(url) {
        if (!url) return false;
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            return hostname.includes('google.com') || 
                   hostname.includes('googleapis.com') ||
                   hostname.includes('googleusercontent.com') ||
                   hostname.includes('gstatic.com') ||
                   hostname.includes('youtube.com') ||
                   hostname.includes('youtu.be') ||
                   hostname.endsWith('.google.com') ||
                   hostname.endsWith('.googleapis.com') ||
                   hostname.endsWith('.googleusercontent.com') ||
                   hostname.endsWith('.gstatic.com');
        } catch (e) {
            return false;
        }
    }

    async function getActiveTab() {
        try {
            if (!chrome || !chrome.tabs || !chrome.tabs.query) {
                throw new Error('Chrome tabs API not available. Make sure "tabs" permission is in manifest.json');
            }
            
            let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // If no active tab or it's a special page, try to find any regular webpage tab
            if (!tabs || tabs.length === 0 || 
                (tabs[0] && (tabs[0].url.startsWith('chrome://') || tabs[0].url.startsWith('chrome-extension://') || 
                 tabs[0].url.startsWith('edge://') || tabs[0].url.startsWith('about:') || !tabs[0].id))) {
                
                // Try to find any regular webpage tab
                tabs = await chrome.tabs.query({});
                const regularTab = tabs.find(tab => 
                    tab.url && 
                    !tab.url.startsWith('chrome://') && 
                    !tab.url.startsWith('chrome-extension://') &&
                    !tab.url.startsWith('edge://') &&
                    !tab.url.startsWith('about:') &&
                    tab.id
                );
                
                if (regularTab) {
                    logMessage(`Switched to tab: ${regularTab.title || regularTab.url}`, 'info');
                    // Optionally activate the tab
                    try {
                        await chrome.tabs.update(regularTab.id, { active: true });
                    } catch (e) {
                        // Ignore if can't activate
                    }
                    return regularTab;
                }
                
                throw new Error('Please navigate to a regular webpage (not chrome:// or extension pages) to use this tool.');
            }
            
            const tab = tabs[0];
            if (!tab.url || !tab.id) {
                throw new Error('Tab is not accessible. Please navigate to a regular webpage.');
            }
            
            return tab;
        } catch (error) {
            logMessage(error.message, 'error');
            throw error;
        }
    }

    $tabs.on('click', '.tab-btn', function() {
        const $this = $(this);
        if ($this.hasClass('active')) return;

        const tabId = $this.data('tab');

        $tabButtons.removeClass('active text-white border-bn-orange').addClass('text-white border-transparent hover:text-white');
        $this.addClass('active text-white border-bn-orange').removeClass('border-transparent');

        $tabContents.removeClass('active');
        $(`#tab-${tabId}`).addClass('active');
        
        logMessage(`Switched to tab: ${tabId}`);
    });

    $scrapeBtn.on('click', async () => {
        await collapseTools(); // Collapse tools section
        showTab('logs');
        
        try {
            const tab = await getActiveTab();
            
            if (isGoogleDomain(tab.url)) {
                logMessage('Error: Google domains are not allowed.', 'error');
                return;
            }
            
            showTab('scraper');
            logMessage('Skin Scraper initiated...');
            $scraperStatus.text('Processing...').attr('class', 'text-gray-400 text-sm');
            showLoading($scrapeBtn, 'Scraping...');
            
            // Inject sanitization script to remove all JavaScript/logic before capture
            logMessage('Sanitizing page (removing JavaScript/logic, keeping UI only)...');
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['scraper_content.js'],
                });
                // Wait a moment for the script to execute
                await new Promise(resolve => setTimeout(resolve, 500));
                logMessage('Page sanitized successfully.');
            } catch (sanitizeError) {
                logMessage(`Warning: Could not sanitize page: ${sanitizeError.message}. Proceeding with capture.`, 'warn');
            }
            
            logMessage('Capturing page as MHTML...');
            const mhtmlData = await chrome.pageCapture.saveAsMHTML({ tabId: tab.id });
            
            // Generate design documentation
            logMessage('Generating design documentation...');
            let designDoc = '';
            try {
                // Inject the generator script
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['design_doc_generator.js'],
                });
                
                // Wait a moment for script to load
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Execute the generator function - try multiple ways to access it
                const [docResult] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        try {
                            // Try window scope first
                            if (typeof window !== 'undefined' && typeof window.generateDesignDocumentation === 'function') {
                                return window.generateDesignDocumentation();
                            }
                            // Try global scope
                            if (typeof generateDesignDocumentation === 'function') {
                                return generateDesignDocumentation();
                            }
                            // Try to find it in any scope
                            if (typeof globalThis !== 'undefined' && typeof globalThis.generateDesignDocumentation === 'function') {
                                return globalThis.generateDesignDocumentation();
                            }
                            
                            // If still not found, try to manually define it by reading the script
                            const scripts = document.querySelectorAll('script');
                            for (let script of scripts) {
                                if (script.src && script.src.includes('design_doc_generator')) {
                                    // Script is loaded, function should be available
                                    // Wait a bit and try again
                                    return 'Function not found - script may not be fully loaded';
                                }
                            }
                            
                            return 'Error: generateDesignDocumentation function not found in any scope';
                        } catch (e) {
                            return `Error generating documentation: ${e.message}\nStack: ${e.stack}`;
                        }
                    }
                });
                designDoc = docResult.result || 'Design documentation generation failed.';
                
                // If function wasn't found, wait longer and try again
                if (designDoc.includes('function not found') || designDoc.includes('Function not found')) {
                    logMessage('Waiting for script to load...', 'info');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    const [docResult2] = await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: () => {
                            try {
                                if (typeof window !== 'undefined' && typeof window.generateDesignDocumentation === 'function') {
                                    return window.generateDesignDocumentation();
                                }
                                if (typeof generateDesignDocumentation === 'function') {
                                    return generateDesignDocumentation();
                                }
                                return 'Error: Function still not found after retry';
                            } catch (e) {
                                return `Error: ${e.message}`;
                            }
                        }
                    });
                    designDoc = docResult2.result || designDoc;
                }
            } catch (docError) {
                logMessage(`Warning: Could not generate design doc: ${docError.message}`, 'warn');
                designDoc = `# Design Documentation\n\nError generating documentation: ${docError.message}\n\nBasic info:\nURL: ${tab.url}\nTitle: ${tab.title}\n`;
            }
            
            const url = URL.createObjectURL(mhtmlData);
            const title = tab.title || 'scraped-page';
            const cleanFilename = _.kebabCase(_.deburr(title));
            const mhtmlFilename = `${cleanFilename || 'scraped-page'}.mhtml`;
            
            $scraperStatus.text('Download starting...').attr('class', 'text-bn-orange text-sm');
            logMessage('Page capture complete. Prompting for downloads.');

            try {
                // Download MHTML
                await chrome.downloads.download({
                    url: url,
                    filename: mhtmlFilename,
                    saveAs: true
                });
                
                // Download design documentation
                const docBlob = new Blob([designDoc], { type: 'text/markdown' });
                const docUrl = URL.createObjectURL(docBlob);
                const docFilename = `${cleanFilename || 'scraped-page'}-design-doc.md`;
                
                await chrome.downloads.download({
                    url: docUrl,
                    filename: docFilename,
                    saveAs: false // Auto-download the doc file
                });
                
                $scraperStatus.text('Scrape complete! Files downloaded.').attr('class', 'text-green-400 text-sm');
                logMessage('Downloads prompted successfully.', 'success');
                showNotification('Downloads Started!');
                logMessage(`Downloaded: ${mhtmlFilename} and ${docFilename}`, 'success');
            } catch (downloadError) {
                $scraperStatus.text('Download failed. See logs.').attr('class', 'text-red-400 text-sm');
                logMessage(`Download failed: ${downloadError.message}`, 'error');
            } finally {
                URL.revokeObjectURL(url);
                hideLoading($scrapeBtn, 'Scrape');
            }

        } catch (error) {
            $scraperStatus.text(error.message).attr('class', 'text-red-400 text-sm');
            logMessage(`Scrape failed: ${error.message}`, 'error');
            hideLoading($scrapeBtn, 'Scrape');
        }
    });

    $cssAnalyzerBtn.on('click', async () => {
        await collapseTools(); // Collapse tools section
        showTab('logs');
        
        try {
            const tab = await getActiveTab();
            
            if (isGoogleDomain(tab.url)) {
                logMessage('Error: Google domains are not allowed.', 'error');
                return;
            }
            
            showTab('analyzer');
            logMessage('CSS Analyzer initiated...');
            $analyzerStatus.show();
            $cssResults.hide();
            $seoResults.hide();
            $stackResults.hide();
            showLoading($cssAnalyzerBtn, 'Analyzing...');
            
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['analyzer_content.js'],
            });
            
            // Wait a moment for script to inject
            await new Promise(resolve => setTimeout(resolve, 100));
            
            chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_CSS' });

        } catch (error) {
            $analyzerStatus.hide();
            logMessage(`CSS Analysis failed: ${error.message}`, 'error');
            hideLoading($cssAnalyzerBtn, 'Run');
        }
    });

    $seoAnalyzerBtn.on('click', async () => {
        await collapseTools(); // Collapse tools section
        showTab('logs');
        
        try {
            const tab = await getActiveTab();
            
            if (isGoogleDomain(tab.url)) {
                logMessage('Error: Google domains are not allowed.', 'error');
                return;
            }
            
            showTab('analyzer');
            logMessage('SEO Analyzer initiated...');
            $analyzerStatus.show();
            $cssResults.hide();
            $seoResults.hide();
            $stackResults.hide();
            showLoading($seoAnalyzerBtn, 'Analyzing...');
            
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['analyzer_content.js'],
            });
            
            // Wait a moment for script to inject
            await new Promise(resolve => setTimeout(resolve, 100));
            
            chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_SEO' });

        } catch (error) {
            $analyzerStatus.hide();
            logMessage(`SEO Analysis failed: ${error.message}`, 'error');
            hideLoading($seoAnalyzerBtn, 'Run');
        }
    });

    $stackAnalyzerBtn.on('click', async () => {
        await collapseTools(); // Collapse tools section
        showTab('logs');
        
        try {
            const tab = await getActiveTab();
            
            if (isGoogleDomain(tab.url)) {
                logMessage('Error: Google domains are not allowed.', 'error');
                return;
            }
            
            showTab('analyzer');
            logMessage('Stack Analyzer initiated...');
            $analyzerStatus.show();
            $cssResults.hide();
            $seoResults.hide();
            $stackResults.hide();
            showLoading($stackAnalyzerBtn, 'Analyzing...');
            
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['analyzer_content.js'],
            });
            
            // Wait a moment for script to inject
            await new Promise(resolve => setTimeout(resolve, 100));
            
            chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_STACK' });

        } catch (error) {
            $analyzerStatus.hide();
            logMessage(`Stack Analysis failed: ${error.message}`, 'error');
            hideLoading($stackAnalyzerBtn, 'Run');
        }
    });

    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            // Handle analyzer results (fire-and-forget messages, no response needed)
            if (message && message.type === 'CSS_RESULTS') {
                logMessage('CSS analysis complete.', 'success');
                hideLoading($cssAnalyzerBtn, 'Run');
                $analyzerStatus.hide();
                // Hide other results, show only CSS
                $seoResults.hide();
                $stackResults.hide();
            renderCssResults(message.css_results);
                $cssResults.show();
            } else if (message && message.type === 'SEO_RESULTS') {
                logMessage('SEO analysis complete.', 'success');
                hideLoading($seoAnalyzerBtn, 'Run');
                $analyzerStatus.hide();
                // Hide other results, show only SEO
                $cssResults.hide();
                $stackResults.hide();
            renderSeoResults(message.seo_results);
                $seoResults.show();
            } else if (message && message.type === 'STACK_RESULTS') {
                logMessage('Stack analysis complete.', 'success');
                hideLoading($stackAnalyzerBtn, 'Run');
                $analyzerStatus.hide();
                // Hide other results, show only Stack
                $cssResults.hide();
                $seoResults.hide();
            renderStackResults(message.stack_results);
                $stackResults.show();
        }
            // No response needed for these one-way messages
            return false;
    });
    } else {
        logMessage('Chrome runtime API not available', 'error');
    }

    
    function renderCssResults(results) {
        if (!results) {
            logMessage('No CSS results found.', 'warn');
            $cssResults.hide();
            return;
        }
        
        // Render Colors
        if (!_.isEmpty(results.colors)) {
            $colorsList.empty();
            $.each(results.colors, (i, color) => {
                const $colorBox = $(`
                    <div class="group relative bg-gray-800/50 border border-white/10 rounded-lg p-3 hover:border-bn-orange/50 hover:bg-gray-800 transition-all duration-200 cursor-pointer" title="Click to copy ${color}">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg border-2 border-white/20 flex-shrink-0 shadow-lg ring-2 ring-gray-900/50" style="background-color: ${color};"></div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-mono text-gray-300 font-medium truncate">${_.escape(color)}</p>
                            </div>
                            <button class="copy-btn opacity-0 group-hover:opacity-100 flex-shrink-0 p-2 bg-bn-orange/10 hover:bg-bn-orange/20 rounded-lg transition-all duration-200">
                            <i class="fas fa-copy text-bn-orange text-xs"></i>
                        </button>
                    </div>
                    </div>
                `).on('click', function(e) {
                    copyToClipboard(color, e);
                });
                $colorsList.append($colorBox);
            });
            $colorsResults.show();
            $cssResults.show();
        } else {
            $colorsResults.hide();
            logMessage('No unique colors found.', 'info');
        }

        // Render Fonts
        if (!_.isEmpty(results.fonts)) {
            $fontsList.empty();
            $.each(results.fonts, (i, font) => {
                const $fontItem = $(`
                    <div class="group bg-gray-800/50 border border-white/10 rounded-lg p-3 hover:border-bn-orange/50 hover:bg-gray-800 transition-all duration-200 cursor-pointer" title="Click to copy ${font}">
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-300 truncate mb-1" style="font-family: '${_.escape(font)}';">${_.escape(font)}</p>
                                <p class="text-xs text-gray-500 font-mono">Font Family</p>
                            </div>
                            <button class="copy-btn opacity-0 group-hover:opacity-100 flex-shrink-0 p-2 bg-bn-orange/10 hover:bg-bn-orange/20 rounded-lg transition-all duration-200">
                            <i class="fas fa-copy text-bn-orange text-xs"></i>
                        </button>
                        </div>
                    </div>
                `).on('click', function(e) {
                    copyToClipboard(font, e);
                });
                $fontsList.append($fontItem);
            });
            $fontsResults.show();
            $cssResults.show();
        } else {
            $fontsResults.hide();
            logMessage('No unique fonts found.', 'info');
        }
    }

    function renderSeoResults(results) {
        if (!results) {
            logMessage('No SEO results found.', 'warn');
            $seoResults.hide();
            return;
        }
        $seoList.empty();
        
        const addSeoItem = (label, value, isGood = true, section = '') => {
            let icon, colorClass, bgClass;
            if (value === null || value === undefined || value.toString().trim() === '') {
                icon = 'fas fa-exclamation-circle';
                colorClass = 'text-yellow-400';
                bgClass = 'bg-yellow-400/10 border-yellow-400/20';
                value = 'Not found';
            } else {
                icon = isGood ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
                colorClass = isGood ? 'text-green-400' : 'text-red-400';
                bgClass = isGood ? 'bg-green-400/10 border-green-400/20' : 'bg-red-400/10 border-red-400/20';
            }
            
            const displayValue = _.escape(value.toString().length > 100 ? value.toString().substring(0, 100) + '...' : value.toString());
            $seoList.append(`
                <div class="bg-gray-800/50 border border-white/10 rounded-lg p-3 mb-2 ${bgClass} hover:border-white/20 transition-all duration-200">
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 mt-0.5">
                            <i class="${icon} ${colorClass} text-sm"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-medium text-gray-300 mb-1">${_.escape(label)}</p>
                            <p class="text-sm ${colorClass} break-words" title="${_.escape(value.toString())}">${displayValue}</p>
                        </div>
                    </div>
                </div>
            `);
        }
        
        // Basic Meta
        addSeoItem('Title', results.title, results.title && results.title.length > 10 && results.title.length < 70);
        addSeoItem('Description', results.description, results.description && results.description.length > 50 && results.description.length < 160);
        addSeoItem('Keywords', results.keywords, !!results.keywords);
        addSeoItem('Author', results.author, !!results.author);
        addSeoItem('Robots', results.robots, !!results.robots);
        addSeoItem('Charset', results.charset, !!results.charset);
        addSeoItem('Language', results.lang, !!results.lang);
        
        // Headings
        addSeoItem('H1', results.h1, !!results.h1 && results.h1Count === 1);
        if (results.h1Count > 1) {
            $seoList.append(`<div class="bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-2"><div class="flex items-start gap-3"><i class="fas fa-exclamation-triangle text-red-400 text-sm mt-0.5"></i><div class="flex-1"><p class="text-xs font-medium text-gray-300 mb-1">H1 Count</p><p class="text-sm text-red-400">${results.h1Count} H1 tags found (should be 1)</p></div></div></div>`);
        }
        addSeoItem('H2 Count', results.h2Count?.toString() || '0', results.h2Count > 0);
        addSeoItem('H3 Count', results.h3Count?.toString() || '0', results.h3Count > 0);
        
        // Links
        addSeoItem('Canonical', results.canonical, !!results.canonical);
        if (results.alternate && results.alternate.length > 0) {
            addSeoItem('Alternate', `${results.alternate.length} alternate link(s)`, true);
        }
        
        // Open Graph
        addSeoItem('OG Title', results.ogTitle, !!results.ogTitle);
        addSeoItem('OG Description', results.ogDescription, !!results.ogDescription);
        addSeoItem('OG Image', results.ogImage, !!results.ogImage);
        addSeoItem('OG Type', results.ogType, !!results.ogType);
        addSeoItem('OG URL', results.ogUrl, !!results.ogUrl);
        addSeoItem('OG Site Name', results.ogSiteName, !!results.ogSiteName);
        addSeoItem('OG Locale', results.ogLocale, !!results.ogLocale);
        
        // Twitter
        addSeoItem('Twitter Card', results.twitterCard, !!results.twitterCard);
        addSeoItem('Twitter Title', results.twitterTitle, !!results.twitterTitle);
        addSeoItem('Twitter Description', results.twitterDescription, !!results.twitterDescription);
        addSeoItem('Twitter Image', results.twitterImage, !!results.twitterImage);
        addSeoItem('Twitter Site', results.twitterSite, !!results.twitterSite);
        addSeoItem('Twitter Creator', results.twitterCreator, !!results.twitterCreator);
        
        // Mobile
        addSeoItem('Theme Color', results.themeColor, !!results.themeColor);
        addSeoItem('Apple Mobile App', results.appleMobileWebAppCapable, !!results.appleMobileWebAppCapable);
        addSeoItem('Apple App Title', results.appleMobileWebAppTitle, !!results.appleMobileWebAppTitle);
        
        // Structured Data
        if (results.structuredData) {
            addSeoItem('Structured Data', `${results.structuredData.length} schema(s) found`, true);
        }
        if (results.schemaTypes && results.schemaTypes.length > 0) {
            addSeoItem('Schema Types', results.schemaTypes.join(', '), true);
        }
        
        // Image Alt Tags
        if (results.imageAlts && results.imageAlts.total === 0) {
             $seoList.append(`<div class="bg-gray-800/50 border border-white/10 rounded-lg p-3 mb-2"><div class="flex items-start gap-3"><i class="fas fa-info-circle text-gray-400 text-sm mt-0.5"></i><div class="flex-1"><p class="text-xs font-medium text-gray-300 mb-1">Images</p><p class="text-sm text-gray-400">No images found.</p></div></div></div>`);
        } else if (results.imageAlts && results.imageAlts.missing === 0) {
            $seoList.append(`<div class="bg-green-400/10 border border-green-400/20 rounded-lg p-3 mb-2"><div class="flex items-start gap-3"><i class="fas fa-check-circle text-green-400 text-sm mt-0.5"></i><div class="flex-1"><p class="text-xs font-medium text-gray-300 mb-1">Images</p><p class="text-sm text-green-400">All ${results.imageAlts.total} images have alt tags!</p></div></div></div>`);
        } else if (results.imageAlts) {
            $seoList.append(`<div class="bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-2"><div class="flex items-start gap-3"><i class="fas fa-exclamation-triangle text-red-400 text-sm mt-0.5"></i><div class="flex-1"><p class="text-xs font-medium text-gray-300 mb-1">Images</p><p class="text-sm text-red-400">${results.imageAlts.missing} of ${results.imageAlts.total} are missing alt tags.</p></div></div></div>`);
        }
        
        // Links Analysis
        if (results.links) {
            $seoList.append(`<div class="bg-gray-800/50 border border-white/10 rounded-lg p-3 mb-2"><div class="flex items-start gap-3"><i class="fas fa-link text-gray-400 text-sm mt-0.5"></i><div class="flex-1"><p class="text-xs font-medium text-gray-300 mb-1">Links</p><p class="text-sm text-gray-400">${results.links.total} total (${results.links.internal} internal, ${results.links.external} external)</p></div></div></div>`);
        }
        
        $seoResults.show();
    }
    
    function renderStackResults(results) {
        if (!results) {
            logMessage('No stack results found.', 'info');
            $stackList.empty().append(`<div class="bg-gray-800/50 border border-white/10 rounded-lg p-4 text-center"><p class="text-gray-400 flex items-center justify-center gap-2"><i class="fas fa-info-circle"></i><span>No specific stack detected.</span></p></div>`);
            $stackResults.show();
            return;
        }
        
        $stackList.empty();
        
        // Helper to render category
        function renderCategory(title, items, icon = 'fa-check-circle') {
            if (!items || items.length === 0) return '';
            
            let html = `<div class="mb-4 last:mb-0"><h4 class="text-gray-300 font-heading text-sm font-medium mb-3 flex items-center gap-2"><i class="fas ${icon} text-bn-orange"></i><span>${_.escape(title)}</span></h4><div class="flex flex-wrap gap-2">`;
            items.forEach(item => {
                html += `<div class="bg-bn-orange/10 border border-bn-orange/30 rounded-lg px-3 py-1.5 text-sm text-bn-orange font-medium hover:bg-bn-orange/20 hover:border-bn-orange/50 transition-all duration-200">${_.escape(item)}</div>`;
            });
            html += '</div></div>';
            return html;
        }
        
        // Frontend
        if (results.frontend) {
            if (results.frontend.frameworks && results.frontend.frameworks.length > 0) {
                $stackList.append(renderCategory('🧱 Frontend Frameworks', results.frontend.frameworks));
            }
            if (results.frontend.cssLibraries && results.frontend.cssLibraries.length > 0) {
                $stackList.append(renderCategory('CSS Libraries', results.frontend.cssLibraries));
            }
            if (results.frontend.uiKits && results.frontend.uiKits.length > 0) {
                $stackList.append(renderCategory('UI Kits', results.frontend.uiKits));
            }
            if (results.frontend.cdns && results.frontend.cdns.length > 0) {
                $stackList.append(renderCategory('CDNs', results.frontend.cdns));
            }
            if (results.frontend.analytics && results.frontend.analytics.length > 0) {
                $stackList.append(renderCategory('Analytics/Trackers', results.frontend.analytics));
            }
            if (results.frontend.templatingEngines && results.frontend.templatingEngines.length > 0) {
                $stackList.append(renderCategory('Templating Engines', results.frontend.templatingEngines));
            }
        }
        
        // Backend
        if (results.backend) {
            if ((results.backend.languages && results.backend.languages.length > 0) || 
                (results.backend.frameworks && results.backend.frameworks.length > 0)) {
                const backendItems = [...(results.backend.languages || []), ...(results.backend.frameworks || [])];
                $stackList.append(renderCategory('💾 Backend Language/Framework', backendItems));
            }
            if (results.backend.cms && results.backend.cms.length > 0) {
                $stackList.append(renderCategory('CMS Platforms', results.backend.cms));
            }
            if (results.backend.databases && results.backend.databases.length > 0) {
                $stackList.append(renderCategory('Database Hints', results.backend.databases));
            }
        }
        
        // Hosting
        if (results.hosting) {
            if (results.hosting.providers && results.hosting.providers.length > 0) {
                $stackList.append(renderCategory('☁️ Hosting Providers', results.hosting.providers));
            }
            if (results.hosting.cdns && results.hosting.cdns.length > 0) {
                $stackList.append(renderCategory('CDN/Edge', results.hosting.cdns));
            }
            if (results.hosting.ssl && results.hosting.ssl.length > 0) {
                $stackList.append(renderCategory('SSL', results.hosting.ssl));
            }
            if (results.hosting.servers && results.hosting.servers.length > 0) {
                $stackList.append(renderCategory('Server', results.hosting.servers));
            }
        }
        
        // APIs & Integrations
        if (results.apis) {
            if (results.apis.external && results.apis.external.length > 0) {
                $stackList.append(renderCategory('🔌 External APIs', results.apis.external));
            }
            if (results.apis.social && results.apis.social.length > 0) {
                $stackList.append(renderCategory('Social Embeds', results.apis.social));
            }
            if (results.apis.headlessCms && results.apis.headlessCms.length > 0) {
                $stackList.append(renderCategory('Headless CMS APIs', results.apis.headlessCms));
            }
        }
        
        // Miscellaneous
        if (results.miscellaneous) {
            if (results.miscellaneous.fonts && results.miscellaneous.fonts.length > 0) {
                $stackList.append(renderCategory('🧩 Fonts', results.miscellaneous.fonts));
            }
            if (results.miscellaneous.bundlers && results.miscellaneous.bundlers.length > 0) {
                $stackList.append(renderCategory('JS Bundlers', results.miscellaneous.bundlers));
            }
            if (results.miscellaneous.versions && Object.keys(results.miscellaneous.versions).length > 0) {
                let versionsHtml = '<div class="mb-4 last:mb-0"><h4 class="text-gray-300 font-heading text-sm font-medium mb-3 flex items-center gap-2"><i class="fas fa-tag text-bn-orange"></i><span>Version Hints</span></h4><div class="space-y-2">';
                Object.entries(results.miscellaneous.versions).forEach(([tech, version]) => {
                    versionsHtml += `<div class="bg-gray-800/50 border border-white/10 rounded-lg p-3"><div class="flex items-center gap-2"><span class="text-sm font-medium text-gray-300">${_.escape(tech)}</span><span class="text-xs text-bn-orange font-mono">${_.escape(version)}</span></div></div>`;
                });
                versionsHtml += '</div></div>';
                $stackList.append(versionsHtml);
            }
            if (results.miscellaneous.securityHeaders && results.miscellaneous.securityHeaders.length > 0) {
                $stackList.append(renderCategory('Security Headers', results.miscellaneous.securityHeaders, 'fa-shield-alt'));
            }
        }
        
        // If nothing detected
        if ($stackList.children().length === 0) {
            $stackList.append(`<div class="bg-gray-800/50 border border-white/10 rounded-lg p-4 text-center"><p class="text-gray-400 flex items-center justify-center gap-2"><i class="fas fa-info-circle"></i><span>No specific stack detected.</span></p></div>`);
        }
        
        $stackResults.show();
    }

    $assetScraperBtn.on('click', async () => {
        await collapseTools(); // Collapse tools section
        showTab('logs');
        
        try {
            const tab = await getActiveTab();
            
            if (isGoogleDomain(tab.url)) {
                logMessage('Error: Google domains are not allowed.', 'error');
                return;
            }
            
            showTab('scraper');
            logMessage('Asset Scraper initiated...');
            $assetScraperResults.hide();
            showLoading($assetScraperBtn, 'Scraping...');
            
            // Check if we can access the page
            if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('about:')) {
                throw new Error('Cannot scrape assets from this page type');
            }
            
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['asset_scraper_content.js'],
            });
            
            // Wait a moment for script to inject
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Execute the scraper function
            const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    try {
                        if (typeof window !== 'undefined' && typeof window.scrapeAssets === 'function') {
                            const assets = window.scrapeAssets();
                            return { success: true, assets: assets };
                        }
                        return { success: false, error: 'scrapeAssets function not found' };
                    } catch (e) {
                        return { success: false, error: e.message, stack: e.stack };
                    }
                }
            });
            
            if (!result || !result.result) {
                throw new Error('No result returned from scraper');
            }
            
            const response = result.result;
            
            if (!response.success || response.error) {
                throw new Error(response.error || 'Unknown error occurred');
            }
            
            const assets = response.assets;
            
            if (!assets || typeof assets !== 'object') {
                throw new Error('Invalid assets data returned');
            }
            
            // Ensure all asset arrays exist
            if (!assets.images) assets.images = [];
            if (!assets.stylesheets) assets.stylesheets = [];
            if (!assets.scripts) assets.scripts = [];
            if (!assets.fonts) assets.fonts = [];
            if (!assets.other) assets.other = [];
            
            renderAssetResults(assets);
            hideLoading($assetScraperBtn, 'Scrape');
            const totalCount = assets.images.length + assets.stylesheets.length + assets.scripts.length + assets.fonts.length + assets.other.length;
            logMessage(`Asset scraping complete. Found ${totalCount} assets.`, 'success');
            $assetScraperResults.show();

        } catch (error) {
            logMessage(`Asset scraping failed: ${error.message}`, 'error');
            hideLoading($assetScraperBtn, 'Scrape');
            $assetScraperResults.hide();
            $scraperStatus.text(`Error: ${error.message}`).attr('class', 'text-red-400 text-sm mb-4');
        }
    });

    
    function renderAssetResults(assets) {
        $assetScraperResults.show();
        
        let totalCount = 0;
        
        // Render Images
        if (assets.images && assets.images.length > 0) {
            $('#assets-images').show();
            $('#images-count').text(assets.images.length);
            totalCount += assets.images.length;
            
            const $imagesGrid = $('#images-grid');
            $imagesGrid.empty();
            
            assets.images.forEach((asset, index) => {
                // Ensure URL is properly encoded and absolute
                const imageUrl = asset.url || '';
                const escapedUrl = _.escape(imageUrl);
                const escapedName = _.escape(asset.name || 'image');
                
                const $preview = $(`
                    <div class="bg-black rounded-lg border border-white/10 overflow-hidden group">
                        <div class="aspect-square bg-black flex items-center justify-center overflow-hidden relative">
                            <img src="${escapedUrl}" alt="${escapedName}" class="w-full h-full object-cover asset-image" crossorigin="anonymous" referrerpolicy="no-referrer" data-url="${escapedUrl}">
                            <div class="image-fallback absolute inset-0 flex items-center justify-center" style="display: none;">
                                <div class="text-center p-2">
                                    <i class="fas fa-image text-gray-600 text-2xl mb-1"></i>
                                    <p class="text-xs text-gray-500 break-all px-2">${escapedUrl.substring(0, 50)}${escapedUrl.length > 50 ? '...' : ''}</p>
                                </div>
                            </div>
                        </div>
                        <div class="p-2">
                            <p class="text-xs text-gray-400 truncate mb-1" title="${escapedName}">${escapedName}</p>
                            <p class="text-xs text-gray-500 truncate mb-2" title="${escapedUrl}">${escapedUrl.substring(0, 40)}${escapedUrl.length > 40 ? '...' : ''}</p>
                            <div class="flex gap-1">
                                <button class="asset-download-btn flex-1 bg-bn-orange hover:bg-bn-orange-hover text-white text-xs py-1 px-2 rounded transition-colors" data-url="${escapedUrl}" data-name="${escapedName}" title="Download">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="asset-copy-btn group flex-1 bg-black border border-bn-orange text-bn-orange hover:bg-bn-orange hover:text-black text-xs py-1 px-2 rounded transition-colors cursor-pointer" data-url="${escapedUrl}" title="Copy URL">
                                    <i class="fas fa-copy text-bn-orange group-hover:text-black"></i>
                                </button>
                                <button class="asset-save-btn group flex-1 bg-black border border-bn-orange text-bn-orange hover:bg-bn-orange hover:text-black text-xs py-1 px-2 rounded transition-colors cursor-pointer" data-url="${escapedUrl}" data-name="${escapedName}" title="Save">
                                    <i class="fas fa-heart text-bn-orange group-hover:text-black"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `);
                
                // Handle image load error with proper event listener (not inline)
                $preview.find('.asset-image').on('error', function() {
                    $(this).hide();
                    $(this).siblings('.image-fallback').show();
                });
                
                $imagesGrid.append($preview);
            });
        } else {
            $('#assets-images').hide();
        }
        
        // Render Stylesheets
        if (assets.stylesheets && assets.stylesheets.length > 0) {
            $('#assets-stylesheets').show();
            $('#stylesheets-count').text(assets.stylesheets.length);
            totalCount += assets.stylesheets.length;
            
            const $list = $('#stylesheets-list');
            $list.empty();
            
            assets.stylesheets.forEach(asset => {
                const $item = createAssetListItem(asset, 'css');
                $list.append($item);
            });
        } else {
            $('#assets-stylesheets').hide();
        }
        
        // Render Scripts
        if (assets.scripts && assets.scripts.length > 0) {
            $('#assets-scripts').show();
            $('#scripts-count').text(assets.scripts.length);
            totalCount += assets.scripts.length;
            
            const $list = $('#scripts-list');
            $list.empty();
            
            assets.scripts.forEach(asset => {
                const $item = createAssetListItem(asset, 'js');
                $list.append($item);
            });
        } else {
            $('#assets-scripts').hide();
        }
        
        // Render Fonts
        if (assets.fonts && assets.fonts.length > 0) {
            $('#assets-fonts').show();
            $('#fonts-count').text(assets.fonts.length);
            totalCount += assets.fonts.length;
            
            const $list = $('#fonts-list');
            $list.empty();
            
            assets.fonts.forEach(asset => {
                const $item = createAssetListItem(asset, 'font');
                $list.append($item);
            });
        } else {
            $('#assets-fonts').hide();
        }
        
        // Render Other
        if (assets.other && assets.other.length > 0) {
            $('#assets-other').show();
            $('#other-count').text(assets.other.length);
            totalCount += assets.other.length;
            
            const $list = $('#other-list');
            $list.empty();
            
            assets.other.forEach(asset => {
                const $item = createAssetListItem(asset, 'other');
                $list.append($item);
            });
        } else {
            $('#assets-other').hide();
        }
        
        $('#asset-count').text(`Total: ${totalCount} assets`);
    }
    
    function createAssetListItem(asset, type) {
        const iconMap = {
            css: 'fa-file-code',
            js: 'fa-code',
            font: 'fa-font',
            other: 'fa-file'
        };
        
        const icon = iconMap[type] || 'fa-file';
        
        return $(`
            <div class="bg-black rounded-lg border border-white/10 p-2 flex items-center justify-between group">
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                    <i class="fas ${icon} text-bn-orange text-sm"></i>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs text-gray-400 truncate" title="${asset.name}">${_.escape(asset.name)}</p>
                        <p class="text-xs text-gray-400 truncate" title="${asset.url}">${_.escape(asset.url.substring(0, 60))}${asset.url.length > 60 ? '...' : ''}</p>
                    </div>
                </div>
                <div class="flex gap-1 ml-2">
                    <button class="asset-download-btn bg-bn-orange hover:bg-bn-orange-hover text-white text-xs py-1 px-2 rounded transition-colors" data-url="${asset.url}" data-name="${asset.name}" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="asset-copy-btn group bg-black border border-bn-orange text-bn-orange hover:bg-bn-orange hover:text-black text-xs py-1 px-2 rounded transition-colors cursor-pointer" data-url="${asset.url}" title="Copy URL">
                        <i class="fas fa-copy text-bn-orange group-hover:text-black"></i>
                    </button>
                    <button class="asset-save-btn group bg-black border border-bn-orange text-bn-orange hover:bg-bn-orange hover:text-black text-xs py-1 px-2 rounded transition-colors cursor-pointer" data-url="${asset.url}" data-name="${asset.name}" title="Save">
                        <i class="fas fa-heart text-bn-orange group-hover:text-black"></i>
                    </button>
                </div>
            </div>
        `);
    }
    
    // Handle asset download and copy buttons
    $(document).on('click', '.asset-download-btn', async function(e) {
        const url = $(this).data('url');
        const name = $(this).data('name') || 'asset';
        
        try {
            logMessage(`Downloading ${name}...`, 'info');
            showNotification('Download starting...');
            
            await chrome.downloads.download({
                url: url,
                filename: name,
                saveAs: false
            });
            
            logMessage(`Downloaded ${name}`, 'success');
        } catch (error) {
            logMessage(`Download failed: ${error.message}`, 'error');
            showNotification('Download Failed!');
        }
    });
    
    $(document).on('click', '.asset-copy-btn', function(e) {
        const url = $(this).data('url');
        copyToClipboard(url, $(this));
    });
    
    // Handle asset save buttons
    $(document).on('click', '.asset-save-btn', async function() {
        const url = $(this).data('url');
        const name = $(this).data('name') || 'asset';
        
        const assetData = {
            url: url,
            name: name,
            type: 'asset'
        };
        
        await saveAssetData(assetData);
    });

    $clearCacheBtn.on('click', async () => {
        await collapseTools(); // Collapse tools section
        showTab('logs');
        
        try {
            const tab = await getActiveTab();
            
            logMessage('Clear Cache Tool - Development Testing Only', 'warn');
            logMessage('Initiating cache clearing for current website origin...', 'info');
            showLoading($clearCacheBtn, 'Clearing...');
            
            // Check if we can access the page
            if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('about:')) {
                throw new Error('Cannot clear cache for this page type');
            }
            
            // Extract origin from URL (scheme + hostname + port)
            const urlObj = new URL(tab.url);
            const origin = urlObj.origin;
            
            logMessage(`Target origin: ${origin}`, 'info');
            logMessage('Development Testing: Clearing cache for specified website origin', 'warn');
            
            // Use background script to handle cache clearing (browsingData API is not available in popup context)
            // Ensure service worker is active by sending a ping first
            try {
                // Ping the service worker to wake it up
                await chrome.runtime.sendMessage({ type: 'PING' }).catch(() => {
                    // Ignore ping errors - service worker might already be active
                });
            } catch (e) {
                // Ignore ping errors
            }
            
            // Retry logic in case service worker is not ready
            let response = null;
            let retries = 3;
            let lastError = null;
            
            while (retries > 0) {
                try {
                    response = await new Promise((resolve, reject) => {
                        // Set timeout for response
                        const timeout = setTimeout(() => {
                            reject(new Error('Timeout waiting for background script response'));
                        }, 5000);
                        
                        chrome.runtime.sendMessage(
                            {
                                type: 'CLEAR_CACHE',
                                origin: origin,
                                tabId: tab.id
                            },
                            (response) => {
                                clearTimeout(timeout);
                                if (chrome.runtime.lastError) {
                                    const errorMsg = chrome.runtime.lastError.message;
                                    // If service worker is not available, try to wake it up
                                    if (errorMsg.includes('Receiving end does not exist')) {
                                        reject(new Error('Service worker not active - please reload the extension'));
                                    } else {
                                        reject(new Error(errorMsg));
                                    }
                                } else {
                                    resolve(response);
                                }
                            }
                        );
                    });
                    
                    // If we got a response, break out of retry loop
                    break;
                } catch (error) {
                    lastError = error;
                    retries--;
                    if (retries > 0) {
                        logMessage(`Retrying cache clear... (${retries} attempts left)`, 'info');
                        // Wait a bit longer between retries to allow service worker to initialize
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
            
            if (!response || !response.success) {
                throw new Error(response?.error || lastError?.message || 'Failed to clear cache - service worker may not be active');
            }
            
            logMessage(`Cache cleared successfully for ${origin}`, 'success');
            logMessage('Development Testing Tool: Operation completed. Use with caution.', 'warn');
            hideLoading($clearCacheBtn, 'Run');
            
        } catch (error) {
            logMessage(`Failed to clear cache: ${error.message}`, 'error');
            logMessage('Development Testing: Error occurred during cache clearing operation', 'warn');
            hideLoading($clearCacheBtn, 'Run');
        }
    });

    let fontgrabActive = false;
    let currentFontData = null;
    
    // Helper function to disable other tools when one is enabled
    async function disableOtherTools(excludeTool) {
        const tab = await getActiveTab().catch(() => null);
        if (!tab || !tab.id) return;
        
        try {
            // Disable FontGrab if not the active tool
            if (excludeTool !== 'fontgrab' && fontgrabActive) {
                try {
                    await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_FONTGRAB', 
                        enabled: false 
                    });
                } catch (e) {}
                fontgrabActive = false;
                $('#fontgrab-toggle-btn .fontgrab-status').text('Enable');
                $('#fontgrab-toggle-btn').removeClass('tool-toggle-active');
                $('#fontgrab-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
            }
            
            // Disable ColorPick if not the active tool
            if (excludeTool !== 'colorpick' && colorpickActive) {
                try {
                    await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_COLORPICK', 
                        enabled: false 
                    });
                } catch (e) {}
                colorpickActive = false;
                $('#colorpick-toggle-btn .colorpick-status').text('Enable');
                $('#colorpick-toggle-btn').removeClass('tool-toggle-active');
                $('#colorpick-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
            }
            
            // Disable Screen Ruler if not the active tool
            if (excludeTool !== 'screenruler' && screenrulerActive) {
                try {
                    await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_SCREENRULER', 
                        enabled: false 
                    });
                } catch (e) {}
                screenrulerActive = false;
                $('#screenruler-toggle-btn .screenruler-status').text('Enable');
                $('#screenruler-toggle-btn').removeClass('tool-toggle-active');
                $('#screenruler-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
            }
        } catch (error) {
            // Ignore errors
        }
    }
    
    // Attach handler directly to button (will work after DOM ready)
    function attachFontGrabHandler() {
        $('#fontgrab-toggle-btn').off('click').on('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            logMessage('FontGrab button clicked', 'info');
            try {
                const tab = await getActiveTab();
                logMessage(`Got tab: ${tab.id}`, 'info');
            
            // Check if tab is accessible
            if (!tab || !tab.id) {
                logMessage('Cannot access this tab. Try a regular webpage.', 'error');
                return;
            }
            
            // Check if it's a chrome:// page
            if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://'))) {
                logMessage('FontGrab cannot run on browser pages. Please navigate to a regular webpage.', 'error');
                return;
            }
            
            if (!fontgrabActive) {
                // Disable other tools first
                await disableOtherTools('fontgrab');
                
                // Enable FontGrab - try to inject script
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['whatfont_content.js'],
                    });
                    await new Promise(resolve => setTimeout(resolve, 200));
                    logMessage('FontGrab script injected.', 'info');
                } catch (e) {
                    logMessage(`Script injection: ${e.message}. Trying to send message anyway...`, 'warn');
                }
                
                // Send message to enable
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_FONTGRAB', 
                        enabled: true 
                    });
                    
                    if (response && response.success) {
                        fontgrabActive = true;
                        $('#fontgrab-toggle-btn .fontgrab-status').text('Disable');
                        $('#fontgrab-toggle-btn').removeClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange').addClass('tool-toggle-active');
                        logMessage('FontGrab enabled. Hover over text to see font details.', 'success');
                    } else {
                        logMessage('FontGrab failed to enable. Try refreshing the page.', 'error');
                    }
                } catch (e) {
                    logMessage(`Failed to communicate with content script: ${e.message}. Try refreshing the page.`, 'error');
                    // Try injecting again
                    try {
                        await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['whatfont_content.js'],
                        });
                        await new Promise(resolve => setTimeout(resolve, 200));
                        await chrome.tabs.sendMessage(tab.id, { 
                            type: 'TOGGLE_FONTGRAB', 
                            enabled: true 
                        });
                        fontgrabActive = true;
                        $('#fontgrab-toggle-btn .fontgrab-status').text('Disable');
                        $('#fontgrab-toggle-btn').removeClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange').addClass('tool-toggle-active');
                        logMessage('FontGrab enabled after retry.', 'success');
                    } catch (e2) {
                        logMessage(`FontGrab toggle failed: ${e2.message}`, 'error');
                    }
                }
            } else {
                // Disable FontGrab
                try {
                    await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_FONTGRAB', 
                        enabled: false 
                    });
                    
                    fontgrabActive = false;
                    $('#fontgrab-toggle-btn .fontgrab-status').text('Enable');
                    $('#fontgrab-toggle-btn').removeClass('tool-toggle-active');
                    $('#fontgrab-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('FontGrab disabled.', 'info');
                } catch (e) {
                    // If message fails, assume it's disabled anyway
                    fontgrabActive = false;
                    $('#fontgrab-toggle-btn .fontgrab-status').text('Enable');
                    $('#fontgrab-toggle-btn').removeClass('tool-toggle-active');
                    $('#fontgrab-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('FontGrab disabled.', 'info');
                }
            }
        } catch (error) {
            logMessage(`FontGrab toggle failed: ${error.message}`, 'error');
            console.error('FontGrab error:', error);
        }
        });
    }
    
    // Attach handler when DOM is ready
    $(document).ready(function() {
        attachFontGrabHandler();
    });
    
    // Also try immediately (in case DOM is already ready)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(attachFontGrabHandler, 100);
    }
    
    $('#save-font-btn').on('click', async () => {
        if (!currentFontData) {
            logMessage('No font data to save. Hover over text first.', 'warn');
            return;
        }
        await saveFontData(currentFontData);
    });

    let colorpickActive = false;
    let currentColorData = null;
    
    let screenrulerActive = false;
    
    // Attach handler directly to button
    function attachColorPickHandler() {
        $('#colorpick-toggle-btn').off('click').on('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            logMessage('ColorPick button clicked', 'info');
            try {
                const tab = await getActiveTab();
                logMessage(`Got tab: ${tab.id}`, 'info');
            
            // Check if tab is accessible
            if (!tab || !tab.id) {
                logMessage('Cannot access this tab. Try a regular webpage.', 'error');
                return;
            }
            
            // Check if it's a chrome:// page
            if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://'))) {
                logMessage('ColorPick cannot run on browser pages. Please navigate to a regular webpage.', 'error');
                return;
            }
            
            if (!colorpickActive) {
                // Disable other tools first
                await disableOtherTools('colorpick');
                
                // Enable ColorPick - try to inject script
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['colorpick_content.js'],
                    });
                    await new Promise(resolve => setTimeout(resolve, 200));
                    logMessage('ColorPick script injected.', 'info');
                } catch (e) {
                    logMessage(`Script injection: ${e.message}. Trying to send message anyway...`, 'warn');
                }
                
                // Send message to enable
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_COLORPICK', 
                        enabled: true 
                    });
                    
                    if (response && response.success) {
                        colorpickActive = true;
                        $('#colorpick-toggle-btn .colorpick-status').text('Disable');
                        $('#colorpick-toggle-btn').removeClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange').addClass('tool-toggle-active');
                        logMessage('ColorPick enabled. Hover over elements to see color details.', 'success');
                    } else {
                        logMessage('ColorPick failed to enable. Try refreshing the page.', 'error');
                    }
                } catch (e) {
                    logMessage(`Failed to communicate with content script: ${e.message}. Try refreshing the page.`, 'error');
                    // Try injecting again
                    try {
                        await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['colorpick_content.js'],
                        });
                        await new Promise(resolve => setTimeout(resolve, 200));
                        await chrome.tabs.sendMessage(tab.id, { 
                            type: 'TOGGLE_COLORPICK', 
                            enabled: true 
                        });
                        colorpickActive = true;
                        $('#colorpick-toggle-btn .colorpick-status').text('Disable');
                        $('#colorpick-toggle-btn').removeClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange').addClass('tool-toggle-active');
                        logMessage('ColorPick enabled after retry.', 'success');
                    } catch (e2) {
                        logMessage(`ColorPick toggle failed: ${e2.message}`, 'error');
                    }
                }
            } else {
                // Disable ColorPick
                try {
                    await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_COLORPICK', 
                        enabled: false 
                    });
                    
                    colorpickActive = false;
                    $('#colorpick-toggle-btn .colorpick-status').text('Enable');
                    $('#colorpick-toggle-btn').removeClass('tool-toggle-active');
                    $('#colorpick-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('ColorPick disabled.', 'info');
                } catch (e) {
                    // If message fails, assume it's disabled anyway
                    colorpickActive = false;
                    $('#colorpick-toggle-btn .colorpick-status').text('Enable');
                    $('#colorpick-toggle-btn').removeClass('tool-toggle-active');
                    $('#colorpick-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('ColorPick disabled.', 'info');
                }
            }
        } catch (error) {
            logMessage(`ColorPick toggle failed: ${error.message}`, 'error');
            console.error('ColorPick error:', error);
        }
        });
    }
    
    // Attach handler when DOM is ready
    $(document).ready(function() {
        attachColorPickHandler();
    });
    
    // Also try immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(attachColorPickHandler, 100);
    }
    
    // Attach handler directly to button
    function attachScreenRulerHandler() {
        $('#screenruler-toggle-btn').off('click').on('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            logMessage('ScreenRuler button clicked', 'info');
            try {
                const tab = await getActiveTab();
                console.log('Got active tab:', tab);
                logMessage(`Got tab: ${tab.id}`, 'info');
            
            // Check if tab is accessible
            if (!tab || !tab.id) {
                logMessage('Cannot access this tab. Try a regular webpage.', 'error');
                return;
            }
            
            // Check if it's a chrome:// page
            if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://'))) {
                logMessage('Screen Ruler cannot run on browser pages. Please navigate to a regular webpage.', 'error');
                return;
            }
            
            if (!screenrulerActive) {
                // Disable other tools first
                await disableOtherTools('screenruler');
                
                // Enable Screen Ruler - try to inject script
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['screenruler_content.js'],
                    });
                    await new Promise(resolve => setTimeout(resolve, 200));
                    logMessage('Screen Ruler script injected.', 'info');
                } catch (e) {
                    logMessage(`Script injection: ${e.message}. Trying to send message anyway...`, 'warn');
                }
                
                // Send message to enable
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_SCREENRULER', 
                        enabled: true 
                    });
                    
                    if (response && response.success) {
                        screenrulerActive = true;
                        $('#screenruler-toggle-btn .screenruler-status').text('Disable');
                        $('#screenruler-toggle-btn').removeClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange').addClass('tool-toggle-active');
                        logMessage('Screen Ruler enabled. Click and drag to measure distances.', 'success');
                    } else {
                        logMessage('Screen Ruler failed to enable. Try refreshing the page.', 'error');
                    }
                } catch (e) {
                    logMessage(`Failed to communicate with content script: ${e.message}. Try refreshing the page.`, 'error');
                    // Try injecting again
                    try {
                        await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['screenruler_content.js'],
                        });
                        await new Promise(resolve => setTimeout(resolve, 200));
                        await chrome.tabs.sendMessage(tab.id, { 
                            type: 'TOGGLE_SCREENRULER', 
                            enabled: true 
                        });
                        screenrulerActive = true;
                        $('#screenruler-toggle-btn .screenruler-status').text('Disable');
                        $('#screenruler-toggle-btn').removeClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange').addClass('tool-toggle-active');
                        logMessage('Screen Ruler enabled after retry.', 'success');
                    } catch (e2) {
                        logMessage(`Screen Ruler toggle failed: ${e2.message}`, 'error');
                    }
                }
            } else {
                // Disable Screen Ruler
                try {
                    await chrome.tabs.sendMessage(tab.id, { 
                        type: 'TOGGLE_SCREENRULER', 
                        enabled: false 
                    });
                    
                    screenrulerActive = false;
                    $('#screenruler-toggle-btn .screenruler-status').text('Enable');
                    $('#screenruler-toggle-btn').removeClass('tool-toggle-active');
                    $('#screenruler-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('Screen Ruler disabled.', 'info');
                } catch (e) {
                    // If message fails, assume it's disabled anyway
                    screenrulerActive = false;
                    $('#screenruler-toggle-btn .screenruler-status').text('Enable');
                    $('#screenruler-toggle-btn').removeClass('tool-toggle-active');
                    $('#screenruler-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('Screen Ruler disabled.', 'info');
                }
            }
        } catch (error) {
            logMessage(`Screen Ruler toggle failed: ${error.message}`, 'error');
            console.error('ScreenRuler error:', error);
        }
        });
    }
    
    // Attach handler when DOM is ready
    $(document).ready(function() {
        attachScreenRulerHandler();
    });
    
    // Also try immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(attachScreenRulerHandler, 100);
    }
    
    $('#save-color-btn').on('click', async () => {
        if (!currentColorData) {
            logMessage('No color data to save. Hover over a color first.', 'warn');
            return;
        }
        await saveColorData(currentColorData);
    });
    
    async function saveColorData(colorData) {
        if (!colorData) return;
        
        try {
            // Get hex value from colorData
            const hex = colorData.hex || colorData.rgb || '#000000';
            // Normalize hex to uppercase
            const normalizedHex = hex.toUpperCase();
            
            // Load colors array (simple array of hex strings)
            const saved = await chrome.storage.local.get(['forge-colors']);
            let colors = saved['forge-colors'] || [];
            
            // Check if already saved
            if (colors.includes(normalizedHex)) {
                logMessage('Color already saved.', 'warn');
                return;
            }
            
            // Add to beginning of array (unshift)
            colors.unshift(normalizedHex);
            await chrome.storage.local.set({ 'forge-colors': colors });
            
            logMessage(`Saved color: ${normalizedHex}`, 'success');
            loadSavedItems();
        } catch (error) {
            logMessage(`Failed to save color: ${error.message}`, 'error');
        }
    }
    
    // Helper function to save palette (following the pattern)
    async function savePalette() {
        const saved = await chrome.storage.local.get(['forge-colors']);
        const colors = saved['forge-colors'] || [];
        await chrome.storage.local.set({ 'forge-colors': colors });
    }
    
    async function saveAssetData(assetData) {
        if (!assetData || !assetData.url) return;
        
        try {
            const saved = await chrome.storage.local.get(['savedAssets']);
            const savedAssets = saved.savedAssets || [];
            
            // Check if already saved
            const exists = savedAssets.find(a => a.url === assetData.url);
            
            if (exists) {
                logMessage('Asset already saved.', 'warn');
                showNotification('Already saved!');
                return;
            }
            
            savedAssets.push({
                url: assetData.url,
                name: assetData.name || assetData.url.split('/').pop() || 'asset',
                type: assetData.type || 'asset',
                savedAt: new Date().toISOString()
            });
            
            await chrome.storage.local.set({ savedAssets });
            logMessage(`Saved asset: ${assetData.name}`, 'success');
            
            // Show notification
            if ($copiedNotification.length) {
                showNotification('Saved!');
            }
            
            loadSavedItems();
        } catch (error) {
            logMessage(`Failed to save asset: ${error.message}`, 'error');
        }
    }

    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message && (message.type === 'FONTGRAB_DATA' || message.type === 'WHATFONT_DATA')) {
                currentFontData = message.fontData;
                updateFontGrabDisplay(message.fontData);
            } else if (message && message.type === 'COLORPICK_DATA') {
                currentColorData = message.color;
                updateColorPickDisplay(message.color);
            } else if (message && message.type === 'SAVE_COLOR') {
                // Auto-save color when clicked
                saveColorData(message.color).then(() => {
                    sendResponse({ success: true });
                }).catch((err) => {
                    sendResponse({ success: false, error: err.message });
                });
                return true; // Keep channel open for async response
            } else if (message && message.type === 'SAVE_FONT') {
                // Auto-save font when clicked
                saveFontData(message.fontData).then(() => {
                    sendResponse({ success: true });
                }).catch((err) => {
                    sendResponse({ success: false, error: err.message });
                });
                return true; // Keep channel open for async response
            } else if (message && message.type === 'TOGGLE_FONTGRAB') {
                // Handle exit button click from content script
                if (!message.enabled && fontgrabActive) {
                    fontgrabActive = false;
                    $('#fontgrab-toggle-btn .fontgrab-status').text('Enable');
                    $('#fontgrab-toggle-btn').removeClass('tool-toggle-active');
                    $('#fontgrab-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('FontGrab disabled.', 'info');
                }
            } else if (message && message.type === 'TOGGLE_COLORPICK') {
                // Handle exit button click from content script
                if (!message.enabled && colorpickActive) {
                    colorpickActive = false;
                    $('#colorpick-toggle-btn .colorpick-status').text('Enable');
                    $('#colorpick-toggle-btn').removeClass('tool-toggle-active');
                    $('#colorpick-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('ColorPick disabled.', 'info');
                }
            } else if (message && message.type === 'TOGGLE_SCREENRULER') {
                // Handle exit button click from content script
                if (!message.enabled && screenrulerActive) {
                    screenrulerActive = false;
                    $('#screenruler-toggle-btn .screenruler-status').text('Enable');
                    $('#screenruler-toggle-btn').removeClass('tool-toggle-active');
                    $('#screenruler-toggle-btn').addClass('bg-bn-orange hover:bg-bn-orange-hover focus:ring-2 focus:ring-bn-orange');
                    logMessage('Screen Ruler disabled.', 'info');
                }
            }
            return true;
        });
    }
    
    async function saveFontData(fontData) {
        if (!fontData) return;
        
        try {
            const saved = await chrome.storage.local.get(['savedFonts']);
            const savedFonts = saved.savedFonts || [];
            
            // Check if already saved
            const exists = savedFonts.find(f => 
                f.family === fontData.family && 
                f.weight === fontData.weight && 
                f.style === fontData.style
            );
            
            if (exists) {
                logMessage('Font already saved.', 'warn');
                return;
            }
            
            savedFonts.push({
                ...fontData,
                savedAt: new Date().toISOString()
            });
            
            await chrome.storage.local.set({ savedFonts });
            logMessage(`Saved font: ${fontData.primaryFont}`, 'success');
            loadSavedItems();
        } catch (error) {
            logMessage(`Failed to save font: ${error.message}`, 'error');
        }
    }
    
    function updateFontGrabDisplay(fontData) {
        if (!fontData) return;
        // Font info is displayed in tooltip on the page, no need for popup display
    }
    
    function updateColorPickDisplay(colorData) {
        if (!colorData) return;
        // Color info is displayed in tooltip, no need for popup display
    }

    
    async function loadSavedItems() {
        try {
            const saved = await chrome.storage.local.get(['savedFonts', 'savedColors', 'savedAssets']);
            
            const savedFonts = saved.savedFonts || [];
            const savedColors = saved.savedColors || [];
            const savedAssets = saved.savedAssets || [];
            
            // Render saved fonts - improved UI
            if (savedFonts.length > 0) {
                $('#saved-fonts-section').show();
                $('#saved-fonts-count').text(savedFonts.length);
                $savedFontsList.empty();
                
                savedFonts.forEach((font, index) => {
                    const $item = $(`
                        <div class="bg-black rounded-xl border border-white/10 p-3.5 hover:border-bn-orange/50 transition-all group">
                            <div class="flex items-start justify-between">
                                <div class="flex items-start space-x-3 flex-1 min-w-0">
                                    <div class="w-12 h-12 bg-bn-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 ">
                                        <i class="fas fa-font text-bn-orange text-lg"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center space-x-2 mb-1.5">
                                            <p class="text-sm font-medium text-white font-heading">${_.escape(font.primaryFont)}</p>
                                            <span class="text-xs text-gray-400 bg-black/50 border border-white/10 px-2 py-0.5 rounded">${font.weight}</span>
                                        </div>
                                        <p class="text-xs text-gray-400 font-mono truncate mb-2" style="font-family: ${_.escape(font.family)};">${_.escape(font.family)}</p>
                                        <div class="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-2">
                                            <div><span class="text-gray-500">Size:</span> <span class="font-mono text-gray-300">${font.size}</span></div>
                                            <div><span class="text-gray-500">Style:</span> <span class="font-mono text-gray-300">${font.style}</span></div>
                                        </div>
                                        <div class="mt-2 p-2.5 bg-black/50 rounded border border-white/10" style="font-family: ${_.escape(font.family)}; font-weight: ${font.weight}; font-style: ${font.style}; color: ${font.color};">
                                            <span class="text-sm">${font.sampleText.substring(0, 40)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1 ml-3">
                                    <button class="saved-item-copy-btn opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-bn-orange text-xs py-1.5 px-2 rounded transition-all" data-text="${_.escape(font.family)}" title="Copy Font Family">
                                        <i class="fas fa-copy text-xs"></i>
                                    </button>
                                    <button class="saved-item-delete-btn opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs py-1.5 px-2 rounded transition-all" data-type="font" data-index="${index}" title="Delete">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);
                    $savedFontsList.append($item);
                });
            } else {
                $('#saved-fonts-section').hide();
            }
            
            // Render saved colors - improved UI
            // Load colors from new format (simple array of hex strings)
            const savedColorsData = await chrome.storage.local.get(['forge-colors']);
            const colors = savedColorsData['forge-colors'] || [];
            
            // Also check old format for backward compatibility
            const oldColors = savedColors || [];
            
            // Merge: convert old format to new format if needed
            let allColors = [...colors];
            oldColors.forEach(color => {
                const hex = color.hex || color.rgb || '#000000';
                const normalizedHex = hex.toUpperCase();
                if (!allColors.includes(normalizedHex)) {
                    allColors.push(normalizedHex);
                }
            });
            
            // Save merged colors in new format
            if (oldColors.length > 0 && colors.length === 0) {
                await chrome.storage.local.set({ 'forge-colors': allColors });
            }
            
            // Store for use in empty state check
            const totalColors = allColors.length;
            
            if (allColors.length > 0) {
                $('#saved-colors-section').show();
                $('#saved-colors-count').text(allColors.length);
                $savedColorsList.empty();
                
                allColors.forEach((hexValue, index) => {
                    // Normalize hex
                    const normalizedHex = hexValue.toUpperCase();
                    
                    const $item = $(`
                        <div class="relative h-20 rounded-md cursor-pointer group overflow-hidden color-hover" style="background-color: ${normalizedHex};">
                            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-white font-medium text-sm">Copy</span>
                            </div>
                        </div>
                    `);
                    
                    // Add click handler to copy and update active color
                    $item.on('click', function(e) {
                        copyToClipboard(normalizedHex, e);
                        // Update active color display if available
                        if (currentColorData) {
                            updateColorPickDisplay({ hex: normalizedHex });
                        }
                    });
                    
                    $savedColorsList.append($item);
                });
            } else {
                $('#saved-colors-section').hide();
            }
            
            // Render saved assets
            if (savedAssets.length > 0) {
                $('#saved-assets-section').show();
                $('#saved-assets-count').text(savedAssets.length);
                $savedAssetsList.empty();
                
                savedAssets.forEach((asset, index) => {
                    const $item = $(`
                        <div class="bg-black rounded-xl border border-white/10 p-3.5 hover:border-bn-orange/50 transition-all group">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3 flex-1 min-w-0">
                                    <div class="w-10 h-10 bg-bn-orange/10 rounded-lg flex items-center justify-center flex-shrink-0 ">
                                        <i class="fas fa-download text-bn-orange text-sm"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-white font-heading truncate mb-1">${_.escape(asset.name)}</p>
                                        <p class="text-xs text-gray-400 font-mono truncate">${_.escape(asset.url.substring(0, 60))}${asset.url.length > 60 ? '...' : ''}</p>
                                    </div>
                                </div>
                                <div class="flex gap-1 ml-3">
                                    <button class="saved-asset-download-btn opacity-0 group-hover:opacity-100 bg-bn-orange hover:bg-bn-orange-hover text-white text-xs py-1.5 px-2 rounded transition-all" data-url="${_.escape(asset.url)}" data-name="${_.escape(asset.name)}" title="Download">
                                        <i class="fas fa-download text-xs"></i>
                                    </button>
                                    <button class="saved-item-copy-btn opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-bn-orange text-xs py-1.5 px-2 rounded transition-all" data-text="${_.escape(asset.url)}" title="Copy URL">
                                        <i class="fas fa-copy text-xs"></i>
                                    </button>
                                    <button class="saved-item-delete-btn opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs py-1.5 px-2 rounded transition-all" data-type="asset" data-index="${index}" title="Delete">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);
                    $savedAssetsList.append($item);
                });
            } else {
                $('#saved-assets-section').hide();
            }
            
            // Show/hide empty state (check both old and new color formats)
            if (savedFonts.length === 0 && totalColors === 0 && savedAssets.length === 0) {
                $savedEmpty.show();
            } else {
                $savedEmpty.hide();
            }
        } catch (error) {
            logMessage(`Failed to load saved items: ${error.message}`, 'error');
        }
    }
    
    // Clear saved items
    $clearSavedBtn.on('click', async () => {
        const confirmed = await confirm('Are you sure you want to clear all saved items?');
        if (!confirmed) {
            return;
        }
        
        try {
            await chrome.storage.local.remove(['savedFonts', 'savedColors', 'savedAssets', 'forge-colors']);
            logMessage('All saved items cleared.', 'success');
            loadSavedItems();
        } catch (error) {
            logMessage(`Failed to clear saved items: ${error.message}`, 'error');
        }
    });
    
    // Handle delete buttons
    $(document).on('click', '.saved-item-delete-btn', async function() {
        const type = $(this).data('type');
        const index = $(this).data('index');
        
        const confirmed = await confirm('Are you sure you want to delete this item?');
        if (!confirmed) {
            return;
        }
        
        try {
            if (type === 'color') {
                // Use new format for colors
                const saved = await chrome.storage.local.get(['forge-colors']);
                let colors = saved['forge-colors'] || [];
                colors.splice(index, 1);
                await chrome.storage.local.set({ 'forge-colors': colors });
            } else {
                const key = type === 'font' ? 'savedFonts' : 'savedAssets';
                const saved = await chrome.storage.local.get([key]);
                const items = saved[key] || [];
                items.splice(index, 1);
                await chrome.storage.local.set({ [key]: items });
            }
            
            logMessage(`Deleted saved ${type}`, 'success');
            loadSavedItems();
        } catch (error) {
            logMessage(`Failed to delete: ${error.message}`, 'error');
        }
    });
    
    // Handle copy buttons for saved items
    $(document).on('click', '.saved-item-copy-btn', function(e) {
        e.stopPropagation();
        const text = $(this).data('text');
        copyToClipboard(text, $(this));
    });
    
    // Handle download button for saved assets
    $(document).on('click', '.saved-asset-download-btn', async function(e) {
        const url = $(this).data('url');
        const name = $(this).data('name') || 'asset';
        
        try {
            logMessage(`Downloading ${name}...`, 'info');
            showNotification('Download starting...');
            
            await chrome.downloads.download({
                url: url,
                filename: name,
                saveAs: false
            });
            
            logMessage(`Downloaded ${name}`, 'success');
        } catch (error) {
            logMessage(`Download failed: ${error.message}`, 'error');
            showNotification('Download Failed!');
        }
    });

    // Load saved items on initialization
    loadSavedItems();

    const $toolsHeader = $('#tools-header');
    const $toolsList = $('#tools-list');
    const $toolsChevron = $('#tools-chevron');
    
    // Load collapsed state from localStorage - always collapsed on load
    async function loadToolsState() {
        try {
            // Always collapse on load regardless of saved state
            $toolsList.removeClass('expanded');
            $toolsChevron.css('transform', 'rotate(-90deg)');
            // Save collapsed state
            await chrome.storage.local.set({ toolsCollapsed: true });
        } catch (error) {
            // Default to collapsed if there's an error
            $toolsList.removeClass('expanded');
            $toolsChevron.css('transform', 'rotate(-90deg)');
        }
    }
    
    // Helper function to collapse tools section
    async function collapseTools() {
        if ($toolsList.hasClass('expanded')) {
            $toolsList.removeClass('expanded');
            $toolsChevron.css('transform', 'rotate(-90deg)');
            await chrome.storage.local.set({ toolsCollapsed: true });
        }
    }
    
    // Toggle tools section
    $toolsHeader.on('click', async () => {
        const isExpanded = $toolsList.hasClass('expanded');
        
        if (isExpanded) {
            // Get current height before collapsing
            const currentHeight = $toolsList[0].scrollHeight;
            $toolsList.css('max-height', currentHeight + 'px');
            // Force reflow
            $toolsList[0].offsetHeight;
            // Now animate to 0
            $toolsList.css('max-height', '0');
            $toolsList.removeClass('expanded');
            $toolsChevron.css('transform', 'rotate(-90deg)');
            await chrome.storage.local.set({ toolsCollapsed: true });
            // Clear inline style after animation
            setTimeout(() => {
                if (!$toolsList.hasClass('expanded')) {
                    $toolsList.css('max-height', '');
                }
            }, 500);
        } else {
            // Temporarily show to measure actual content height
            $toolsList.css('max-height', 'none').css('display', 'block');
            const actualHeight = $toolsList[0].scrollHeight + 10; // Add padding for margin
            // Reset to collapsed state first
            $toolsList.css('max-height', '0').css('display', 'block');
            // Force reflow to ensure 0 is applied
            $toolsList[0].offsetHeight;
            // Use requestAnimationFrame to ensure transition is ready
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Now animate to actual height
                        $toolsList.css('max-height', actualHeight + 'px');
                        $toolsList.addClass('expanded');
                        resolve();
                    });
                });
            });
            $toolsChevron.css('transform', 'rotate(0deg)');
            await chrome.storage.local.set({ toolsCollapsed: false });
        }
    });
    
    // Load tools state on initialization
    loadToolsState();

    const $promptsHeader = $('#prompts-header');
    const $promptsList = $('#prompts-list');
    const $promptsChevron = $('#prompts-chevron');
    const $templatePrompts = $('#template-prompts');
    const $savedPromptsList = $('#saved-prompts-list');
    const $newPromptText = $('#new-prompt-text');
    const $savePromptBtn = $('#save-prompt-btn');
    
    // Default template prompts
    const templatePrompts = [
        {
            title: 'Code Review',
            text: 'Review this code and provide feedback on:\n- Code quality and best practices\n- Potential bugs or issues\n- Performance optimizations\n- Security concerns\n- Code readability and maintainability'
        },
        {
            title: 'Refactor Code',
            text: 'Refactor this code to:\n- Improve readability and maintainability\n- Follow best practices\n- Optimize performance\n- Add proper error handling\n- Include comments where necessary'
        },
        {
            title: 'Debug Help',
            text: 'Help me debug this issue:\n- Error description: [describe error]\n- Expected behavior: [what should happen]\n- Actual behavior: [what actually happens]\n- Code/context: [relevant code]\n\nPlease analyze and suggest solutions.'
        },
        {
            title: 'Explain Code',
            text: 'Explain this code in detail:\n- What does it do?\n- How does it work?\n- What are the key components?\n- Are there any potential issues?'
        },
        {
            title: 'Generate Tests',
            text: 'Generate comprehensive unit tests for this code:\n- Test all edge cases\n- Test error handling\n- Include positive and negative test cases\n- Use appropriate testing framework'
        },
        {
            title: 'Optimize Performance',
            text: 'Analyze and optimize this code for performance:\n- Identify bottlenecks\n- Suggest optimizations\n- Consider memory usage\n- Consider time complexity\n- Provide optimized version'
        }
    ];
    
    // Load prompts state - always collapsed on load
    async function loadPromptsState() {
        try {
            // Always collapse on load regardless of saved state
            $promptsList.removeClass('expanded');
            $promptsChevron.css('transform', 'rotate(-90deg)');
            // Save collapsed state
            await chrome.storage.local.set({ promptsCollapsed: true });
        } catch (error) {
            $promptsList.removeClass('expanded');
            $promptsChevron.css('transform', 'rotate(-90deg)');
        }
    }
    
    // Toggle prompts section
    $promptsHeader.on('click', async () => {
        const isExpanded = $promptsList.hasClass('expanded');
        
        if (isExpanded) {
            // Get current height before collapsing
            const currentHeight = $promptsList[0].scrollHeight;
            $promptsList.css('max-height', currentHeight + 'px');
            // Force reflow
            $promptsList[0].offsetHeight;
            // Now animate to 0
            $promptsList.css('max-height', '0');
            $promptsList.removeClass('expanded');
            $promptsChevron.css('transform', 'rotate(-90deg)');
            await chrome.storage.local.set({ promptsCollapsed: true });
            // Clear inline style after animation
            setTimeout(() => {
                if (!$promptsList.hasClass('expanded')) {
                    $promptsList.css('max-height', '');
                }
            }, 500);
        } else {
            // Render content first to get accurate height
            renderPrompts();
            // Wait a moment for content to render
            await new Promise(resolve => setTimeout(resolve, 10));
            // Temporarily show to measure actual content height
            $promptsList.css('max-height', 'none').css('display', 'block');
            const actualHeight = $promptsList[0].scrollHeight + 10; // Add padding for margin
            // Reset to collapsed state first
            $promptsList.css('max-height', '0').css('display', 'block');
            // Force reflow to ensure 0 is applied
            $promptsList[0].offsetHeight;
            // Use requestAnimationFrame to ensure transition is ready
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Now animate to actual height
                        $promptsList.css('max-height', actualHeight + 'px');
                        $promptsList.addClass('expanded');
                        resolve();
                    });
                });
            });
            $promptsChevron.css('transform', 'rotate(0deg)');
            await chrome.storage.local.set({ promptsCollapsed: false });
        }
    });
    
    // Render template prompts
    function renderTemplatePrompts() {
        $templatePrompts.empty();
        
        templatePrompts.forEach((prompt, index) => {
            const $promptCard = $(`
                <div class="bg-bn-dark p-3.5 rounded-xl transition-all duration-200 group prompt-card cursor-grab hover:shadow-lg hover:shadow-bn-orange/10 hover:-translate-y-0.5" draggable="true" data-prompt-text="${_.escape(prompt.text)}" style="border: 1px dashed rgba(212, 97, 28, 0.5);">
                    <div class="flex items-start justify-between gap-2 mb-2.5">
                        <h4 class="text-sm font-medium text-white font-heading leading-tight">${_.escape(prompt.title)}</h4>
                        <button class="prompt-copy-btn opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 hover:bg-white/10 rounded-md transition-all duration-200" data-prompt="${_.escape(prompt.text)}" title="Copy prompt">
                            <i class="fas fa-copy text-gray-400 hover:text-bn-orange text-[10px]" style="font-size: 10px;"></i>
                        </button>
                    </div>
                    <p class="text-xs text-gray-400 whitespace-pre-wrap line-clamp-3 leading-relaxed mb-2">${_.escape(prompt.text)}</p>
                    <div class="text-xs text-gray-500 mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5">
                        <i class="fas fa-grip-vertical text-gray-600"></i>
                        <span class="text-gray-500">Drag to input field</span>
                    </div>
                </div>
            `);
            
            // Add drag functionality
            $promptCard.on('dragstart', function(e) {
                const promptText = prompt.text;
                const dataTransfer = e.originalEvent.dataTransfer;
                
                // Set drag data for native drop support
                dataTransfer.setData('text/plain', promptText);
                dataTransfer.effectAllowed = 'copy';
                
                // Also copy to clipboard as fallback (silently)
                try {
                    $copyHelper.val(promptText).select();
                    document.execCommand('copy');
                } catch (err) {
                    // Ignore clipboard errors during drag
                }
                
                $(this).addClass('opacity-50 cursor-grabbing scale-95');
            });
            
            $promptCard.on('dragend', function(e) {
                $(this).removeClass('opacity-50 cursor-grabbing scale-95');
                // Show feedback that content is ready to paste
                if (e.originalEvent && e.originalEvent.clientX) {
                    showActionFeedback('Copied to clipboard!', e.originalEvent);
                }
            });
            
            $templatePrompts.append($promptCard);
        });
    }
    
    // Load and render saved prompts
    async function loadSavedPrompts() {
        try {
            const saved = await chrome.storage.local.get(['savedPrompts']);
            const savedPrompts = saved.savedPrompts || [];
            
            $savedPromptsList.empty();
            
            if (savedPrompts.length === 0) {
                $savedPromptsList.append('<p class="text-xs text-gray-500 text-center py-4 italic">No saved prompts yet. Create your first one above!</p>');
                return;
            }
            
            savedPrompts.forEach((prompt, index) => {
                const $promptCard = $(`
                    <div class="bg-bn-dark p-3.5 rounded-xl transition-all duration-200 group prompt-card cursor-grab hover:shadow-lg hover:shadow-bn-orange/10 hover:-translate-y-0.5" draggable="true" data-prompt-text="${_.escape(prompt.text)}" style="border: 1px dashed rgba(212, 97, 28, 0.5);">
                        <div class="flex items-start justify-between gap-2 mb-2.5">
                            <h4 class="text-sm font-medium text-white font-heading leading-tight">${_.escape(prompt.title || 'Untitled Prompt')}</h4>
                            <div class="flex gap-1">
                                <button class="prompt-copy-btn opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 hover:bg-white/10 rounded-md transition-all duration-200" data-prompt="${_.escape(prompt.text)}" title="Copy prompt">
                                    <i class="fas fa-copy text-gray-400 hover:text-bn-orange text-[10px]" style="font-size: 10px;"></i>
                                </button>
                                <button class="prompt-delete-btn opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 hover:bg-white/10 rounded-md transition-all duration-200" data-index="${index}" title="Delete prompt">
                                    <i class="fas fa-trash text-gray-400 hover:text-red-400 text-[10px]" style="font-size: 10px;"></i>
                                </button>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400 whitespace-pre-wrap line-clamp-3 leading-relaxed mb-2">${_.escape(prompt.text)}</p>
                        <div class="text-xs text-gray-500 mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5">
                            <i class="fas fa-grip-vertical text-gray-600"></i>
                            <span class="text-gray-500">Drag to input field</span>
                        </div>
                    </div>
                `);
                
                // Add drag functionality
                $promptCard.on('dragstart', function(e) {
                    const promptText = prompt.text;
                    const dataTransfer = e.originalEvent.dataTransfer;
                    
                    // Set drag data for native drop support
                    dataTransfer.setData('text/plain', promptText);
                    dataTransfer.effectAllowed = 'copy';
                    
                    // Also copy to clipboard as fallback (silently)
                    try {
                        $copyHelper.val(promptText).select();
                        document.execCommand('copy');
                    } catch (err) {
                        // Ignore clipboard errors during drag
                    }
                    
                    $(this).addClass('opacity-50 cursor-grabbing scale-95');
                });
                
                $promptCard.on('dragend', function(e) {
                    $(this).removeClass('opacity-50 cursor-grabbing scale-95');
                    // Show feedback that content is ready to paste
                    if (e.originalEvent && e.originalEvent.clientX) {
                        showActionFeedback('Copied to clipboard!', e.originalEvent);
                    }
                });
                
                $savedPromptsList.append($promptCard);
            });
        } catch (error) {
            logMessage(`Failed to load saved prompts: ${error.message}`, 'error');
        }
    }
    
    // Render all prompts
    function renderPrompts() {
        renderTemplatePrompts();
        loadSavedPrompts();
    }
    
    // Save new prompt
    $savePromptBtn.on('click', async () => {
        const promptText = $newPromptText.val().trim();
        
        if (!promptText) {
            logMessage('Please enter a prompt.', 'warn');
            return;
        }
        
        try {
            const saved = await chrome.storage.local.get(['savedPrompts']);
            const savedPrompts = saved.savedPrompts || [];
            
            // Check for duplicates
            const exists = savedPrompts.find(p => p.text === promptText);
            if (exists) {
                logMessage('This prompt is already saved.', 'warn');
                return;
            }
            
            // Extract title from first line or use default
            const firstLine = promptText.split('\n')[0];
            const title = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
            
            savedPrompts.push({
                title: title || 'Untitled Prompt',
                text: promptText,
                savedAt: new Date().toISOString()
            });
            
            await chrome.storage.local.set({ savedPrompts });
            
            $newPromptText.val('');
            logMessage('Prompt saved successfully!', 'success');
            loadSavedPrompts();
        } catch (error) {
            logMessage(`Failed to save prompt: ${error.message}`, 'error');
        }
    });
    
    // Copy prompt
    $(document).on('click', '.prompt-copy-btn', function() {
        const promptText = $(this).data('prompt');
        copyToClipboard(promptText, $(this));
    });
    
    // Delete saved prompt
    $(document).on('click', '.prompt-delete-btn', async function() {
        const index = $(this).data('index');
        
        const confirmed = await confirm('Are you sure you want to delete this item?');
        if (!confirmed) {
            return;
        }
        
        try {
            const saved = await chrome.storage.local.get(['savedPrompts']);
            const savedPrompts = saved.savedPrompts || [];
            
            savedPrompts.splice(index, 1);
            
            await chrome.storage.local.set({ savedPrompts });
            logMessage('Prompt deleted.', 'success');
            loadSavedPrompts();
        } catch (error) {
            logMessage(`Failed to delete prompt: ${error.message}`, 'error');
        }
    });
    
    // Load prompts state on initialization
    loadPromptsState();

    const $knowledgeHeader = $('#knowledge-header');
    const $knowledgeList = $('#knowledge-list');
    const $knowledgeChevron = $('#knowledge-chevron');
    const $savedKnowledgeList = $('#saved-knowledge-list');
    const $knowledgeFieldsContainer = $('#knowledge-fields-container');
    const $saveKnowledgeBtn = $('#save-knowledge-btn');
    
    let fieldCounter = 0;
    
    // Field templates
    const fieldTemplates = {
        assetUrl: {
            label: 'Image/Video URL',
            placeholder: 'https://example.com/image.jpg',
            type: 'input'
        },
        name: {
            label: 'Project/Business Name',
            placeholder: 'My Project',
            type: 'input'
        },
        about: {
            label: 'About Me / Project Description',
            placeholder: 'Describe your project or business...',
            type: 'textarea'
        },
        info: {
            label: 'Additional Info',
            placeholder: 'Any additional information...',
            type: 'textarea'
        }
    };
    
    // Create a field section
    function createFieldSection(fieldType, value = '') {
        const template = fieldTemplates[fieldType];
        const id = `knowledge-field-${fieldType}-${fieldCounter++}`;
        const isTextarea = template.type === 'textarea';
        const isAssetUrl = fieldType === 'assetUrl';
        
        const $field = $(`
            <div class="knowledge-field-item bg-black/30 p-2.5 rounded-lg cursor-move relative group transition-all duration-200 hover:bg-black/40" style="border: 1px dashed rgba(212, 97, 28, 0.5);" data-field-type="${fieldType}">
                <div class="flex items-center justify-between mb-1.5">
                    <label class="text-xs text-gray-400 flex items-center gap-2 leading-relaxed">
                        <i class="fas fa-grip-vertical text-gray-500 text-xs"></i>
                        ${template.label} <span class="text-gray-500">(optional)</span>
                    </label>
                    <button class="knowledge-field-add-btn opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 bg-bn-orange/10 hover:bg-bn-orange/20 rounded-md transition-all duration-200" data-field-type="${fieldType}" title="Add another ${template.label}">
                        <i class="fas fa-plus text-bn-orange text-xs"></i>
                    </button>
                </div>
                <div class="flex gap-2 items-start">
                    ${isTextarea ? 
                        `<textarea class="knowledge-field-input flex-1 bg-black text-white text-sm rounded-xl p-2.5 border border-white/10 focus:border-bn-orange focus:outline-none resize-none transition-all duration-200 leading-relaxed" rows="2" placeholder="${template.placeholder}" data-field-type="${fieldType}">${_.escape(value)}</textarea>` :
                        `<input type="text" class="knowledge-field-input flex-1 bg-black text-white text-sm rounded-xl p-2.5 border border-white/10 focus:border-bn-orange focus:outline-none transition-all duration-200" placeholder="${template.placeholder}" value="${_.escape(value)}" data-field-type="${fieldType}">`
                    }
                    ${isAssetUrl ? `
                        <input type="file" class="knowledge-upload-input hidden" accept="image/*,video/*" data-field-id="${id}">
                        <button class="knowledge-upload-btn flex-shrink-0 p-2.5 bg-bn-orange/10 hover:bg-bn-orange/20 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md" data-field-id="${id}" title="Upload image/video">
                            <i class="fas fa-upload text-bn-orange text-xs"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `);
        
        // Make draggable
        $field.attr('draggable', 'true');
        
        // Set up upload button for assetUrl fields
        if (isAssetUrl) {
            const $uploadBtn = $field.find('.knowledge-upload-btn');
            const $fileInput = $field.find('.knowledge-upload-input');
            const $urlInput = $field.find('.knowledge-field-input');
            
            $uploadBtn.on('click', function(e) {
                e.stopPropagation();
                $fileInput.click();
            });
            
            $fileInput.on('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Check file size (GitHub API limit is ~1MB for base64, but we'll allow up to 50MB and warn)
                    const maxSize = 50 * 1024 * 1024; // 50MB
                    if (file.size > maxSize) {
                        logMessage('File is too large. Please use a file smaller than 50MB.', 'warn');
                        $(this).val(''); // Clear file input
                        return;
                    }
                    uploadImageToGitHub(file, $urlInput, $uploadBtn);
                }
            });
        }
        
        return $field;
    }
    
    // Initialize fields
    function initializeKnowledgeFields() {
        $knowledgeFieldsContainer.empty();
        
        // Add one of each field type initially
        Object.keys(fieldTemplates).forEach(fieldType => {
            $knowledgeFieldsContainer.append(createFieldSection(fieldType));
        });
        
        // Set up drag and drop
        setupFieldDragDrop();
        
        // Set up add button handlers
        $(document).off('click', '.knowledge-field-add-btn').on('click', '.knowledge-field-add-btn', function(e) {
            e.stopPropagation();
            const fieldType = $(this).data('field-type');
            const $newField = createFieldSection(fieldType);
            $(this).closest('.knowledge-field-item').after($newField);
            setupFieldDragDrop();
        });
        
        // Re-setup drag drop when fields are dynamically added
        $(document).on('DOMNodeInserted', '.knowledge-field-input', function() {
            setupFieldDragDrop();
        });
    }
    
    // Set up drag and drop for fields
    function setupFieldDragDrop() {
        $('.knowledge-field-item').off('dragstart dragend dragover dragenter drop');
        
        $('.knowledge-field-item').on('dragstart', function(e) {
            $(this).addClass('opacity-50');
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('text/html', this.outerHTML);
            $(this).attr('data-dragging', 'true');
        });
        
        $('.knowledge-field-item').on('dragend', function() {
            $('.knowledge-field-item').removeClass('opacity-50');
            $('.knowledge-field-item').removeAttr('data-dragging');
        });
        
        $('.knowledge-field-item').on('dragover dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!$(this).attr('data-dragging')) {
                $(this).addClass('border-bn-orange/50');
            }
        });
        
        $('.knowledge-field-item').on('dragleave', function() {
            $(this).removeClass('border-bn-orange/50');
        });
        
        $('.knowledge-field-item').on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('border-bn-orange/50');
            
            const $dragging = $('.knowledge-field-item[data-dragging="true"]');
            if ($dragging.length && $dragging[0] !== this) {
                const $this = $(this);
                if ($dragging.index() < $this.index()) {
                    $this.after($dragging);
                } else {
                    $this.before($dragging);
                }
                setupFieldDragDrop();
            }
        });
        
        // Enable drop on knowledge input fields for knowledge bubbles
        $('.knowledge-field-input').off('dragover dragenter dragleave drop');
        
        $('.knowledge-field-input').on('dragover dragenter', function(e) {
            // Only allow drop if it's from a knowledge bubble (not from field reordering)
            const dataTransfer = e.originalEvent.dataTransfer;
            if (dataTransfer && dataTransfer.types && dataTransfer.types.includes('text/plain')) {
                e.preventDefault();
                e.stopPropagation();
                $(this).addClass('border-bn-orange ring-2 ring-bn-orange/30');
            }
        });
        
        $('.knowledge-field-input').on('dragleave', function(e) {
            // Only remove highlight if we're actually leaving the input
            const relatedTarget = e.relatedTarget;
            if (!relatedTarget || !$(relatedTarget).closest('.knowledge-field-input').length) {
                $(this).removeClass('border-bn-orange ring-2 ring-bn-orange/30');
            }
        });
        
        $('.knowledge-field-input').on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('border-bn-orange ring-2 ring-bn-orange/30');
            
            const dataTransfer = e.originalEvent.dataTransfer;
            if (dataTransfer && dataTransfer.types && dataTransfer.types.includes('text/plain')) {
                const droppedText = dataTransfer.getData('text/plain') || dataTransfer.getData('text');
                if (droppedText) {
                    const $input = $(this);
                    const currentValue = $input.val();
                    
                    // If input already has content, append with newline, otherwise replace
                    if (currentValue && currentValue.trim()) {
                        $input.val(currentValue + '\n\n' + droppedText);
                    } else {
                        $input.val(droppedText);
                    }
                    
                    // Trigger input event to notify any listeners
                    $input.trigger('input');
                    
                    // Visual feedback
                    $input.addClass('bg-bn-orange/10');
                    setTimeout(() => {
                        $input.removeClass('bg-bn-orange/10');
                    }, 500);
                    
                    showActionFeedback('Knowledge bubble dropped!', e);
                }
            }
        });
    }
    
    // Format knowledge bubble as text - handles arrays and backward compatibility
    // Optimized for AI model readability
    function formatKnowledgeAsText(bubble) {
        const sections = [];
        
        // Helper to process field values
        const processField = (label, values) => {
            if (!values) return null;
            
            // Handle old single-value format
            if (typeof values === 'string') {
                return values.trim() ? { label, items: [values.trim()] } : null;
            }
            
            // Handle array format
            if (!Array.isArray(values) || values.length === 0) return null;
            
            const items = values.filter(item => item && item.trim()).map(item => item.trim());
            return items.length > 0 ? { label, items } : null;
        };
        
        // Collect all sections
        const nameSection = bubble.names ? processField('Project/Business Name', bubble.names) : 
                          (bubble.name ? processField('Project/Business Name', bubble.name) : null);
        
        const aboutSection = bubble.abouts ? processField('About Me / Project Description', bubble.abouts) :
                           (bubble.about ? processField('About Me / Project Description', bubble.about) : null);
        
        const infoSection = bubble.infos ? processField('Additional Info', bubble.infos) :
                          (bubble.info ? processField('Additional Info', bubble.info) : null);
        
        const assetSection = bubble.assetUrls ? processField('Assets', bubble.assetUrls) :
                           (bubble.assetUrl ? processField('Assets', bubble.assetUrl) : null);
        
        // Build formatted text with proper structure
        if (nameSection) {
            if (nameSection.items.length === 1) {
                sections.push(`Project/Business Name: ${nameSection.items[0]}`);
            } else {
                nameSection.items.forEach((item, index) => {
                    sections.push(`Project/Business Name ${index + 1}: ${item}`);
                });
            }
        }
        
        if (aboutSection) {
            sections.push(''); // Empty line separator
            sections.push('About Me / Project Description:');
            aboutSection.items.forEach((item, index) => {
                if (aboutSection.items.length > 1) {
                    sections.push(`${index + 1}. ${item}`);
                } else {
                    sections.push(item);
                }
            });
        }
        
        if (infoSection) {
            sections.push(''); // Empty line separator
            sections.push('Additional Info:');
            infoSection.items.forEach((item, index) => {
                if (infoSection.items.length > 1) {
                    sections.push(`${index + 1}. ${item}`);
                } else {
                    sections.push(item);
                }
            });
        }
        
        if (assetSection) {
            sections.push(''); // Empty line separator
            sections.push('Assets:');
            assetSection.items.forEach((item, index) => {
                if (assetSection.items.length > 1) {
                    sections.push(`${index + 1}. ${item}`);
                } else {
                    sections.push(item);
                }
            });
        }
        
        return sections.join('\n');
    }
    
    // Upload image to GitHub
    async function uploadImageToGitHub(file, $urlInput, $uploadBtn) {
        try {
            // Get GitHub settings
            const settings = await chrome.storage.local.get(['githubApiKey', 'githubRepoName']);
            
            if (!settings.githubApiKey || !settings.githubRepoName) {
                logMessage('Please configure GitHub API settings in the Settings tab first.', 'warn');
                // Switch to settings tab
                $('.tab-btn[data-tab="settings"]').click();
                return;
            }
            
            // Show uploading state
            const originalHtml = $uploadBtn.html();
            $uploadBtn.html('<i class="fas fa-spinner fa-spin text-bn-orange text-xs"></i>').prop('disabled', true);
            $urlInput.val('Uploading...').prop('disabled', true);
            
            // Read file as base64
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const base64Content = e.target.result.split(',')[1];
                    const fileName = `knowledge-assets/${Date.now()}-${file.name}`;
                    const fileExtension = file.name.split('.').pop();
                    
                    // Determine content type
                    let contentType = 'image/png';
                    if (file.type) {
                        contentType = file.type;
                    } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
                        contentType = 'image/jpeg';
                    } else if (fileExtension === 'gif') {
                        contentType = 'image/gif';
                    } else if (fileExtension === 'webp') {
                        contentType = 'image/webp';
                    } else if (fileExtension === 'mp4' || fileExtension === 'webm') {
                        contentType = `video/${fileExtension}`;
                    }
                    
                    // GitHub API: Create or update file
                    const apiUrl = `https://api.github.com/repos/${settings.githubRepoName}/contents/${fileName}`;
                    
                    const response = await fetch(apiUrl, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${settings.githubApiKey}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json',
                            'X-GitHub-Api-Version': '2022-11-28'
                        },
                        body: JSON.stringify({
                            message: `Upload ${file.name} via Knowledge Bubble`,
                            content: base64Content
                        })
                    });
                    
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Failed to upload to GitHub');
                    }
                    
                    const result = await response.json();
                    
                    // Get default branch (usually 'main' or 'master')
                    const repoResponse = await fetch(`https://api.github.com/repos/${settings.githubRepoName}`, {
                        headers: {
                            'Authorization': `Bearer ${settings.githubApiKey}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'X-GitHub-Api-Version': '2022-11-28'
                        }
                    });
                    
                    let branch = 'main';
                    if (repoResponse.ok) {
                        const repoData = await repoResponse.json();
                        branch = repoData.default_branch || 'main';
                    }
                    
                    // Generate raw GitHub URL
                    const rawUrl = `https://raw.githubusercontent.com/${settings.githubRepoName}/${branch}/${fileName}`;
                    
                    // Update input field
                    $urlInput.val(rawUrl).prop('disabled', false);
                    $uploadBtn.html(originalHtml).prop('disabled', false);
                    
                    logMessage('Image uploaded successfully!', 'success');
                    const btnOffset = $uploadBtn.offset();
                    showActionFeedback('Uploaded!', { 
                        clientX: btnOffset.left + $uploadBtn.width() / 2, 
                        clientY: btnOffset.top 
                    });
                    
                } catch (error) {
                    $urlInput.val('').prop('disabled', false);
                    $uploadBtn.html(originalHtml).prop('disabled', false);
                    logMessage(`Upload failed: ${error.message}`, 'error');
                    const btnOffset = $uploadBtn.offset();
                    showActionFeedback('Upload failed', { 
                        clientX: btnOffset.left + $uploadBtn.width() / 2, 
                        clientY: btnOffset.top 
                    });
                }
            };
            
            reader.onerror = function() {
                $urlInput.val('').prop('disabled', false);
                $uploadBtn.html(originalHtml).prop('disabled', false);
                logMessage('Failed to read file.', 'error');
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            logMessage(`Upload error: ${error.message}`, 'error');
        }
    }
    
    // Load GitHub settings
    async function loadGitHubSettings() {
        try {
            const settings = await chrome.storage.local.get(['githubApiKey', 'githubRepoName']);
            if (settings.githubApiKey) {
                $('#github-api-key').val(settings.githubApiKey);
            }
            if (settings.githubRepoName) {
                $('#github-repo-name').val(settings.githubRepoName);
            }
        } catch (error) {
            logMessage(`Failed to load GitHub settings: ${error.message}`, 'error');
        }
    }
    
    // Save GitHub settings
    $('#save-github-settings-btn').on('click', async function() {
        const apiKey = $('#github-api-key').val().trim();
        const repoName = $('#github-repo-name').val().trim();
        
        if (!apiKey || !repoName) {
            logMessage('Please enter both GitHub API key and repository name.', 'warn');
            return;
        }
        
        // Validate repo name format
        if (!/^[\w\-\.]+\/[\w\-\.]+$/.test(repoName)) {
            logMessage('Repository name must be in format: username/repo-name', 'warn');
            return;
        }
        
        try {
            await chrome.storage.local.set({
                githubApiKey: apiKey,
                githubRepoName: repoName
            });
            
            logMessage('GitHub settings saved successfully!', 'success');
        } catch (error) {
            logMessage(`Failed to save GitHub settings: ${error.message}`, 'error');
        }
    });
    
    // Load GitHub settings when Settings tab is opened
    $(document).on('click', '.tab-btn[data-tab="settings"]', function() {
        loadGitHubSettings();
        loadBookmarkBarSettings();
        loadLanguageSettings();
    });
    
    async function loadBookmarkBarSettings() {
        try {
            const saved = await chrome.storage.local.get(['bookmarkBarEnabled']);
            const enabled = saved.bookmarkBarEnabled !== false; // Default to true
            $('#bookmark-bar-toggle').prop('checked', enabled);
            toggleBookmarkBar(enabled);
        } catch (error) {
            logMessage(`Failed to load bookmark bar settings: ${error.message}`, 'error');
        }
    }
    
    function toggleBookmarkBar(enabled) {
        const $bookmarksBar = $('#bookmarks-bar');
        if (enabled) {
            $bookmarksBar.show();
        } else {
            $bookmarksBar.hide();
        }
    }
    
    $('#bookmark-bar-toggle').on('change', async function() {
        const enabled = $(this).is(':checked');
        await chrome.storage.local.set({ bookmarkBarEnabled: enabled });
        toggleBookmarkBar(enabled);
        logMessage(enabled ? 'Bookmark bar enabled' : 'Bookmark bar disabled', 'success');
    });
    
    const translations = {
        en: {
            tools: 'Tools',
            prompts: 'Prompts',
            knowledge: 'Knowledge',
            settings: 'Settings',
            general_settings: 'General Settings',
            show_bookmark_bar: 'Show Bookmark Bar',
            bookmark_bar_desc: 'Toggle visibility of the bookmark bar at the top',
            language: 'Language',
            language_desc: 'Change the interface language',
            lang_en: 'English',
            lang_es: 'Español',
            lang_zh: '中文',
            lang_hi: 'हिन्दी',
            lang_fr: 'Français',
            github_api: 'GitHub API Configuration',
            github_api_desc: 'Configure GitHub API to upload images for Knowledge bubbles.',
            github_token: 'GitHub Personal Access Token',
            github_token_desc: 'Create a token with repo permission at github.com/settings/tokens',
            github_repo: 'Repository Name',
            github_repo_desc: 'Format: username/repository-name',
            save_github_settings: 'Save GitHub Settings'
        },
        es: {
            tools: 'Herramientas',
            prompts: 'Prompts',
            knowledge: 'Conocimiento',
            settings: 'Configuración',
            general_settings: 'Configuración General',
            show_bookmark_bar: 'Mostrar Barra de Marcadores',
            bookmark_bar_desc: 'Alternar visibilidad de la barra de marcadores en la parte superior',
            language: 'Idioma',
            language_desc: 'Cambiar el idioma de la interfaz',
            lang_en: 'English',
            lang_es: 'Español',
            lang_zh: '中文',
            lang_hi: 'हिन्दी',
            lang_fr: 'Français',
            github_api: 'Configuración de API de GitHub',
            github_api_desc: 'Configure la API de GitHub para cargar imágenes para las burbujas de conocimiento.',
            github_token: 'Token de Acceso Personal de GitHub',
            github_token_desc: 'Cree un token con permiso repo en github.com/settings/tokens',
            github_repo: 'Nombre del Repositorio',
            github_repo_desc: 'Formato: usuario/nombre-repositorio',
            save_github_settings: 'Guardar Configuración de GitHub'
        },
        zh: {
            tools: '工具',
            prompts: '提示',
            knowledge: '知识',
            settings: '设置',
            general_settings: '常规设置',
            show_bookmark_bar: '显示书签栏',
            bookmark_bar_desc: '切换顶部书签栏的可见性',
            language: '语言',
            language_desc: '更改界面语言',
            lang_en: 'English',
            lang_es: 'Español',
            lang_zh: '中文',
            lang_hi: 'हिन्दी',
            lang_fr: 'Français',
            github_api: 'GitHub API 配置',
            github_api_desc: '配置 GitHub API 以上传知识气泡的图片。',
            github_token: 'GitHub 个人访问令牌',
            github_token_desc: '在 github.com/settings/tokens 创建具有 repo 权限的令牌',
            github_repo: '存储库名称',
            github_repo_desc: '格式：用户名/存储库名称',
            save_github_settings: '保存 GitHub 设置'
        },
        hi: {
            tools: 'उपकरण',
            prompts: 'प्रॉम्प्ट्स',
            knowledge: 'ज्ञान',
            settings: 'सेटिंग्स',
            general_settings: 'सामान्य सेटिंग्स',
            show_bookmark_bar: 'बुकमार्क बार दिखाएं',
            bookmark_bar_desc: 'शीर्ष पर बुकमार्क बार की दृश्यता टॉगल करें',
            language: 'भाषा',
            language_desc: 'इंटरफ़ेस भाषा बदलें',
            lang_en: 'English',
            lang_es: 'Español',
            lang_zh: '中文',
            lang_hi: 'हिन्दी',
            lang_fr: 'Français',
            github_api: 'GitHub API कॉन्फ़िगरेशन',
            github_api_desc: 'ज्ञान बुलबुले के लिए छवियां अपलोड करने के लिए GitHub API कॉन्फ़िगर करें।',
            github_token: 'GitHub व्यक्तिगत पहुंच टोकन',
            github_token_desc: 'github.com/settings/tokens पर repo अनुमति के साथ एक टोकन बनाएं',
            github_repo: 'रिपॉजिटरी नाम',
            github_repo_desc: 'प्रारूप: उपयोगकर्ता-नाम/रिपॉजिटरी-नाम',
            save_github_settings: 'GitHub सेटिंग्स सहेजें'
        },
        fr: {
            tools: 'Outils',
            prompts: 'Invites',
            knowledge: 'Connaissances',
            settings: 'Paramètres',
            general_settings: 'Paramètres Généraux',
            show_bookmark_bar: 'Afficher la Barre de Favoris',
            bookmark_bar_desc: 'Basculer la visibilité de la barre de favoris en haut',
            language: 'Langue',
            language_desc: 'Changer la langue de l\'interface',
            lang_en: 'English',
            lang_es: 'Español',
            lang_zh: '中文',
            lang_hi: 'हिन्दी',
            lang_fr: 'Français',
            github_api: 'Configuration de l\'API GitHub',
            github_api_desc: 'Configurez l\'API GitHub pour télécharger des images pour les bulles de connaissances.',
            github_token: 'Token d\'Accès Personnel GitHub',
            github_token_desc: 'Créez un token avec la permission repo sur github.com/settings/tokens',
            github_repo: 'Nom du Dépôt',
            github_repo_desc: 'Format : nom-utilisateur/nom-dépôt',
            save_github_settings: 'Enregistrer les Paramètres GitHub'
        }
    };
    
    let currentLanguage = 'en';
    
    async function loadLanguageSettings() {
        try {
            const saved = await chrome.storage.local.get(['language']);
            const lang = saved.language || 'en';
            currentLanguage = lang;
            $('#language-selector').val(lang);
            applyTranslations(lang);
        } catch (error) {
            logMessage(`Failed to load language settings: ${error.message}`, 'error');
        }
    }
    
    function applyTranslations(lang) {
        currentLanguage = lang;
        const t = translations[lang] || translations.en;
        
        // Apply translations to all elements with data-translate attribute
        $('[data-translate]').each(function() {
            const key = $(this).attr('data-translate');
            if (t[key]) {
                if ($(this).is('option')) {
                    $(this).text(t[key]);
                } else {
                    $(this).text(t[key]);
                }
            }
        });
    }
    
    $('#language-selector').on('change', async function() {
        const lang = $(this).val();
        await chrome.storage.local.set({ language: lang });
        applyTranslations(lang);
        logMessage(`Language changed to ${translations[lang]?.lang_en || lang}`, 'success');
    });
    
    // Load knowledge state - always collapsed on load
    async function loadKnowledgeState() {
        try {
            // Always collapse on load regardless of saved state
            $knowledgeList.removeClass('expanded');
            $knowledgeChevron.css('transform', 'rotate(-90deg)');
            // Save collapsed state
            await chrome.storage.local.set({ knowledgeCollapsed: true });
        } catch (error) {
            $knowledgeList.removeClass('expanded');
            $knowledgeChevron.css('transform', 'rotate(-90deg)');
        }
    }
    
    // Toggle knowledge section
    $knowledgeHeader.on('click', async () => {
        const isExpanded = $knowledgeList.hasClass('expanded');
        
        if (isExpanded) {
            // Get current height before collapsing
            const currentHeight = $knowledgeList[0].scrollHeight;
            $knowledgeList.css('max-height', currentHeight + 'px');
            // Force reflow
            $knowledgeList[0].offsetHeight;
            // Now animate to 0
            $knowledgeList.css('max-height', '0');
            $knowledgeList.removeClass('expanded');
            $knowledgeChevron.css('transform', 'rotate(-90deg)');
            await chrome.storage.local.set({ knowledgeCollapsed: true });
            // Clear inline style after animation
            setTimeout(() => {
                if (!$knowledgeList.hasClass('expanded')) {
                    $knowledgeList.css('max-height', '');
                }
            }, 500);
        } else {
            // Initialize and load content first to get accurate height
            initializeKnowledgeFields();
            await loadSavedKnowledge();
            // Wait a moment for content to render
            await new Promise(resolve => setTimeout(resolve, 10));
            // Temporarily show to measure actual content height
            $knowledgeList.css('max-height', 'none').css('display', 'block');
            const actualHeight = $knowledgeList[0].scrollHeight + 10; // Add padding for margin
            // Reset to collapsed state first
            $knowledgeList.css('max-height', '0').css('display', 'block');
            // Force reflow to ensure 0 is applied
            $knowledgeList[0].offsetHeight;
            // Use requestAnimationFrame to ensure transition is ready
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Now animate to actual height
                        $knowledgeList.css('max-height', actualHeight + 'px');
                        $knowledgeList.addClass('expanded');
                        resolve();
                    });
                });
            });
            $knowledgeChevron.css('transform', 'rotate(0deg)');
            await chrome.storage.local.set({ knowledgeCollapsed: false });
        }
    });
    
    // Load and render saved knowledge bubbles
    async function loadSavedKnowledge() {
        try {
            const saved = await chrome.storage.local.get(['savedKnowledge']);
            const savedKnowledge = saved.savedKnowledge || [];
            
            $savedKnowledgeList.empty();
            
            if (savedKnowledge.length === 0) {
                $savedKnowledgeList.append('<p class="text-xs text-gray-500 text-center py-4 italic">No knowledge bubbles yet. Create your first one above!</p>');
                return;
            }
            
            savedKnowledge.forEach((bubble, index) => {
                // Build preview text (handle both new array format and old single-value format)
                let previewText = [];
                
                const names = bubble.names || (bubble.name ? [bubble.name] : []);
                const assetUrls = bubble.assetUrls || (bubble.assetUrl ? [bubble.assetUrl] : []);
                const abouts = bubble.abouts || (bubble.about ? [bubble.about] : []);
                const infos = bubble.infos || (bubble.info ? [bubble.info] : []);
                
                if (names.length > 0) {
                    previewText.push(`${names.length} name${names.length > 1 ? 's' : ''}`);
                }
                if (assetUrls.length > 0) {
                    previewText.push(`${assetUrls.length} asset${assetUrls.length > 1 ? 's' : ''}`);
                }
                if (abouts.length > 0) {
                    previewText.push(`${abouts.length} description${abouts.length > 1 ? 's' : ''}`);
                }
                if (infos.length > 0) {
                    previewText.push(`${infos.length} info${infos.length > 1 ? 's' : ''}`);
                }
                
                // Show first values as preview
                const firstPreview = [];
                if (names[0]) firstPreview.push(`<strong>${_.escape(names[0])}</strong>`);
                if (abouts[0]) firstPreview.push(_.escape(abouts[0].substring(0, 50)));
                
                const $bubbleCard = $(`
                    <div class="bg-bn-dark p-3.5 rounded-xl transition-all duration-200 group knowledge-bubble cursor-grab hover:shadow-lg hover:shadow-bn-orange/10 hover:-translate-y-0.5" draggable="true" data-index="${index}" style="border: 1px dashed rgba(212, 97, 28, 0.5);">
                        <div class="flex items-start justify-between gap-2 mb-2.5">
                            <div class="flex-1 min-w-0">
                                ${previewText.length > 0 ? `<p class="text-xs text-gray-500 mb-1.5 leading-relaxed">${previewText.join(', ')}</p>` : ''}
                                ${firstPreview.length > 0 ? `<div class="text-xs text-gray-400 leading-relaxed">${firstPreview.join(' • ')}</div>` : ''}
                            </div>
                            <div class="flex gap-1">
                                <button class="knowledge-copy-btn opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 hover:bg-white/10 rounded-md transition-all duration-200" data-index="${index}" title="Copy formatted text">
                                    <i class="fas fa-copy text-gray-400 hover:text-bn-orange text-[10px]" style="font-size: 10px;"></i>
                                </button>
                                <button class="knowledge-delete-btn opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 hover:bg-white/10 rounded-md transition-all duration-200" data-index="${index}" title="Delete bubble">
                                    <i class="fas fa-trash text-gray-400 hover:text-red-400 text-[10px]" style="font-size: 10px;"></i>
                                </button>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5">
                            <i class="fas fa-grip-vertical text-gray-600"></i>
                            <span class="text-gray-500">Drag to input field</span>
                        </div>
                    </div>
                `);
                
                // Add drag functionality
                $bubbleCard.on('dragstart', function(e) {
                    const bubble = savedKnowledge[index];
                    const formattedText = formatKnowledgeAsText(bubble);
                    const dataTransfer = e.originalEvent.dataTransfer;
                    
                    // Set drag data in multiple formats for better compatibility
                    dataTransfer.setData('text/plain', formattedText);
                    dataTransfer.setData('text', formattedText);
                    dataTransfer.effectAllowed = 'copy';
                    
                    // Set drag image for better visual feedback
                    const dragImage = this.cloneNode(true);
                    dragImage.style.opacity = '0.8';
                    dragImage.style.position = 'absolute';
                    dragImage.style.top = '-1000px';
                    document.body.appendChild(dragImage);
                    dataTransfer.setDragImage(dragImage, 0, 0);
                    setTimeout(() => document.body.removeChild(dragImage), 0);
                    
                    // Also copy to clipboard as fallback
                    try {
                        $copyHelper.val(formattedText).select();
                        document.execCommand('copy');
                    } catch (err) {
                        // Ignore clipboard errors during drag
                    }
                    
                    $(this).addClass('opacity-50 cursor-grabbing scale-95');
                });
                
                $bubbleCard.on('dragend', function(e) {
                    $(this).removeClass('opacity-50 cursor-grabbing scale-95');
                    // Show feedback that content is ready to paste
                    if (e.originalEvent && e.originalEvent.clientX) {
                        showActionFeedback('Ready to drop!', e.originalEvent);
                    }
                });
                
                $savedKnowledgeList.append($bubbleCard);
            });
            
            // Re-setup drag drop handlers for input fields after knowledge bubbles are loaded
            setupFieldDragDrop();
        } catch (error) {
            logMessage(`Failed to load saved knowledge: ${error.message}`, 'error');
        }
    }
    
    // Save new knowledge bubble
    $saveKnowledgeBtn.on('click', async () => {
        // Collect all field values grouped by type
        const fieldValues = {
            assetUrls: [],
            names: [],
            abouts: [],
            infos: []
        };
        
        $('.knowledge-field-input').each(function() {
            const fieldType = $(this).data('field-type');
            const value = $(this).val().trim();
            
            if (value) {
                if (fieldType === 'assetUrl') fieldValues.assetUrls.push(value);
                else if (fieldType === 'name') fieldValues.names.push(value);
                else if (fieldType === 'about') fieldValues.abouts.push(value);
                else if (fieldType === 'info') fieldValues.infos.push(value);
            }
        });
        
        // Check if at least one field has content
        const hasContent = Object.values(fieldValues).some(arr => arr.length > 0);
        
        if (!hasContent) {
            logMessage('Please fill in at least one field to create a knowledge bubble.', 'warn');
            return;
        }
        
        try {
            const saved = await chrome.storage.local.get(['savedKnowledge']);
            const savedKnowledge = saved.savedKnowledge || [];
            
            // Only store fields that have content
            const bubble = {
                savedAt: new Date().toISOString()
            };
            
            if (fieldValues.assetUrls.length > 0) bubble.assetUrls = fieldValues.assetUrls;
            if (fieldValues.names.length > 0) bubble.names = fieldValues.names;
            if (fieldValues.abouts.length > 0) bubble.abouts = fieldValues.abouts;
            if (fieldValues.infos.length > 0) bubble.infos = fieldValues.infos;
            
            savedKnowledge.push(bubble);
            
            await chrome.storage.local.set({ savedKnowledge });
            
            // Clear form and reinitialize
            initializeKnowledgeFields();
            
            logMessage('Knowledge bubble saved successfully!', 'success');
            loadSavedKnowledge();
        } catch (error) {
            logMessage(`Failed to save knowledge bubble: ${error.message}`, 'error');
        }
    });
    
    // Copy knowledge bubble
    $(document).on('click', '.knowledge-copy-btn', async function(e) {
        e.stopPropagation();
        const index = $(this).data('index');
        
        try {
            const saved = await chrome.storage.local.get(['savedKnowledge']);
            const savedKnowledge = saved.savedKnowledge || [];
            const bubble = savedKnowledge[index];
            
            if (bubble) {
                const formattedText = formatKnowledgeAsText(bubble);
                copyToClipboard(formattedText, $(this));
                showActionFeedback('Copied!', e);
            }
        } catch (error) {
            logMessage(`Failed to copy knowledge bubble: ${error.message}`, 'error');
        }
    });
    
    // Delete knowledge bubble
    $(document).on('click', '.knowledge-delete-btn', async function() {
        const index = $(this).data('index');
        
        const confirmed = await confirm('Are you sure you want to delete this item?');
        if (!confirmed) {
            return;
        }
        
        try {
            const saved = await chrome.storage.local.get(['savedKnowledge']);
            const savedKnowledge = saved.savedKnowledge || [];
            
            savedKnowledge.splice(index, 1);
            
            await chrome.storage.local.set({ savedKnowledge });
            logMessage('Knowledge bubble deleted.', 'success');
            loadSavedKnowledge();
        } catch (error) {
            logMessage(`Failed to delete knowledge bubble: ${error.message}`, 'error');
        }
    });
    
    // Load knowledge state on initialization
    loadKnowledgeState();
    loadBookmarkBarSettings();
    loadLanguageSettings();

    logMessage('BN Vibe Tools v1.5.0 initialized.');

    
    // Force bookmark bar black background
    const $bookmarksBar = $('#bookmarks-bar');
    if ($bookmarksBar.length) {
        $bookmarksBar.css({
            'background-color': '#000000 !important'
        });
        $bookmarksBar[0].style.setProperty('background-color', '#000000', 'important');
    }
    
    const $bookmarkAddBtn = $('#bookmark-add-btn');
    const $bookmarkDropdown = $('.bookmark-add-dropdown');
    
    if ($bookmarkAddBtn.length && $bookmarkDropdown.length) {
        let hideTimeout = null;
        const HIDE_DELAY = 200; // Delay in ms before hiding dropdown
        
        function showDropdown() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            $bookmarkDropdown.addClass('visible').css({
                'opacity': '1',
                'visibility': 'visible',
                'pointer-events': 'auto',
                'display': 'block',
                'transform': 'translateY(0)',
                'background-color': '#000000',
                'background': '#000000'
            });
            // Ensure all items have white text
            $bookmarkDropdown.find('.bookmark-add-dropdown-item').css({
                'color': '#ffffff',
                'background-color': 'transparent'
            });
            $bookmarkDropdown.find('.bookmark-add-dropdown-item span').css({
                'color': '#ffffff'
            });
            $bookmarkDropdown.find('.bookmark-add-dropdown-item i').css({
                'color': '#ffffff'
            });
            positionDropdown();
        }
        
        function hideDropdown() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            hideTimeout = setTimeout(function() {
                $bookmarkDropdown.removeClass('visible').css({
                    'opacity': '0',
                    'visibility': 'hidden',
                    'pointer-events': 'none',
                    'transform': 'translateY(-8px)'
                });
                // Also hide all side menus when dropdown hides
                $('.bookmark-side-menu').removeClass('visible');
                hideTimeout = null;
            }, HIDE_DELAY);
        }
        
        function positionDropdown() {
            const btn = $bookmarkAddBtn[0];
            const dropdown = $bookmarkDropdown[0];
            
            if (!btn || !dropdown) return;
            
            // Get button position relative to viewport
            const btnRect = btn.getBoundingClientRect();
            const popupWidth = document.body.offsetWidth || 420; // popup width from CSS
            
            // Temporarily make dropdown visible to measure its actual width
            const originalVisibility = dropdown.style.visibility;
            const originalOpacity = dropdown.style.opacity;
            dropdown.style.visibility = 'hidden';
            dropdown.style.opacity = '0';
            dropdown.style.display = 'block';
            dropdown.style.position = 'absolute';
            
            const dropdownWidth = dropdown.offsetWidth || 180; // min-width from CSS
            
            // Restore original state
            dropdown.style.visibility = originalVisibility;
            dropdown.style.opacity = originalOpacity;
            
            // Calculate space on right and left
            const spaceOnRight = popupWidth - btnRect.right;
            const spaceOnLeft = btnRect.left;
            
            // Reset positioning and maxWidth
            dropdown.style.left = 'auto';
            dropdown.style.right = 'auto';
            dropdown.style.maxWidth = 'none';
            
            // Position dropdown to align with button's left edge (keeps it within container)
            // Add padding from container edges (15px on each side for better spacing)
            const containerPadding = 15;
            const dropdownRightEdge = btnRect.left + dropdownWidth;
            const maxDropdownRight = popupWidth - containerPadding;
            
            if (dropdownRightEdge <= maxDropdownRight) {
                // Dropdown fits when aligned to button's left edge
                dropdown.style.left = '0';
                dropdown.style.right = 'auto';
                // Ensure it doesn't get too close to right edge
                if (dropdownRightEdge > maxDropdownRight) {
                    dropdown.style.maxWidth = (maxDropdownRight - btnRect.left) + 'px';
                }
            } else {
                // Dropdown would overflow - position from right edge with padding
                dropdown.style.right = containerPadding + 'px';
                dropdown.style.left = 'auto';
                // Constrain width: dropdown right edge is at (popupWidth - containerPadding)
                // Dropdown left edge should not go beyond button's left edge
                // So max width = (popupWidth - containerPadding) - btnRect.left
                const maxWidth = (popupWidth - containerPadding) - btnRect.left;
                dropdown.style.maxWidth = Math.max(maxWidth - 5, 150) + 'px'; // Subtract 5px for extra safety margin
            }
        }
        
        // Show dropdown on button hover
        $bookmarkAddBtn.on('mouseenter', function() {
            showDropdown();
        });
        
        // Hide dropdown when leaving button (with delay, but check if moving to dropdown or side menu)
        $bookmarkAddBtn.on('mouseleave', function(e) {
            // Check if we're moving to dropdown or side menu
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && (
                $(relatedTarget).closest('.bookmark-add-dropdown').length ||
                $(relatedTarget).hasClass('bookmark-add-dropdown') ||
                $(relatedTarget).closest('.bookmark-side-menu').length ||
                $(relatedTarget).hasClass('bookmark-side-menu')
            )) {
                // Moving to dropdown or side menu, keep it open
                return;
            }
            // Not moving to either menu, close both
            hideDropdown();
            $('.bookmark-side-menu').removeClass('visible');
        });
        
        // Keep dropdown visible when hovering over it
        $bookmarkDropdown.on('mouseenter', function() {
            showDropdown();
        });
        
        // Hide dropdown when leaving dropdown (but check if moving to side menu)
        $bookmarkDropdown.on('mouseleave', function(e) {
            // Check if we're moving to a side menu
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && (
                $(relatedTarget).closest('.bookmark-side-menu').length ||
                $(relatedTarget).hasClass('bookmark-side-menu')
            )) {
                // Moving to side menu, keep dropdown open
                return;
            }
            // Not moving to side menu, close both
            hideDropdown();
            $('.bookmark-side-menu').removeClass('visible');
        });
        
        // Also position on window resize
        $(window).on('resize', function() {
            const visibility = window.getComputedStyle($bookmarkDropdown[0]).visibility;
            if (visibility === 'visible') {
                positionDropdown();
                // Reposition any visible side menus
                $('.bookmark-side-menu.visible').each(function() {
                    positionSideMenu($(this));
                });
            }
        });
        
        // Side menu management
        let sideMenuHideTimeout = null;
        const SIDE_MENU_HIDE_DELAY = 200;
        
        function showSideMenu(menuType) {
            if (sideMenuHideTimeout) {
                clearTimeout(sideMenuHideTimeout);
                sideMenuHideTimeout = null;
            }
            
            // Hide all side menus first
            $('.bookmark-side-menu').removeClass('visible');
            
            // Update dropdown border to remove left border when side menu is visible
            $('.bookmark-add-dropdown').css({
                'border-left': 'none',
                'border-radius': '0 6px 6px 0'
            });
            
            // Show the requested menu
            const $menu = $(`#bookmark-side-menu-${menuType}`);
            if ($menu.length) {
                $menu.addClass('visible');
                
                // Force black background with JavaScript - override everything
                $menu.css({
                    'background-color': '#000000',
                    'background': '#000000'
                });
                $menu[0].style.setProperty('background-color', '#000000', 'important');
                $menu[0].style.setProperty('background', '#000000', 'important');
                
                // Also force black on content area
                const $content = $menu.find('.bookmark-side-menu-content');
                if ($content.length) {
                    $content.css({
                        'background-color': '#000000',
                        'background': '#000000'
                    });
                    $content[0].style.setProperty('background-color', '#000000', 'important');
                    $content[0].style.setProperty('background', '#000000', 'important');
                }
                
                // Calculate dropdown height to match as min-height for side menu
                const $dropdown = $('.bookmark-add-dropdown');
                let dropdownHeight = 0;
                if ($dropdown.length && $dropdown.hasClass('visible')) {
                    dropdownHeight = $dropdown.outerHeight() || 0;
                } else {
                    // Calculate estimated height: 3 items * (padding 6px*2 + content ~11px) + dropdown padding 4px*2
                    // Each item: 6px top + 6px bottom + 11px content = 23px
                    // 3 items: 23px * 3 = 69px
                    // Dropdown padding: 4px top + 4px bottom = 8px
                    // Total: 69px + 8px = 77px
                    dropdownHeight = 77;
                }
                
                // Set min-height to match dropdown height
                $menu.css({
                    'min-height': dropdownHeight + 'px'
                });
                $menu[0].style.setProperty('min-height', dropdownHeight + 'px', 'important');
                
                // Populate menu content first
                if (menuType === 'tools') {
                    populateToolsSideMenu();
                } else if (menuType === 'prompts') {
                    populatePromptsSideMenu();
                } else if (menuType === 'knowledge') {
                    populateKnowledgeSideMenu();
                }
                
                // Wait a moment for dropdown to be positioned and content to render, then position side menu
                setTimeout(function() {
                    positionSideMenu($menu);
                    
                    // Recalculate and set min-height after dropdown is fully visible
                    const actualDropdownHeight = $dropdown.outerHeight() || dropdownHeight;
                    $menu.css({
                        'background-color': '#000000',
                        'background': '#000000',
                        'min-height': actualDropdownHeight + 'px'
                    });
                    $menu[0].style.setProperty('background-color', '#000000', 'important');
                    $menu[0].style.setProperty('background', '#000000', 'important');
                    $menu[0].style.setProperty('min-height', actualDropdownHeight + 'px', 'important');
                    
                    if ($content.length) {
                        $content.css({
                            'background-color': '#000000',
                            'background': '#000000'
                        });
                        $content[0].style.setProperty('background-color', '#000000', 'important');
                        $content[0].style.setProperty('background', '#000000', 'important');
                    }
                }, 50);
                
                // Continuously force black background while menu is visible
                const forceBlackInterval = setInterval(function() {
                    if (!$menu.hasClass('visible')) {
                        clearInterval(forceBlackInterval);
                        return;
                    }
                    $menu.css({
                        'background-color': '#000000',
                        'background': '#000000'
                    });
                    $menu[0].style.setProperty('background-color', '#000000', 'important');
                    $menu[0].style.setProperty('background', '#000000', 'important');
                    
                    if ($content.length) {
                        $content.css({
                            'background-color': '#000000',
                            'background': '#000000'
                        });
                        $content[0].style.setProperty('background-color', '#000000', 'important');
                        $content[0].style.setProperty('background', '#000000', 'important');
                    }
                }, 100);
            }
        }
        
        function hideSideMenu(menuType) {
            if (sideMenuHideTimeout) {
                clearTimeout(sideMenuHideTimeout);
            }
            sideMenuHideTimeout = setTimeout(function() {
                $(`#bookmark-side-menu-${menuType}`).removeClass('visible');
                
                // Restore dropdown border if no side menus are visible
                if ($('.bookmark-side-menu.visible').length === 0) {
                    $('.bookmark-add-dropdown').css({
                        'border-left': '1px solid rgba(212, 97, 28, 0.3)',
                        'border-radius': '6px'
                    });
                }
                
                sideMenuHideTimeout = null;
            }, SIDE_MENU_HIDE_DELAY);
        }
        
        function positionSideMenu($menu) {
            const $dropdown = $('.bookmark-add-dropdown');
            const $button = $('#bookmark-add-btn');
            if (!$dropdown.length || !$button.length) return;
            
            // Get dropdown's actual position (it's positioned relative to button)
            const dropdownRect = $dropdown[0].getBoundingClientRect();
            const buttonRect = $button[0].getBoundingClientRect();
            const barRect = $('#bookmarks-bar')[0].getBoundingClientRect();
            
            // Calculate dropdown position relative to bookmarks bar
            const dropdownTop = dropdownRect.top - barRect.top;
            const dropdownLeft = dropdownRect.left - barRect.left;
            const dropdownWidth = $dropdown.outerWidth() || 140;
            
            // Position side menu directly to the left of dropdown (glued together)
            $menu.css({
                'top': (dropdownTop - 1) + 'px',
                'left': (dropdownLeft - dropdownWidth) + 'px',
                'background-color': '#000000',
                'background': '#000000'
            });
            $menu[0].style.setProperty('background-color', '#000000', 'important');
            $menu[0].style.setProperty('background', '#000000', 'important');
            
            // Force black on content area
            const $content = $menu.find('.bookmark-side-menu-content');
            if ($content.length) {
                $content.css({
                    'background-color': '#000000',
                    'background': '#000000'
                });
                $content[0].style.setProperty('background-color', '#000000', 'important');
                $content[0].style.setProperty('background', '#000000', 'important');
            }
        }
        
        // Tools data
        const toolsData = [
            { id: 'scrape-btn', name: 'Skin Scraper', desc: 'Save page as Markdown', icon: 'fa-layer-group', action: 'scrape' },
            { id: 'asset-scraper-btn', name: 'Asset Scraper', desc: 'Extract all page assets', icon: 'fa-download', action: 'scrape' },
            { id: 'css-analyzer-btn', name: 'CSS Analyzer', desc: 'Scan colors & fonts', icon: 'fa-palette', action: 'run' },
            { id: 'seo-analyzer-btn', name: 'SEO Analyzer', desc: 'Check meta tags & data', icon: 'fa-search-dollar', action: 'run' },
            { id: 'stack-analyzer-btn', name: 'Stack Analyzer', desc: 'Detect site frameworks', icon: 'fa-cubes-stacked', action: 'run' },
            { id: 'clear-cache-btn', name: 'Clear Cache', desc: 'Clear cache for current site', icon: 'fa-trash-alt', action: 'run' },
            { id: 'fontgrab-toggle-btn', name: 'FontGrab', desc: 'See font details on hover', icon: 'fa-font', action: 'toggle' },
            { id: 'colorpick-toggle-btn', name: 'ColorPick', desc: 'Pick colors from elements', icon: 'fa-eye-dropper', action: 'toggle' },
            { id: 'screenruler-toggle-btn', name: 'Screen Ruler', desc: 'Measure distances', icon: 'fa-ruler', action: 'toggle' }
        ];
        
        function populateToolsSideMenu() {
            const $list = $('#tools-side-menu-list');
            $list.empty();
            
            toolsData.forEach(tool => {
                const $item = $(`
                    <div class="bookmark-side-menu-item" data-tool-id="${tool.id}">
                        <i class="fas ${tool.icon} drag-handle"></i>
                        <span>${_.escape(tool.name)}</span>
                    </div>
                `);
                
                const $icon = $item.find('i');
                
                // Prevent item and icon from being draggable for tools
                $item.attr('draggable', 'false');
                $icon.attr('draggable', 'false');
                
                // Click handler to add tool to bookmark bar
                $item.on('click', async function(e) {
                    // Don't add if clicking on icon
                    if ($(e.target).is('i') || $(e.target).closest('i').length) {
                        return;
                    }
                    e.stopPropagation();
                    
                    // Add tool to bookmark bar
                    await addBookmark({
                        type: 'tool',
                        id: tool.id,
                        name: tool.name,
                        icon: tool.icon,
                        data: tool
                    });
                });
                
                $list.append($item);
            });
        }
        
        async function populatePromptsSideMenu() {
            const $list = $('#prompts-side-menu-list');
            $list.empty();
            
            try {
                const saved = await chrome.storage.local.get(['savedPrompts']);
                const savedPrompts = saved.savedPrompts || [];
                
                if (savedPrompts.length === 0) {
                    $list.append(`
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 8px; text-align: center;">
                            <i class="fas fa-comment-dots" style="font-size: 24px; color: #9ca3af; margin-bottom: 8px;"></i>
                            <div class="text-xs text-gray-500">You don't have any saved prompts</div>
                        </div>
                    `);
                    return;
                }
                
                savedPrompts.forEach((prompt, index) => {
                    const $item = $(`
                        <div class="bookmark-side-menu-item" data-prompt-index="${index}" data-prompt-text="${_.escape(prompt.text)}">
                            <i class="fas fa-comment-dots drag-handle" draggable="true"></i>
                            <span>${_.escape(prompt.title || 'Untitled Prompt')}</span>
                        </div>
                    `);
                    
                    const $icon = $item.find('i');
                    
                    // Prevent item from being draggable
                    $item.attr('draggable', 'false');
                    
                    // Add drag functionality only on icon
                    $icon.on('dragstart', function(e) {
                        e.stopPropagation(); // Prevent bubbling
                        const promptText = prompt.text;
                        const dataTransfer = e.originalEvent.dataTransfer;
                        // Set multiple data types for better browser compatibility
                        dataTransfer.setData('text/plain', promptText);
                        dataTransfer.setData('text', promptText);
                        dataTransfer.effectAllowed = 'copy';
                        $item.addClass('dragging');
                    });
                    
                    $icon.on('dragend', function(e) {
                        e.stopPropagation();
                        $item.removeClass('dragging');
                    });
                    
                    // Prevent drag on item itself
                    $item.on('dragstart', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                    
                    // Click handler - add prompt to bookmark bar
                    $item.on('click', async function(e) {
                        // Don't add if clicking on icon (icon is drag only)
                        if ($(e.target).is('i') || $(e.target).closest('i').length) {
                            return;
                        }
                        e.stopPropagation();
                        
                        // Add prompt to bookmark bar
                        await addBookmark({
                            type: 'prompt',
                            id: `prompt-${index}`,
                            name: prompt.title || 'Untitled Prompt',
                            dataIndex: index
                        });
                    });
                    
                    $list.append($item);
                });
            } catch (error) {
                $list.append(`
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 8px; text-align: center;">
                        <i class="fas fa-comment-dots" style="font-size: 24px; color: #9ca3af; margin-bottom: 8px;"></i>
                        <div class="text-xs text-gray-500">You don't have any saved prompts</div>
                    </div>
                `);
                logMessage(`Failed to load prompts for side menu: ${error.message}`, 'error');
            }
        }
        
        async function populateKnowledgeSideMenu() {
            const $list = $('#knowledge-side-menu-list');
            $list.empty();
            
            try {
                const saved = await chrome.storage.local.get(['savedKnowledge']);
                const savedKnowledge = saved.savedKnowledge || [];
                
                if (savedKnowledge.length === 0) {
                    $list.append(`
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 8px; text-align: center;">
                            <i class="fas fa-lightbulb" style="font-size: 24px; color: #9ca3af; margin-bottom: 8px;"></i>
                            <div class="text-xs text-gray-500">You don't have any saved bubbles</div>
                        </div>
                    `);
                    return;
                }
                
                savedKnowledge.forEach((bubble, index) => {
                    const names = bubble.names || (bubble.name ? [bubble.name] : []);
                    const title = names[0] || 'Untitled Bubble';
                    
                    const $item = $(`
                        <div class="bookmark-side-menu-item" data-bubble-index="${index}">
                            <i class="fas fa-lightbulb drag-handle" draggable="true"></i>
                            <span>${_.escape(title)}</span>
                        </div>
                    `);
                    
                    const $icon = $item.find('i');
                    
                    // Prevent item from being draggable
                    $item.attr('draggable', 'false');
                    
                    // Add drag functionality only on icon
                    $icon.on('dragstart', function(e) {
                        e.stopPropagation(); // Prevent bubbling
                        const formattedText = formatKnowledgeAsText(bubble);
                        const dataTransfer = e.originalEvent.dataTransfer;
                        // Set multiple data types for better browser compatibility
                        dataTransfer.setData('text/plain', formattedText);
                        dataTransfer.setData('text', formattedText);
                        dataTransfer.effectAllowed = 'copy';
                        $item.addClass('dragging');
                    });
                    
                    $icon.on('dragend', function(e) {
                        e.stopPropagation();
                        $item.removeClass('dragging');
                    });
                    
                    // Prevent drag on item itself
                    $item.on('dragstart', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                    
                    // Click handler - add knowledge bubble to bookmark bar
                    $item.on('click', async function(e) {
                        // Don't add if clicking on icon (icon is drag only)
                        if ($(e.target).is('i') || $(e.target).closest('i').length) {
                            return;
                        }
                        e.stopPropagation();
                        
                        // Add knowledge bubble to bookmark bar
                        await addBookmark({
                            type: 'knowledge',
                            id: `knowledge-${index}`,
                            name: title,
                            dataIndex: index
                        });
                    });
                    
                    $list.append($item);
                });
            } catch (error) {
                $list.append(`
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 8px; text-align: center;">
                        <i class="fas fa-lightbulb" style="font-size: 24px; color: #9ca3af; margin-bottom: 8px;"></i>
                        <div class="text-xs text-gray-500">You don't have any saved bubbles</div>
                    </div>
                `);
                logMessage(`Failed to load knowledge for side menu: ${error.message}`, 'error');
            }
        }
        
        // Handle dropdown item hover to show side menus
        // Handle dropdown item hover - show side menu
        $(document).on('mouseenter', '.bookmark-add-dropdown-item', function(e) {
            e.stopPropagation();
            const menuType = $(this).data('hover-menu');
            if (menuType) {
                showSideMenu(menuType);
            }
        });
        
        // Handle dropdown item click - prevent tool execution, just keep menu open
        $(document).on('click', '.bookmark-add-dropdown-item', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // Just ensure the side menu stays open, don't execute anything
            const menuType = $(this).data('hover-menu');
            if (menuType) {
                showSideMenu(menuType);
            }
            return false;
        });
        
        // Keep side menu visible when hovering over it
        $('.bookmark-side-menu').on('mouseenter', function() {
            if (sideMenuHideTimeout) {
                clearTimeout(sideMenuHideTimeout);
                sideMenuHideTimeout = null;
            }
            // Keep dropdown open when hovering over side menu
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            showDropdown();
        });
        
        $('.bookmark-side-menu').on('mouseleave', function(e) {
            // Check if we're moving back to dropdown
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && (
                $(relatedTarget).closest('.bookmark-add-dropdown').length ||
                $(relatedTarget).hasClass('bookmark-add-dropdown') ||
                $(relatedTarget).closest('#bookmark-add-btn').length ||
                $(relatedTarget).attr('id') === 'bookmark-add-btn'
            )) {
                // Moving back to dropdown, keep side menu open
                return;
            }
            // Not moving to dropdown, close both
            const menuType = $(this).attr('id').replace('bookmark-side-menu-', '');
            hideSideMenu(menuType);
            hideDropdown();
        });
        
        // Close side menu button
        $(document).on('click', '.bookmark-side-menu-close', function(e) {
            e.stopPropagation();
            const menuType = $(this).data('menu');
            $(`#bookmark-side-menu-${menuType}`).removeClass('visible');
        });
        
        // Bookmark management
        async function loadBookmarks() {
            try {
                const saved = await chrome.storage.local.get(['bookmarks']);
                const bookmarks = saved.bookmarks || [];
                const $container = $('#bookmarks-container');
                $container.empty();
                
                bookmarks.forEach((bookmark, index) => {
                    const $bookmark = createBookmarkElement(bookmark, index);
                    $container.append($bookmark);
                });
                
                setupBookmarkDragDrop();
            } catch (error) {
                logMessage(`Failed to load bookmarks: ${error.message}`, 'error');
            }
        }
        
        function createBookmarkElement(bookmark, index) {
            // Get icon if available
            const iconClass = bookmark.icon ? `fas ${bookmark.icon}` : 'fas fa-bookmark';
            const bookmarkType = bookmark.type || 'tool';
            // For prompt/knowledge, make entire item draggable; for tools, only icon
            const isContentDraggable = bookmarkType === 'prompt' || bookmarkType === 'knowledge';
            const $bookmark = $(`
                <div class="bookmark-item" data-bookmark-index="${index}" data-bookmark-type="${bookmarkType}" data-bookmark-data-index="${bookmark.dataIndex || ''}" ${isContentDraggable ? 'draggable="true"' : ''}>
                    <span class="bookmark-drag-handle" ${!isContentDraggable ? 'draggable="true"' : ''}>
                        ${bookmark.icon ? `<i class="${iconClass}" style="font-size: 9px;"></i>` : '<i class="fas fa-bookmark" style="font-size: 9px;"></i>'}
                    </span>
                    <span>${_.escape(bookmark.name)}</span>
                    <button class="bookmark-remove-btn" data-bookmark-index="${index}" title="Remove bookmark">
                        <i class="fas fa-times" style="font-size: 8px;"></i>
                    </button>
                </div>
            `);
            
            $bookmark.on('click', function(e) {
                if ($(e.target).closest('.bookmark-remove-btn').length) {
                    return; // Let remove handler handle it
                }
                // For tool bookmarks, clicking on icon doesn't execute (only drag)
                if (!isContentDraggable && $(e.target).closest('.bookmark-drag-handle').length) {
                    return; // Don't execute on tool bookmark icon (it's for dragging only)
                }
                // Execute bookmark action
                executeBookmark(bookmark);
            });
            
            return $bookmark;
        }
        
        function setupBookmarkDragDrop() {
            // Handle prompt/knowledge bookmarks - entire item is draggable
            const $contentBookmarks = $('.bookmark-item[data-bookmark-type="prompt"], .bookmark-item[data-bookmark-type="knowledge"]');
            // Handle tool bookmarks - only icon is draggable for reordering
            const $dragHandles = $('.bookmark-item[data-bookmark-type="tool"] .bookmark-drag-handle');
            
            $contentBookmarks.off('dragstart dragend');
            $dragHandles.off('dragstart dragend dragover dragenter drop');
            
            let isDraggingToolBookmark = false; // Only track tool bookmarks for reordering
            
            // Handle prompt/knowledge bookmarks - drag entire item (like knowledge bubbles)
            $contentBookmarks.on('dragstart', async function(e) {
                // Don't start drag if clicking remove button
                if ($(e.target).closest('.bookmark-remove-btn').length) {
                    e.preventDefault();
                    return false;
                }
                
                const $bookmarkItem = $(this);
                const bookmarkType = $bookmarkItem.attr('data-bookmark-type');
                const dataIndex = $bookmarkItem.attr('data-bookmark-data-index');
                
                const dataTransfer = e.originalEvent.dataTransfer;
                
                // Prevent dragging the HTML element - we only want text
                // Create a transparent drag image
                const dragImage = document.createElement('div');
                dragImage.style.position = 'absolute';
                dragImage.style.top = '-1000px';
                dragImage.style.width = '1px';
                dragImage.style.height = '1px';
                dragImage.style.opacity = '0';
                document.body.appendChild(dragImage);
                dataTransfer.setDragImage(dragImage, 0, 0);
                setTimeout(() => document.body.removeChild(dragImage), 0);
                
                // Set the actual content for dropping into input fields (both in extension and browser)
                if (bookmarkType === 'prompt' && dataIndex !== '') {
                    try {
                        const saved = await chrome.storage.local.get(['savedPrompts']);
                        const savedPrompts = saved.savedPrompts || [];
                        const prompt = savedPrompts[parseInt(dataIndex)];
                        if (prompt && prompt.text) {
                            // Set text/plain for dropping into input fields (works in browser and extension)
                            dataTransfer.setData('text/plain', prompt.text);
                            // Also set as 'text' for better compatibility
                            dataTransfer.setData('text', prompt.text);
                            dataTransfer.effectAllowed = 'copy';
                            
                            // Also copy to clipboard as fallback (silently)
                            try {
                                $copyHelper.val(prompt.text).select();
                                document.execCommand('copy');
                            } catch (err) {
                                // Ignore clipboard errors during drag
                            }
                        }
                    } catch (error) {
                        // If fetch fails, still allow the drag but with no content
                        dataTransfer.effectAllowed = 'copy';
                    }
                } else if (bookmarkType === 'knowledge' && dataIndex !== '') {
                    try {
                        const saved = await chrome.storage.local.get(['savedKnowledge']);
                        const savedKnowledge = saved.savedKnowledge || [];
                        const bubble = savedKnowledge[parseInt(dataIndex)];
                        if (bubble) {
                            const formattedText = formatKnowledgeAsText(bubble);
                            // Set text/plain for dropping into input fields (works in browser and extension)
                            dataTransfer.setData('text/plain', formattedText);
                            // Also set as 'text' for better compatibility
                            dataTransfer.setData('text', formattedText);
                            dataTransfer.effectAllowed = 'copy';
                            
                            // Also copy to clipboard as fallback (silently)
                            try {
                                $copyHelper.val(formattedText).select();
                                document.execCommand('copy');
                            } catch (err) {
                                // Ignore clipboard errors during drag
                            }
                        }
                    } catch (error) {
                        // If fetch fails, still allow the drag but with no content
                        dataTransfer.effectAllowed = 'copy';
                    }
                }
                
                $bookmarkItem.addClass('dragging');
            });
            
            $contentBookmarks.on('dragend', function(e) {
                const $bookmarkItem = $(this);
                $bookmarkItem.removeClass('dragging drag-over');
                $('.bookmark-item').removeClass('drag-over');
                
                // Show feedback for prompt/knowledge drags
                const bookmarkType = $bookmarkItem.attr('data-bookmark-type');
                if ((bookmarkType === 'prompt' || bookmarkType === 'knowledge') && e.originalEvent && e.originalEvent.clientX) {
                    showActionFeedback('Copied to clipboard!', e.originalEvent);
                }
            });
            
            // Handle tool bookmarks - only icon is draggable for reordering
            $dragHandles.on('dragstart', async function(e) {
                const $bookmarkItem = $(this).closest('.bookmark-item');
                const bookmarkIndex = parseInt($bookmarkItem.attr('data-bookmark-index'));
                
                isDraggingToolBookmark = true;
                $bookmarkItem.addClass('dragging');
                const dataTransfer = e.originalEvent.dataTransfer;
                
                // For tools, allow reordering within bookmark bar only
                // Store bookmark index for reordering within bookmark bar
                dataTransfer.setData('text/html', bookmarkIndex.toString());
                dataTransfer.effectAllowed = 'move';
            });
            
            $dragHandles.on('dragend', function(e) {
                isDraggingToolBookmark = false;
                const $bookmarkItem = $(this).closest('.bookmark-item');
                $bookmarkItem.removeClass('dragging drag-over');
                $('.bookmark-item').removeClass('drag-over');
            });
            
            // Reordering functionality - only for tool bookmarks when dragging within bookmark bar
            const $toolBookmarks = $('.bookmark-item[data-bookmark-type="tool"]');
            
            $toolBookmarks.off('dragover dragenter dragleave drop');
            
            $toolBookmarks.on('dragover', function(e) {
                // Only prevent default if dragging tool bookmark (reordering)
                if (isDraggingToolBookmark) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            
            $toolBookmarks.on('dragenter', function(e) {
                // Only show drag-over if dragging tool bookmark (reordering)
                if (isDraggingToolBookmark) {
                    e.preventDefault();
                    if (!$(this).hasClass('dragging')) {
                        $(this).addClass('drag-over');
                    }
                }
            });
            
            $toolBookmarks.on('dragleave', function() {
                $(this).removeClass('drag-over');
            });
            
            $toolBookmarks.on('drop', async function(e) {
                // Only handle reordering for tool bookmarks
                if (!isDraggingToolBookmark) {
                    return; // Let it drop naturally (for input fields)
                }
                
                e.preventDefault();
                e.stopPropagation();
                $(this).removeClass('drag-over');
                
                const draggedIndex = e.originalEvent.dataTransfer.getData('text/html');
                const dropIndex = parseInt($(this).attr('data-bookmark-index'));
                
                if (draggedIndex && draggedIndex !== dropIndex.toString() && !isNaN(parseInt(draggedIndex)) && !isNaN(dropIndex)) {
                    try {
                        const saved = await chrome.storage.local.get(['bookmarks']);
                        const bookmarks = saved.bookmarks || [];
                        
                        const draggedBookmark = bookmarks[parseInt(draggedIndex)];
                        bookmarks.splice(parseInt(draggedIndex), 1);
                        bookmarks.splice(dropIndex, 0, draggedBookmark);
                        
                        await chrome.storage.local.set({ bookmarks });
                        await loadBookmarks();
                    } catch (error) {
                        logMessage(`Failed to reorder bookmarks: ${error.message}`, 'error');
                    }
                }
            });
        }
        
        async function addBookmark(bookmark) {
            try {
                const saved = await chrome.storage.local.get(['bookmarks']);
                const bookmarks = saved.bookmarks || [];
                
                // Check if already bookmarked - ensure proper type comparison
                let exists = false;
                if (bookmark.type === 'tool') {
                    exists = bookmarks.find(b => b.id === bookmark.id && b.type === bookmark.type);
                } else if (bookmark.type === 'prompt' || bookmark.type === 'knowledge') {
                    // Convert both to numbers for comparison to avoid string vs number issues
                    const bookmarkDataIndex = bookmark.dataIndex !== undefined && bookmark.dataIndex !== null ? parseInt(bookmark.dataIndex) : null;
                    if (bookmarkDataIndex !== null) {
                        exists = bookmarks.find(b => {
                            const bDataIndex = b.dataIndex !== undefined && b.dataIndex !== null ? parseInt(b.dataIndex) : null;
                            return bDataIndex === bookmarkDataIndex && b.type === bookmark.type;
                        });
                    }
                }
                
                if (exists) {
                    logMessage('Already bookmarked!', 'warn');
                    return;
                }
                
                bookmarks.push(bookmark);
                await chrome.storage.local.set({ bookmarks });
                await loadBookmarks();
                logMessage('Bookmark added!', 'success');
            } catch (error) {
                logMessage(`Failed to add bookmark: ${error.message}`, 'error');
            }
        }
        
        async function removeBookmark(index) {
            try {
                const saved = await chrome.storage.local.get(['bookmarks']);
                const bookmarks = saved.bookmarks || [];
                bookmarks.splice(index, 1);
                await chrome.storage.local.set({ bookmarks });
                await loadBookmarks();
                logMessage('Bookmark removed!', 'success');
            } catch (error) {
                logMessage(`Failed to remove bookmark: ${error.message}`, 'error');
            }
        }
        
        async function executeBookmark(bookmark) {
            if (bookmark.type === 'tool') {
                const $btn = $(`#${bookmark.id}`);
                if ($btn.length) {
                    $btn.click();
                }
            } else if (bookmark.type === 'prompt') {
                // Copy prompt to clipboard
                try {
                    const saved = await chrome.storage.local.get(['savedPrompts']);
                    const savedPrompts = saved.savedPrompts || [];
                    const prompt = savedPrompts[bookmark.dataIndex];
                    if (prompt) {
                        copyToClipboard(prompt.text);
                        logMessage('Prompt copied!', 'success');
                    }
                } catch (error) {
                    logMessage(`Failed to execute prompt bookmark: ${error.message}`, 'error');
                }
            } else if (bookmark.type === 'knowledge') {
                // Copy knowledge bubble to clipboard
                try {
                    const saved = await chrome.storage.local.get(['savedKnowledge']);
                    const savedKnowledge = saved.savedKnowledge || [];
                    const bubble = savedKnowledge[bookmark.dataIndex];
                    if (bubble) {
                        const formattedText = formatKnowledgeAsText(bubble);
                        copyToClipboard(formattedText);
                        logMessage('Knowledge bubble copied!', 'success');
                    }
                } catch (error) {
                    logMessage(`Failed to execute knowledge bookmark: ${error.message}`, 'error');
                }
            }
        }
        
        // Handle bookmark button clicks in side menus
        $(document).on('click', '.bookmark-side-menu-action-btn.bookmark-btn', async function(e) {
            e.stopPropagation();
            const $btn = $(this);
            
            if ($btn.data('tool-id')) {
                // Bookmark tool
                const toolId = $btn.data('tool-id');
                const toolName = $btn.data('tool-name');
                const tool = toolsData.find(t => t.id === toolId);
                if (tool) {
                    await addBookmark({
                        type: 'tool',
                        id: toolId,
                        name: toolName,
                        data: tool
                    });
                }
            } else if ($btn.data('prompt-index') !== undefined) {
                // Bookmark prompt
                const index = parseInt($btn.data('prompt-index')) || 0;
                const name = $btn.data('prompt-name');
                await addBookmark({
                    type: 'prompt',
                    id: `prompt-${index}`,
                    name: name,
                    dataIndex: index
                });
            } else if ($btn.data('bubble-index') !== undefined) {
                // Bookmark knowledge bubble
                const index = parseInt($btn.data('bubble-index')) || 0;
                const name = $btn.data('bubble-name');
                await addBookmark({
                    type: 'knowledge',
                    id: `knowledge-${index}`,
                    name: name,
                    dataIndex: index
                });
            }
        });
        
        // Handle run button clicks in tools side menu
        $(document).on('click', '.bookmark-side-menu-action-btn.run', function(e) {
            e.stopPropagation();
            const toolId = $(this).closest('.bookmark-side-menu-item').data('tool-id');
            const $btn = $(`#${toolId}`);
            if ($btn.length) {
                $btn.click();
            }
        });
        
        // Handle remove bookmark
        $(document).on('click', '.bookmark-remove-btn', async function(e) {
            e.stopPropagation();
            const index = $(this).data('bookmark-index');
            await removeBookmark(index);
        });
        
        // Initialize bookmarks on load
        loadBookmarks();
    }

})(jQuery, _);

