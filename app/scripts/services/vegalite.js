'use strict';

angular.module('vleApp')
  .service('Vegalite', function (Dataset, Config) {
    var service = {};

    var removeEmptyFieldDefs = function(enc) {
      enc.enc = _.omit(enc.enc, function(fieldDef) {
        return fieldDef.name === null;
      });
    };

    var deleteNulls = function(enc) {
      for (var i in enc) {
        if (_.isObject(enc[i])) {
          deleteNulls(enc[i]);
        }
        // This is why I hate js
        if (enc[i] === null || (_.isObject(enc[i]) && Object.keys(enc[i]).length === 0) || enc[i] === []) {
          delete enc[i];
        }
      }
    };

    service.vlSpec = null;
    service.spec = null;
    service.shorthand = null;
    service.vegaSpec = null;

    service.updateVegaliteSpec = function(newSpec) {
      var cleanSpec = _.cloneDeep(newSpec);

      removeEmptyFieldDefs(cleanSpec)
      deleteNulls(cleanSpec);

      // we may have removed enc
      if (!('enc' in cleanSpec)) {
        cleanSpec.enc = {}
      }

      service.vlSpec = cleanSpec;
      service.spec = vl.Encoding.fromSpec(cleanSpec, Config.config);
      service.shorthand = service.spec.toShorthand();
      service.vegaSpec = vl.toVegaSpec(service.spec, Dataset.stats);
    };

    return service;
  });