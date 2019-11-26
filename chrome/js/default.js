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

/**
 * Stores the default domain configures into the storage. It automatically updates all the
 * domain rules used by the extension.
 * @param {function} callback Callback function to be executed on update success.
 */
function storeDefaultDomains(callback) {
  console.log('Storing default domains...');
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
  storeDomains(defaultDomains, callback);
}
