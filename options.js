document.addEventListener('DOMContentLoaded', function () {
    const siteInput = document.getElementById('siteInput');
    const blockSiteButton = document.getElementById('blockSite');
    const blockedSitesList = document.getElementById('blockedSites');
  
    chrome.storage.sync.get(['blockedSites', 'blockTimes'], function (result) {
      const blockedSites = result.blockedSites || [];
      const blockTimes = result.blockTimes || {};
      blockedSites.forEach(site => addSiteToList(site, blockTimes[site]));
    });
  
    blockSiteButton.addEventListener('click', function () {
      const site = siteInput.value.trim();
  
      if (site) {
        chrome.storage.sync.get(['blockedSites', 'blockTimes'], function (result) {
          let blockedSites = result.blockedSites || [];
          let blockTimes = result.blockTimes || {};
  
          if (!blockedSites.includes(site)) {
            blockedSites.push(site);
            blockTimes[site] = Date.now();
  
            chrome.storage.sync.set({ blockedSites: blockedSites, blockTimes: blockTimes }, function () {
              addSiteToList(site, blockTimes[site]);
              siteInput.value = '';
            });
          }
        });
      }
    });
  
    function addSiteToList(site, blockTime) {
      const li = document.createElement('li');
      li.className = 'site-item';
      li.textContent = site;
  
      const timer = document.createElement('span');
      timer.className = 'timer';
      li.appendChild(timer);
  
      const unblockButton = document.createElement('button');
      unblockButton.textContent = 'Unblock';
      unblockButton.className = 'unblock-button';
      unblockButton.addEventListener('click', function () {
        const messages = [
          "This is it?? You said you will study more!",
          "Always the same excuses Huh? Don't blame anyone but yourself later :)",
          "Don't give up so quickly.Stick to what you said ! Make this day different and do what you have to do.",
          "It is your choice, but I will be judging you!",
          "Are you sure? Just a little more focus! the internet is a virtual place that does not exist ! focus on what exists",
          "Think about why you blocked this site in the first place!",
          "When was the last time you did the tasks you said you will do? I don't rememeber neither :)"
        ];
  
        showPopupsSequentially(messages, 0, () => {
          chrome.storage.sync.get(['blockedSites', 'blockTimes'], function (result) {
            let blockedSites = result.blockedSites || [];
            let blockTimes = result.blockTimes || {};
  
            blockedSites = blockedSites.filter(s => s !== site);
            delete blockTimes[site];
  
            chrome.storage.sync.set({ blockedSites: blockedSites, blockTimes: blockTimes }, function () {
              li.remove();
            });
          });
        });
      });
  
      li.appendChild(unblockButton);
      blockedSitesList.appendChild(li);
  
      updateTimer(timer, blockTime);
      setInterval(() => updateTimer(timer, blockTime), 1000);
    }
  
    function showPopupsSequentially(messages, index, callback) {
      if (index < messages.length) {
        alert(messages[index]);
        showPopupsSequentially(messages, index + 1, callback);
      } else {
        callback();
      }
    }
  
    function updateTimer(timerElement, blockTime) {
      const currentTime = Date.now();
      const elapsed = currentTime - blockTime;
  
      const seconds = Math.floor((elapsed / 1000) % 60);
      const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
      const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  
      let timeString = `${seconds}s`;
      if (minutes > 0 || hours > 0 || days > 0) timeString = `${minutes}m ${timeString}`;
      if (hours > 0 || days > 0) timeString = `${hours}h ${timeString}`;
      if (days > 0) timeString = `${days}d ${timeString}`;
  
      timerElement.textContent = ` (Blocked for: ${timeString})`;
    }
  });
  