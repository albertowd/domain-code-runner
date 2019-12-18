'use strict';

const supportedBrowser = DCRBase.getSupportedBrowser();

async function updatePageAction() {
  const tab = await DCR.queryCurrentWindowTab()
  let hasAction = false;
  for (const domain of DCR.domains) {
    hasAction |= domain.url.test(tab.url);
  }
  hasAction ? supportedBrowser.pageAction.show(tab.id) : supportedBrowser.pageAction.hide(tab.id);
}

supportedBrowser.runtime.onInstalled.addListener(async () => {
  console.info('Installing extension...');
  const dbDomains = await DCR.fetchDomains();
  if (0 == dbDomains.length) {
    console.info('No configs found, setting default one...');
    await storeDefaultDomains();
  }
});

supportedBrowser.tabs.onActivated.addListener(updatePageAction);
supportedBrowser.tabs.onUpdated.addListener(updatePageAction);
