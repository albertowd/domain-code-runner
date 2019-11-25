/**
 * Fetched from the Chrome sync storage the configured domains and calls the callback function with it.
 * @param {function} callback Callback to be executed with the fetched domain list, if success.
 */
function fetchDomains(callback) {
  console.log('Fetching sync domains...');
  chrome.storage.sync.get('domains', function (data) {
    // Validates the 'domains' result data.
    if (data && undefined !== data.domains) {
      console.debug('Fetched ' + data.domains.length + ' domains.');
      callback(data.domains);
    }
  });
}

/**
 * Stores the list of domains configures into the Chrome sync storage. It automatically updates all the
 * domain rules used by the extension.
 * @param {object[]} domains List of domains configured by the user.
 * @param {function} callback Callback function to be executed on storage success and rules update.
 */
function storeDomains(domains, callback) {
  console.log('Storing sync domains...');
  chrome.storage.sync.set({ domains: domains }, function () {
    console.debug('Stored ' + domains.length + ' domains.');
    updateDomainRules(domains, callback);
  });
}

/**
 * Updates the extension rules to be activated on the desired tab domains.
 * @param {object[]} domains List of domains configured by the user.
 * @param {function} callback Callback function to be executed on update success.
 */
function updateDomainRules(domains, callback) {
  console.log('Reconfiguring domain codes...');
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    const defaultRules = [];
    for (const domain of domains) {
      console.debug('Configuring domain: ' + domain.url + ' rule...');
      defaultRules.push({
        actions: [new chrome.declarativeContent.ShowPageAction()],
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlMatches: domain.url } })
        ]
      });
    }

    // Adds the configured ruls to the Chrome declarative content by this extension.
    chrome.declarativeContent.onPageChanged.addRules(defaultRules);
    console.log('Configured ' + domains.length + ' domain rules.');

    // If its valid, executes the callback function.
    if (callback) {
      callback();
    }
  });
}
