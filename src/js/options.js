// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
  domains = domains.filter((domain) => url != domain.url);
  await storeDomains(domains);
  clearOptions();
  await loadDomains(defaultDomain);
}

function exportDomains() {
  console.log('Exporting domains...')
  $('<a></a>')
    .attr('id', 'downloadFile')
    .attr('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(JSON.stringify(domains)))
    .attr('download', 'domain-code-runner.json')
    .appendTo('body');

  $('#downloadFile').ready(() => {
    $('#downloadFile').get(0).click();
    $('#downloadFile').remove()
  });
}

async function importFile() {
  console.log('Importing file...')
  const fileName = $('#importFile').get(0).files[0];
  if (fileName) {
    var reader = new FileReader();
    reader.readAsText(fileName);
    reader.onload = async (result) => {
      await DCR.storeDomains(JSON.parse(result.target.result));
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
      if (url == domain.url) {
        console.debug('Domain ' + url + ' selected.');
        setDomain(domain);
      }
    }
  }
  toggleDelete();
}

async function loadDomains(url) {
  domains = (await DCR.fetchDomains()).sort((a, b) => (a.url > b.url) ? 1 : -1);
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
    const url = domain.url;
    select.append($('<option>').text(url).val(url));
  }
  console.debug('Loaded ' + domains.length + ' domains.');
}

async function resetDomains() {
  console.log('Reseting domains...');
  await storeDefaultDomains();
  await loadDomains();
}

async function saveDomain() {
  const url = $('#url').val();
  console.log('Saving domain ' + url + '...');
  domains = domains.filter((domain) => url != domain.url);
  domains.push({ code: editor ? editor.getValue() : '', url: url });
  await DCR.storeDomains(domains);
  await loadDomains(url);
}

function setDomain(domain) {
  console.debug('Setting domain ' + domain.url + ' on editor...');
  editor ? editor.setValue(domain.code, -1) : console.error(editorError, -1);
  $('#url').val(domain.url);
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
