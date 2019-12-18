'use strict';

/**
 * Class to handle Chrome API based code.
 */
class DCRChrome extends DCRBase {
  constructor() {
    super();
    this.setStorageListener();
  }

  /**
   * Execute a code script in a tab escope.
   * @memberof DCRChrome
   * @param {string} code Code to be executed.
   * @param {integer} tabId Tab identifier.
   * @static
   * @throws {Error} On execution failure.
   * @returns {Promise<void>} Promise to return nothing.
   */
  async executeDomainCodeOnTab(code, tabId) {
    await new Promise((resolve, reject) => {
      chrome.tabs.executeScript(tabId, { code: code }, () => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
      });
    });
  }

  /**
   * Fetched from the storage the configured domains.
   * @memberof DCRChrome
   * @static
   * @throws {Error} On storage error.
   * @returns {Promise<object[]>} List of configured domains or an empty list.
   */
  async fetchDomains() {
    return await new Promise((resolve, reject) => {
      chrome.storage.local.get('domains', (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          this.domains = data && undefined !== data.domains ? data.domains : [];
          this.domains = this.domains.map(DCRBase.storageToDomain);
          resolve(this.domains);
        }
      });
    });
  }

  /**
   * Fetched from the storage the configured domains.
   * @memberof DCRChrome
   * @static
   * @throws {Error} On storage error.
   * @returns {Promise<object[]>} List of configured domains or an empty list.
   */
  async queryCurrentWindowTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(tabs[0]);
      });
    });
  }

  /**
   * Stores the list of domains configures into the local storage.
   * @memberof DCRChrome
   * @static
   * @param {object[]} domains List of domains configured by the user.
   * @throws {Error} On storage error.
   * @throws {Promise<void>} Promise to return nothing useful.
   */
  async storeDomains(domains) {
    const toConvert = domains ? domains : this.domains;
    await new Promise(async (resolve, reject) => {
      chrome.storage.local.set({ domains: toConvert.map(DCRBase.domainToStorage) }, () => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
      });
    });
  }
}

// Updates the current DCR var to this version.
if (DCRBase.hasChromeSupport()) {
  console.info('Supporting chrome...');
  var DCR = new DCRChrome();
}
