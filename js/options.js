'use strict';

const defaultCode = '// Your javascript code here...';
const defaultDomain = 'New domain...';
const editorError = 'No editor to get/set code!';

let domains = [];
let editor = null;

function clearOptions() {
  console.debug('Clearing domain options...');
  $('#domains').empty().append($('<option>').text(defaultDomain).val(defaultDomain));
}

async function deleteDomain() {
  const url = $('#url').val();
  console.info('Deleting domain ' + url + '...');
  domains = domains.filter((domain) => url != domain.url.source);
  await DCR.storeDomains(domains);
  clearOptions();
  await loadDomains(defaultDomain);
}

function exportDomains() {
  console.info('Exporting domains...');
  const converted = domains.map(DCRBase.domainToStorage);
  $('<a></a>')
    .attr('id', 'downloadFile')
    .attr('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(JSON.stringify(converted)))
    .attr('download', 'domain-code-runner.json')
    .appendTo('body');

  $('#downloadFile').ready(() => {
    $('#downloadFile').get(0).click();
    $('#downloadFile').remove()
  });
}

async function importFile() {
  console.info('Importing file...')
  const fileName = $('#importFile').get(0).files[0];
  if (fileName) {
    var reader = new FileReader();
    reader.readAsText(fileName);
    reader.onload = async (result) => {
      const parsed = JSON.parse(decodeURIComponent(result.target.result));
      await DCR.storeDomains(parsed.map(DCRBase.storageToDomain));
      await loadDomains();
    };
  }
}

function onDomainChanged() {
  const url = $("#domains option:selected").val();
  if (defaultDomain == url) {
    console.debug('New domain selected.');
    setDomain({ code: defaultCode, url: '' });
  }
  else {
    for (const domain of domains) {
      if (url == domain.url.source) {
        console.debug('Domain ' + url + ' selected.');
        setDomain(domain);
      }
    }
  }
  toggleDelete();
}

async function loadDomains(url) {
  domains = (await DCR.fetchDomains()).sort((a, b) => (a.url.source > b.url.source) ? 1 : -1);
  loadOptions();
  if (url) {
    $('#domains').val(url);
  }
}

function loadOptions() {
  clearOptions();

  console.debug('Loading domain options...');
  const select = $('#domains');
  for (const domain of domains) {
    const url = domain.url.source;
    console.log(domain);
    select.append($('<option>').text(url).val(url));
  }
  console.debug('Loaded ' + domains.length + ' domains.');
}

async function resetDomains() {
  console.info('Reseting domains...');
  await storeDefaultDomains();
  await loadDomains();
}

async function saveDomain() {
  const url = $('#url').val();
  console.info('Saving domain ' + url + '...');
  domains = domains.filter((domain) => url != domain.url.source);
  domains.push({ code: editor ? editor.getValue() : '', url: new RegExp(url) });
  await DCR.storeDomains(domains);
  await loadDomains(url);
}

function setDomain(domain) {
  console.debug('Setting domain ' + domain.url.source + ' on editor...');
  editor ? editor.setValue(domain.code, -1) : console.error(editorError, -1);
  $('#url').val(domain.url.source);
}

function toggleDelete() {
  const del = $('#delete');
  if (defaultDomain == $("#domains option:selected").val()) {
    del.attr('disabled', true);
  }
  else {
    del.removeAttr('disabled');
  }
}

window.onload = () => {
  $('#version').text(DCR.getVersion());

  // Called after all assets have been loaded.
  editor = ace.edit("script");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");

  $('#delete').on('click', deleteDomain);
  $('#domains').on('change', onDomainChanged);
  $('#export').on('click', exportDomains);
  $('#import').on('click', () => $('#importFile').click());
  $('#importFile').on('change', importFile);
  $('#reset').on('click', resetDomains);
  $('#save').on('click', saveDomain);

  loadDomains();
};
