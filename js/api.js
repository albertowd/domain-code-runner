'use strict';

/**
 * Base class to handle API based code.
 */
class DCRBase {
  constructor() {
    this.domains = [];
    this.browser = DCRBase.getSupportedBrowser();
  }

  /**
   * Execute a code script in a tab escope.
   * @memberof DCRBase
   * @param {string} code Code to be executed.
   * @param {integer} tabId Tab identifier.
   * @param {string} codeRegEx Code reference.
   * @static
   * @throws {Error} On execution failure.
   * @returns {Promise<string>} Promise to return nothing.
   */
  async executeDomainCodeOnTab(code, tabId, codeRegEx) {
    throw new Error('Not implemented.');
  }

  /**
   * Fetched from the storage the configured domains.
   * @memberof DCRBase
   * @static
   * @throws {Error} On storage error.
   * @returns {Promise<object[]>} List of configured domains or an empty list.
   */
  async fetchDomains() {
    throw new Error('Not implemented.');
  }

  /**
   * Fetched from the storage the configured domains.
   * @memberof DCRBase
   * @static
   * @throws {Error} On storage error.
   * @returns {Promise<object[]>} List of configured domains or an empty list.
   */
  async queryCurrentWindowTab() {
    throw new Error('Not implemented.');
  }

  /**
   * Stores the list of domains configures into the local storage.
   * @memberof DCRBase
   * @static
   * @param {object[]} domains List of domains configured by the user.
   * @throws {Error} On storage error.
   * @throws {Promise<void>} Promise to return nothing useful.
   */
  async storeDomains(domains) {
    throw new Error('Not implemented.');
  }

  setStorageListener() {
    this.browser.storage.onChanged.addListener((changes, area) => {
      console.info('Detected storage changes, loading them...');
      if ('local' === area) {
        for (const changeName of Object.keys(changes)) {
          if ('domains' === changeName) {
            this.domains = changes[changeName].newValue.map(DCRBase.storageToDomain);
            console.debug('Domain(s) loaded: ' + this.domains.length);
          }
        }
      }
    });
  }

  getBrowser() {
    return this.browser;
  }

  getVersion() {
    return DCRBase.getSupportedBrowser().runtime.getManifest().version;
  }

  static domainToStorage(domain) {
    return { code: domain.code, url: domain.url.source };
  }

  static storageToDomain(domain) {
    return { code: domain.code, url: new RegExp(domain.url) };
  }

  static getSupportedBrowser() {
    return DCRBase.hasFirefoxSupport() ? browser : chrome;
  }

  static hasChromeSupport() {
    return !DCRBase.hasFirefoxSupport();
  }

  static hasFirefoxSupport() {
    try {
      return undefined !== browser;
    } catch (err) {
      return false;
    }
  }
}