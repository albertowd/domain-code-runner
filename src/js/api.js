/**
 * Base class to handle API based code.
 */
class DCRBase {
  constructor() {
    this.domains = [];
  }

  /**
   * Execute a code script in a tab escope.
   * @memberof DCRBase
   * @param {string} code Code to be executed.
   * @param {integer} tabId Tab identifier.
   * @static
   * @throws {Error} On execution failure.
   * @returns {Promise<void>} Promise to return nothing.
   */
  async executeDomainCodeOnTab(code, tabId) {
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
    throw new Error('Not implemented.');
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