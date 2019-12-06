/**
 * Class to handle Firefox API based code.
 */
class DCRFirefox extends DCRBase {
  constructor() {
    super();
    this.setStorageListener();
  }
  /**
   * Execute a code script in a tab escope.
   * @memberof DCRFirefox
   * @param {string} code Code to be executed.
   * @param {integer} tabId Tab identifier.
   * @static
   * @throws {Error} On execution failure.
   * @returns {Promise<void>} Promise to return nothing.
   */
  async executeDomainCodeOnTab(code, tabId) {
    await browser.tabs.executeScript(tabId, { code: code })
  }

  /**
   * Fetched from the storage the configured domains.
   * @memberof DCRFirefox
   * @static
   * @throws {Error} On storage error.
   * @returns {Promise<object[]>} List of configured domains or an empty list.
   */
  async fetchDomains() {
    const data = await browser.storage.local.get('domains');
    this.domains = data && undefined !== data.domains ? data.domains : [];
    return this.domains;
  }

  /**
   * Fetched from the storage the configured domains.
   * @memberof DCRFirefox
   * @static
   * @throws {Error} On storage error.
   * @returns {Promise<object[]>} List of configured domains or an empty list.
   */
  async queryCurrentWindowTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (undefined === tabs[0]) {
      throw new Error('No current tab found!');
    }
    return tabs[0];
  }

  /**
   * Stores the list of domains configures into the local storage.
   * @memberof DCRFirefox
   * @static
   * @param {object[]} domains List of domains configured by the user.
   * @throws {Error} On storage error.
   * @throws {Promise<void>} Promise to return nothing useful.
   */
  async storeDomains(domains) {
    await browser.storage.local.set({ domains: domains ? domains : this.domains });
  }

  setStorageListener() {
    browser.storage.onChanged.addListener((changes, area) => {
      console.info('Detected storage changes, loading them...');
      if ('local' === area) {
        for (const item in Object.keys(changes)) {
          if ('doamins' === item) {
            this.domains = changes[item].newValue;
          }
        }
      }
    });
  }
}

// Updates the current DCR var to this version.
if (DCRBase.hasFirefoxSupport()) {
  console.info('Supporting firefox...');
  var DCR = new DCRFirefox();
}
