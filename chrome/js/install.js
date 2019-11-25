// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * Default code to run on globo.com domains.
 */
function defaultGloboScript() {
  // Gets the 'detecta-adblock' div to remove it.
  const da = document.getElementById('detecta-adblock');
  if (da) {
    da.remove();
  }
  // Fixes the body overflow to reveal all the page content.
  for (const dom of document.getElementsByTagName('body')) {
    dom.style.removeProperty('overflow');
  }
}

// Executes the code on extension installation.
chrome.runtime.onInstalled.addListener(function () {
  console.log('Seting up extension...');
  const defaultDomains = [
    {
      "code": defaultGloboScript.toString() + '\ndefaultGloboScript()\n',
      "url": "oglobo.globo.com"
    },
    {
      "code": defaultGloboScript.toString() + '\ndefaultGloboScript()\n',
      "url": "revistagalileu.globo.com"
    }
  ];

  // Configure the default domains.
  storeDomains(defaultDomains);
  // Updates the extension rules to the default domains.
  updateDomainRules(defaultDomains);
  console.log('Extension setup completed.');
});
