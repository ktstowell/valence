'use strict';


/***********************************************************************************************************************************************
 * VALENCE STRING
 ***********************************************************************************************************************************************
 * @description
 */

angular.module('valence')
  .service('valence.struct.String', function() {
    var Valence = {};

    Valence.String = function(options) {
      this.data = '';
      this.options = options;

      return this;
    };

    Valence.String.prototype.set = function(str) {
      this.data = str;
      return this;
    };

    Valence.String.prototype.delete = function() {
      this.data = '';
      return this;
    };

    Valence.String.prototype.get = function() {
      return this.data;
    };

    Valence.String.prototype.truthy = function() {
      return !!this.data;
    };

    Valence.String.prototype.trim = function() {

    };

    return function(options) {
      return new Valence.String(options);
    };
  });