/**
 * Execute code on each tab that matches the configurations.
 * @param {object[]} domains List of configured domains to run its codes.
 */
function executeCodeOnTabs(domains) {
  // Queries the current tab on the current window.
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // The query returns an array of tabs with one in the current context.
    for (const tab of tabs) {
      // Iterates over the configured domains to know wich code to execute.
      for (const domain of domains) {
        // Test the current domain with the configured one.
        if (new RegExp(domain.url).test(tab.url)) {
          // Actually execute the configured code.
          browser.tabs.executeScript(tab.id, { code: domain.code }, updateMessage);
        }
      }
    }
  });
}

/**
 * Code execution callback to inform the user through the popup message.
 */
function updateMessage() {
  $('#message').text('Code executed!');
}

// Executes the domain code on script load.
fetchDomains(executeCodeOnTabs);
