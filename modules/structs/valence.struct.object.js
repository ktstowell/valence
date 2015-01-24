'use strict';

/***********************************************************************************************************************************************
 * VALENCE OBJECT
 ***********************************************************************************************************************************************
 * @description
 */

angular.module('valence')
  .service('valence.struct.Object', function() {

    var Valence = {struct:{}};

    Valence.struct.Object = function(opts) {

      this.data = {};

      var defaults = {
        deep: false
      };

      this.options = angular.copy(opts, defaults);

      return this;
    };

    Valence.struct.Object.prototype.add = function(data) {
      if(data.constructor !== Object) {
        throw 'Cannonball Object: Please provide a key-value pair to add to your object.';
      }

      for(var key in data) {
        var path = key.split('.');
        var loc = this.data;

        for(var p=0; p<path.length; p++) {
          if(!loc.hasOwnProperty(path[p])) {
            loc[path[p]] = {};
          }

          if(!path[p+1]) {
            loc[path[p]] = data[key];
          } else {
            loc = loc[path[p]];
          }
        }
      }

      return this;
    };

    Valence.struct.Object.prototype.remove = function(data, opts) {
      var self = this;
      var query = {keys: [], sets:[]};

      if(data.constructor === String) {
        query.keys.push(data);
      }

      if(data.constructor === Array) {
        for(var i=0; i<data.length; i++) {

          if(data[i].constructor === String) {
            query.keys.push(data[i]);
          }

          if(data[i].constructor === Object) {
            query.sets.push(data[i]);
          }
        }
      }

      if(data.constructor === Object) {
        query.sets.push(data);
      }

      (function seekAndDestroy(obj) {
        for(var key in obj) {
          if(query.keys.length) {
            for(var k=0; k<query.keys.length; k++) {
              if(query.keys[k] === key) {
                delete obj[key];
              } else {
                if(obj[key].constructor === Object && (self.options.deep || opts && opts.deep)) {
                  seekAndDestroy(obj[key]);
                }
              }
            }
          }

          if(query.sets.length) {
            for(var s=0; s<query.sets.length; s++) {
              var toMatch = Object.keys(query.sets[s]).length;
              var matched = 0;

              for(var sKey in query.sets[s]) {
                if((key === sKey || sKey === '*') && query.sets[s][sKey] === obj[key]) {
                  matched++;
                }
              }

              if(matched === toMatch) {
                delete obj[key];
              } else {
                if(obj[key].constructor === Object && (self.options.deep || opts && opts.deep)) {
                  seekAndDestroy(obj[key]);
                }
              }
            }
          }
        }
      })(self.data);
    };

    Valence.struct.Object.prototype.find = function(data, opts) {
      var self = this;
      var path = '';
      var query = {keys: [], sets: []};
      var results = [];

      if(data.constructor === String) {
        query.keys.push(data);
      }

      if(data.constructor === Object) {
        query.sets.push(data);
      }

      if(data.constructor === Array) {
        for(var i=0; i<data.length; i++) {

          if(data[i].constructor === String) {
            query.keys.push(data);
          }

          if(data[i].constructor === Object) {
            query.sets.push(data);
          }
        }
      }


      (function find(obj) {
        for(var key in obj) {

          path += (key+'.');

          if(query.keys.length) {
            for(var i=0; i<query.keys.length; i++) {
              if(key === query.keys[i]) {
                results.push({data: obj[key], path: path.substr(0, path.length-1)});
                path = '';
                if(opts && opts.single) {
                  break;
                }
              } else {
                if(obj[key].constructor === Object && (self.options.deep || opts && opts.deep)) {
                  find(obj[key]);
                }
              }
            }
          }

          if(query.sets.length) {
            for(var s=0; s<query.sets.length; s++) {
              var toMatch = Object.keys(query.sets[s]).length;
              var matched = 0;

              for(var sKey in query.sets[s]) {
                if((key === sKey || sKey === '*') && query.sets[s][sKey] === obj[key]) {
                  matched++;
                }
              }

              if(matched === toMatch) {
                results.push({data: obj[key], path: path.substr(0, path.length-1)});
                path = '';
              } else {
                if(obj[key].constructor === Object && (self.options.deep || opts && opts.deep)) {
                  find(obj[key]);
                }
              }
            }
          }
        }
      })(self.data);

      if(opts && opts.single) {
        results = results[0];
      }

      return results;
    };

    Valence.struct.Object.prototype.empty = function() {
      for(var prop in this.data) {
        delete this.data[prop];
      }

      return this;
    };

    Valence.struct.Object.prototype.forEach = function(fn) {
      var index = 0;

      for(var prop in this.data) {
        fn(this.data[prop], index);

        index++;
      }

      return this;
    };

    Valence.struct.Object.prototype.clean = Valence.struct.Object.prototype.empty;

    Valence.struct.Object.prototype.fill = function(data) {

      if(data) {
        for(var prop in data) {
          this.data[prop] = data[prop];
        }
      }

      return this;
    };

    Valence.struct.Object.prototype.truthy = function() {
      return !!Object.keys(this.data).length;
    };

    Valence.struct.Object.prototype.keys = function() {
      var keys = [];

      for(var prop in this.data) {
        keys.push(prop);
      }

      return keys;
    };

    return function(opts) {
      return new Valence.struct.Object(opts);
    };
  });
