chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedSites: [] });
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.sync.get('blockedSites', (data) => {
        const blockedSites = data.blockedSites || [];
        const domain = extractDomain(tab.url);
        if (blockedSites.includes(domain)) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: redirectToBlockedPage,
          });
        }
      });
    }
  });
  
  function extractDomain(url) {
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.slice(4) : domain;
  }
  
  function redirectToBlockedPage() {
    window.location.href = chrome.runtime.getURL("blocked.html");
  }
  