'use strict';

/***********************************************************************************************************************************************
 * VALENCE MODEL
 ***********************************************************************************************************************************************
 * @description
 */

angular.module('valence')
  .service('valence.model', ['valence.struct', 'valence.resource', 'valence.events', 'valence.console', '$timeout', function(struct, resource, ValenceEvents, _console, $timeout) {

    var Valence = {};

    Valence.Model = function(name, options) {
      var self = this;

      //
      // INSTANCE MEMBERS
      //------------------------------------------------------------------------------------------//
      // @description
      this.__instance__ = {
        options: options,
        resources: struct.Object(),
        data: struct.Object(),
        errors: struct.Array(),
        loaded: {
          min: 400,
          last: 0
        },
        events: ValenceEvents
      };

      //
      // PUBLIC MEMBERS
      //------------------------------------------------------------------------------------------//
      // @description

      this.name = name;
      this.data = self.__instance__.data.data;
      this.errors = self.__instance__.errors.data;
      this.resources = this.__instance__.resources.data;

      //
      // EVENTS
      //------------------------------------------------------------------------------------------//
      // @description

      // Resource loaded
      this.on(ValenceEvents.resource.loaded, function(resource) {
        var obj = {};
            obj[resource.name] = resource.data;

        self.__instance__.data.add(obj);
        self.statuses.resources.call(self);
      });

      // Resource loaded
      this.on(ValenceEvents.resource.error, function(resource) {
        var obj = {};
            obj[resource.name] = resource.data;

        self.__instance__.data.add(obj);
        self.statuses.resources.call(self);
      });

      // Resource updated
      this.on(ValenceEvents.resource.updated, function(resource) {
        var obj = {};
        obj[resource.name] = resource.data;

        self.__instance__.data.add(obj);
      });

      // Resource flushed
      this.on(ValenceEvents.resource.cleared, function(resource) {
        self.__instance__.data.remove(resource.name);
      });

      //
      // INIT OPS
      //------------------------------------------------------------------------------------------//
      // @description
      _console.model(this);

      return this;
    };

    //
    // RESOURCE MANAGEMENT
    //------------------------------------------------------------------------------------------//
    // @description

    Valence.Model.prototype.resource = function(name) {
      var res = resource(name, this);
      var obj = {};
          obj[res.name] = res;

      this.__instance__.resources.add(obj);

      return res;
    };

    Valence.Model.prototype.flush = function() {
      var self = this;

      this.emit(self.__instance__.events.resources.flush, self);
    };

    //
    // MODEL EVENT HUB
    //------------------------------------------------------------------------------------------//
    // @description

    /**
     * ON
     *
     * @param name
     * @param fn
     * @returns {Valence.Model}
     */
    Valence.Model.prototype.on = function(name, fn) {
      if(!this.__instance__.events[name]) {
        this.__instance__.events[name] = [];
      }

      this.__instance__.events[name].push(fn);

      return this;
    };

    /**
     * EMIT
     *
     * @param name
     * @param data
     * @returns {Valence.Model}
     */
    Valence.Model.prototype.emit = function(name, data) {
      if(!this.__instance__.events[name]) { return; }

      this.__instance__.events[name].forEach(function(event) {
        event(data);
      });

      return this;
    };

    //
    // MODEL STATUSES
    //------------------------------------------------------------------------------------------//
    // @description

    Valence.Model.prototype.statuses = {
      resources: function() {
        var self = this;
        var allLoaded = true;

        // TODO: approach race condition w/o use of timeout
        $timeout(function() {
          self.__instance__.resources.forEach(function(resource) {
            if(!resource.__instance__.loaded && !resource.__instance__.options.forceload) {
              allLoaded = false;
            }
          });

          if(allLoaded && (Date.now() - self.__instance__.loaded.last > self.__instance__.loaded.min)) {
            self.__instance__.loaded.last = Date.now();
            self.emit(ValenceEvents.resources.loaded, self.data);
          }
        }, 0);
      }
    };

    //
    // SERVICE RETURN
    //------------------------------------------------------------------------------------------//
    // @description Opens a new model instance.
    return function(name, options) {
      return new Valence.Model(name, options);
    };
  }]);
