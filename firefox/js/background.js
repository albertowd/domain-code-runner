// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

browser.runtime.onInstalled.addListener(async () => {
  console.log('Installing extension...');
  const dbDomains = await DCR.fetchDomains();
  if (0 == dbDomains.length) {
    console.log('No configs found, setting default one...');
    await storeDefaultDomains();
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  let hasAction = false;
  for (const domain of DCR.domains) {
    hasAction |= new RegExp(domain.url).test(tab.url);
  }
  hasAction ? browser.pageAction.show(tabId) : browser.pageAction.hide(tabId);
});
