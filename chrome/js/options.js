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

function deleteDomain() {
  const url = $('#url').val();
  console.info('Deleting domain ' + url + '...');
  domains = domains.filter((domain) => url != domain.url);
  storeDomains(domains, function () {
    setDomain({ code: defaultCode, url: '' });
    loadDomains(defaultDomain);
  });
}

function onDomainChanged() {
  const url = $("#domains option:selected").val();
  if ('New domain...' == url) {
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
}

function loadDomains(url) {
  fetchDomains(function (storeDomains) {
    domains = storeDomains.sort((a, b) => (a.url > b.url) ? 1 : -1);
    loadOptions();
    if (url) {
      $('#domains').val(url);
    }
  });
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

function saveDomain() {
  const url = $('#url').val();
  console.log('Saving domain ' + url + '...');
  domains = domains.filter((domain) => url != domain.url);
  domains.push({ code: editor ? editor.getValue() : '', url: url });
  storeDomains(domains, function () {
    loadDomains(url);
  });
}

function setDomain(domain) {
  console.debug('Setting domain ' + domain.url + ' on editor...');
  editor ? editor.setValue(domain.code, -1) : console.error(editorError, -1);
  $('#url').val(domain.url);
}

window.onload = function () {
  // Called after all assets have been loaded.
  editor = ace.edit("script");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");

  $('#delete').on('click', deleteDomain);
  $('#domains').on('change', onDomainChanged);
  $('#save').on('click', saveDomain);

  loadDomains();
};
