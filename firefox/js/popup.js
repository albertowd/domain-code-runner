// Executes the domain code on script load.
DCR.fetchDomains().then(async (domains) => {
  // Queries the current tab on the current window.
  const tab = await DCR.queryCurrentWindowTab();

  // Iterates over the configured domains to know wich code to execute.
  for (const domain of domains) {
    // Test the current domain with the configured one.
    if (new RegExp(domain.url).test(tab.url)) {
      try {
        await DCR.executeDomainCodeOnTab(domain.code, tab.id);
        $('#message').text('Code executed.');
      } catch (err) {
        console.error(err);
        $('#message').text('Code not executed!');
      }
    }
  }
});
