Package.describe({
  name: 'clinical:hl7-resource-bundle',
  version: '1.3.12',
  summary: 'HL7 FHIR Resource - Bundle',
  git: 'https://github.com/clinical-meteor/hl7-resource-bundle',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('mongo');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('aldeed:collection2@2.5.0');
  api.use('simple:json-routes@2.1.0');
  api.use('clinical:fhir-vault-server@0.0.3');

  api.use('clinical:base-model@1.3.5');
  api.use('clinical:hl7-resource-datatypes@3.0.0');

  api.addFiles('lib/hl7-resource-bundle.js', ['client', 'server']);
  api.addFiles('server/rest.js', 'server');
  api.addFiles('server/initialize.js', 'server');

  api.export('Bundle');
  api.export('Bundles');
  api.export('BundleSchema');
});
