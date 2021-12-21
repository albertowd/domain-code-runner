'use strict';
/**
 * Default code to run on abril.com domains.
 */
function defaultAbrilScript() {
  // Removes the modal anti-block message.
  for (const elem of document.getElementsByClassName('tp-modal')) {
    elem.parentNode.removeChild(elem);
  }
  
  // Removes it background.
  for (const elem of document.getElementsByClassName('tp-active')) {
    elem.parentNode.removeChild(elem);
  }
  
  // Removes the open modal css tag.
  for (const elem of document.getElementsByClassName('tp-modal-open')) {
    elem.className = elem.className.replace('tp-modal-open', '');
  }
}

/**
 * Default code to run on globo.com domains.
 */
function defaultGloboScript() {
  // Gets the 'detecta-adblock' div to remove it.
  const da = document.getElementById('detecta-adblock');
  if (da) {
    da.parentNode.removeChild(da);
  }

  // Gets the 'gcomPromo' div to remove it.
  const gcomPromo = document.getElementById('gcomPromo');
  if (gcomPromo) {
    gcomPromo.parentNode.removeChild(gcomPromo);
  }

  // Removes
  for (const classElem of document.getElementsByClassName('paywall-cpt')) {
    classElem.parentNode.removeChild(classElem);
  }

  // Fixes the body overflow to reveal all the page content.
  for (const tagElem of document.getElementsByTagName('body')) {
    tagElem.style.removeProperty('overflow');
    tagElem.style.removeProperty('position');
  }
}

/**
 * Stores the default domain configures into the storage. It automatically updates all the
 * domain rules used by the extension.
 */
async function storeDefaultDomains() {
  console.log('Storing default domains...');
  const defaultDomains = [
    {
      "code": defaultAbrilScript.toString() + '\ndefaultAbrilScript();\n',
      "url": /.*\.abril\.com.*/
    },
    {
      "code": defaultGloboScript.toString() + '\ndefaultGloboScript();\n',
      "url": /.*\.globo\.com.*/
    }
  ];

  // Configure the default domains.
  await DCR.storeDomains(defaultDomains);
}
