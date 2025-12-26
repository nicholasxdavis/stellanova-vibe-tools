/**
 * Listens for the extension icon to be clicked.
 */
chrome.action.onClicked.addListener((tab) => {
  // Make sure we're on a valid page before trying to capture.
  // We can't capture chrome:// pages, the new tab page, etc.
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
    // Cannot capture this page type
    return;
  }

  // Use the pageCapture API to save the tab as MHTML.
  chrome.pageCapture.saveAsMHTML({ tabId: tab.id }, (mhtmlData) => {
    // Check for any errors during capture.
    if (chrome.runtime.lastError) {
      console.error(`Vibe Scraper Error: ${chrome.runtime.lastError.message}`);
      return;
    }

    // Create a blob URL from the MHTML data.
    const url = URL.createObjectURL(mhtmlData);

    // Sanitize the tab's title to create a valid filename.
    // Replace invalid characters with an underscore.
    let filename = tab.title ? tab.title.replace(/[\\/:*?"<>|]/g, '_') : 'scraped-page';
    filename = `${filename}.mhtml`;

    // Use the downloads API to save the file.
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true // Ask the user where to save it.
    }, (downloadId) => {
      // After the download starts, revoke the blob URL to free up memory.
      URL.revokeObjectURL(url);
      
      if (chrome.runtime.lastError) {
        console.error(`Vibe Scraper Download Error: ${chrome.runtime.lastError.message}`);
      }
    });
  });
});

/**
 * Build removal jobs based on origin and data types
 * Data types that support origin filtering vs those that don't
 */
function buildRemovalJobs(origin) {
  const jobs = [];
  
  // Job A: Data types that SUPPORT origin filtering
  // These can be cleared for a specific origin
  const originFilteredData = {
    cache: true,
    cacheStorage: true,
    cookies: true, // Clear cookies for this origin
    localStorage: true, // Clear localStorage for this origin
    indexedDB: true, // Clear indexedDB for this origin
    serviceWorkers: true, // Clear service workers for this origin
    formData: false, // Don't clear form data
    passwords: false, // Don't clear passwords
    downloads: false, // Don't clear downloads
    history: false, // Don't clear history
    pluginData: false, // Don't clear plugin data
    serverBoundCertificates: false, // Don't clear certificates
    webSQL: false, // Don't clear webSQL
    fileSystems: false // Don't clear file systems
  };
  
  // Only add this job if there's data to clear
  if (originFilteredData.cache || originFilteredData.cacheStorage || 
      originFilteredData.cookies || originFilteredData.localStorage ||
      originFilteredData.indexedDB || originFilteredData.serviceWorkers) {
    jobs.push({
      options: { origins: [origin] },
      dataToRemove: originFilteredData
    });
  }
  
  // Job B: Data types that DON'T support origin filtering
  // These would be cleared globally, but we're NOT clearing them
  // since we only want to clear cache for the specific origin
  
  return jobs;
}

/**
 * Execute removal jobs sequentially
 */
async function executeRemovalJobs(jobs) {
  const results = [];
  
  for (const job of jobs) {
    await new Promise((resolve, reject) => {
      chrome.browsingData.remove(
        job.options,
        job.dataToRemove,
        () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        }
      );
    });
    results.push({ success: true });
  }
  
  return results;
}

/**
 * Handle messages from popup for clearing cache
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle ping to wake up service worker
  if (message.type === 'PING') {
    sendResponse({ success: true, pong: true });
    return false;
  }
  
  if (message.type === 'CLEAR_CACHE' && message.origin) {
    // Build removal jobs based on origin and data types
    const jobs = buildRemovalJobs(message.origin);
    
    if (jobs.length === 0) {
      sendResponse({ success: false, error: 'No removal jobs to execute' });
      return false;
    }
    
    // Execute jobs sequentially
    executeRemovalJobs(jobs)
      .then(async () => {
        // Also clear localStorage directly from the page context (browsingData API may not fully clear it)
        if (message.tabId) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: message.tabId },
              func: () => {
                try {
                  // Clear localStorage
                  localStorage.clear();
                  // Clear sessionStorage as well
                  sessionStorage.clear();
                } catch (e) {
                  // Ignore errors - tab might be protected
                }
              }
            });
          } catch (e) {
            // Could not clear localStorage (tab might be protected)
          }
          
          // Optionally reload the tab if tabId is provided
          chrome.tabs.reload(message.tabId, {}, () => {
            if (chrome.runtime.lastError) {
              // Fallback: Try to inject reload script
              chrome.scripting.executeScript({
                target: { tabId: message.tabId },
                func: () => {
                  window.location.reload();
                }
              }).catch(() => {
                // Ignore errors - tab might be protected
              });
            }
          });
        }
        
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error(`[Development Testing] Cache clear error: ${error.message}`);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
  
  return false;
});