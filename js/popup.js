// Executes the domain code on script load.
DCR.fetchDomains().then(async (domains) => {
  $('#error').addClass('d-none');
  $('#logo').addClass('d-none');
  $('#spinner').removeClass('d-none');
  $('#message').html('<p>Executing code...</p>');

  // Queries the current tab on the current window.
  const tab = await DCR.queryCurrentWindowTab();
  const runs = [];

  // Iterates over the configured domains to know wich code to execute.
  for (const domain of domains) {
    // Test the current domain with the configured one.
    if (new RegExp(domain.url).test(tab.url)) {
      runs.push(DCR.executeDomainCodeOnTab(domain.code, tab.id, domain.url));
    }
  }

  // If it has code executions being performed, wait for all of them
  // or for the first error.
  if (0 < runs.length) {
    try {
      const runnedRegexes = await Promise.all(runs);
      setTimeout(() => {
        $('#error').addClass('d-none');
        $('#logo').removeClass('d-none');
        $('#spinner').addClass('d-none');
        $('#message').html('<p>Code executed for\n<small><span>' + runnedRegexes.join('</span>\n<span>') + '</span></small></p>');
      }, 1000);
    } catch (err) {
      $('#error').removeClass('d-none');
      $('#logo').addClass('d-none');
      $('#spinner').addClass('d-none');
      console.error(err);
      $('#message').html('<p>Code execution error\n' + err.message + '</p>');
    }
  } else {
    // Nothing happened.
    $('#error').addClass('d-none');
    $('#logo').removeClass('d-none');
    $('#spinner').addClass('d-none');
    $('#message').html('<p>No coded was executed.</p>');
  }
});
