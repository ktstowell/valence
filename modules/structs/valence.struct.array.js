'use strict';

/***********************************************************************************************************************************************
 * VALENCE ARRAY
 ***********************************************************************************************************************************************
 * @description
 */
angular.module('valence')
  .service('valence.struct.Array', function() {

    // Instance holder.
    var Valence = {struct: {}};
    //
    // CONSTRUCTOR
    //------------------------------------------------------------------------------------------//
    // @description
    Valence.struct.Array = function(opts) {

      // talk about a better naming system to
      // keep API simple but avoid collisions in help functions.
      this.data = this._data = [];

      this.defaults = {
        flatten: false,
        allowDupes: true, // if false, strict equality is performed
        unique: false // takes an {*:*} object with wildcard support, if matched, itm isn't added.
      };

      this.options = angular.copy(opts, this.defaults);

      return this;
    };

    //
    // HELPERS
    //------------------------------------------------------------------------------------------//
    // @description Resuable helpers

    Valence.empty = function() {
      this._data.length = 0;
      return this;
    };

    //
    // PROTOTYPE
    //------------------------------------------------------------------------------------------//
    // @description
    Valence.struct.Array.prototype = {
      /**
       * ADD
       *
       * @description Adds content of dynamic types to the instance data while resepcting options.
       * @param data
       * @returns {Valence.struct.Array}
       */
      add: function(data, options) {
        var self = this,
          cell = -1;

        var unique = (options && options.unique)? options.unique : this.options.unique;
        var flatten = (options && options.flatten)? options.flatten : this.options.flatten;

        if(this.options.allowDupes === false) {
          this._data.forEach(function(itm, idx) {
            try {
              if(JSON.stringify(itm) === JSON.stringify(data)) {
                cell = idx;
              }
            } catch(e) {
              if(itm === data) {
                cell = idx;
              }
            }
          });

          if(cell < 0) {
            this._data.push(data);
          }
        } else if(unique) {

          if(unique.constructor === Object && (data.constructor === Object || (data.constructor !== Array && typeof data === 'object'))) {
            self.data.forEach(function(itm, idx) {
              if(itm.constructor === Object || Object.keys(itm).length) {
                for(var key1 in itm) {
                  for(var key2 in data) {
                    for(var key3 in unique) {
                      if(key3 === '*' || (key1 === key2 && key2 === key3)) {
                        if((unique[key3] === '*' && itm[key1] === data[key2]) || (unique[key3] === data[key2]) || JSON.stringify(itm[key1]) === JSON.stringify(data[key2])) {
                          cell = idx;
                        }
                      }
                    }
                  }
                }
              }
            });

            if(cell === -1) {
              this.data.push(data);
            }
          }
        } else if(flatten) {
          if(data.constructor === Array) {
            data.forEach(function(itm) {
              self.data.push(itm);
            });
          } else {
            this.data.push(data);
          }
        } else {
          this._data.push(data);
        }

        return this;
      },
      /**
       * UPDATE
       *
       * @description Updates content within the instance data based on query.
       * @param query
       * @param data
       * @returns {Valence.struct.Array}
       */
      update: function(query, data) {
        var self = this;

        self._data.forEach(function(itm, idx) {
          if(query.constructor !== Object && query.constructor !== Array) {
            if(itm === query) {
              self._data[idx] = data;
            }
          }

          if(query.constructor === Object) {
            var keys = Object.keys(query);
            if(itm.constructor === Object) {
              var matched = 0;
              keys.forEach(function(key) {
                if(query[key] === itm[key]) {
                  matched++;
                }
              });

              if(keys.length === matched) {
                for(var prop in data) {
                  itm[prop] = data[prop];
                }
              }
            }
          }

          if(query.constructor === Array) {
            if(JSON.stringify(itm) === JSON.stringify(query)) {
              // This will change sub reference, too complicated for
              // now.
              itm = data;
            }
          }
        });

        return this;
      },
      /**
       * REMOVE
       *
       * @description Removes the matched content from the instance data.
       * @param data
       * @returns {Valence.struct.Array}
       */
      remove: function(data) {
        var self = this;

        self._data.forEach(function(itm, idx) {
          if(JSON.stringify(itm) === JSON.stringify(data)) {
            self._data.splice(idx, 1);
          }
        });
        return this;
      },
      /**
       * EMPTY
       *
       * @description Empties the instance data while preserving reference.
       * @returns {Valence.struct.Array}
       */
      empty: function() {
        return Valence.empty.call(this);
      },
      /**
       * CLEAN
       *
       * @description Semantic alias for empty.
       */
      clean: function() {
        return Valence.empty.call(this);
      },
      /**
       * FILL
       *
       * @description Fills the instance data with provided data.
       * @param data
       * @returns {Valence.struct.Array}
       */
      fill: function(data) {
        var self = this;

        if(!data || (data.constructor !== Array && data.constructor !== NodeList)) { return this; }

        for(var i=0; i<data.length; i++) {
          self.add(data[i]);
        }

        return this;
      },
      /**
       * FIND
       *
       * @description Evaluates a callback and returns the cell if true.
       * @param predicate
       * @returns {*}
       */
      find: function(predicate) {
        var result;

        for (var i = 0; i < this._data.length; i++) {
          if (predicate(this._data[i])) {
            result = this._data[i];
            break;
          }
        }

        return result;
      },
      /**
       * CONTAINS
       *
       * @description Returns if equality is truthy.
       * @param searchElement
       * @returns {boolean}
       */
      contains: function(searchElement) {
        var length = this._data.length;
        if (!length) { return false; }

        var result = false;

        for (var i = 0; i < this._data.length; i++) {
          if (angular.equals(searchElement, this._data[i])) {
            result = true;
            break;
          }
        }

        return result;
      },
      /**
       * FOR EACH
       *
       * @description forEach alias for the instance data.
       * @param fn
       * @returns {Valence.struct.Array}
       */
      forEach: function(fn) {
        if(!this.data) { return this; }

        this.data.forEach(function(itm, idx) {
          fn(itm, idx);
        });

        return this;
      },
      truthy: function() {
        return !!this.data.length;
      }
    };

    return function(opts) {
      return new Valence.struct.Array(opts);
    };
  });
