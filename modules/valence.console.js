'use strict';

/***********************************************************************************************************************************************
 * VALENCE CONSOLE
 ***********************************************************************************************************************************************
 * @description API the grants _console access to valence properties
 */

angular.module('valence')
  .service('valence.console', ['valence.struct', function(struct) {
    var Valence = {};

    Valence.Console = function() {
      this.__instance__ = {
        models: struct.Object(),
        resources: struct.Object()
      };

      this.Models = this.__instance__.models.data;
      this.Resources = this.__instance__.resources.data;

      window.Valence = this;

      return this;
    };

    Valence.Console.prototype.model = function(model) {
      var obj = {};
          obj[model.name] = model;

      this.__instance__.models.add(obj);
      return this;
    };

    Valence.Console.prototype.resource = function(resource) {
      var obj = {};
          obj[resource.name] = resource;

      this.__instance__.resources.add(obj);
      return this;
    };

    return new Valence.Console();
  }]);