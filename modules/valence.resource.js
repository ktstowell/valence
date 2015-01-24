'use strict';

/***********************************************************************************************************************************************
 * VALENCE RESOURCE
 ***********************************************************************************************************************************************
 * @description
 */
angular.module('valence')
  .service('valence.resource', ['valence.cloud', 'valence.struct', 'valence.events', 'valence.console', 'valence.data', '$q', function(ValenceCloud, ValenceStruct, ValenceEvents, ValenceConsole, ValenceData, $q) {

    var resources = ValenceStruct.Object();
    var Valence = {};


    //
    // PRIVATE HELPERS
    //------------------------------------------------------------------------------------------//
    // @description
    Valence.flushResource = function() {
      var flush = (this.__instance__.strategy && this.__instance__.data[this.__instance__.strategy.flush]);

      if(flush) {
        this.__instance__.data[this.__instance__.strategy.flush]();
        this.data = this.__instance__.data.data;
        this.propagate(ValenceEvents.resource.cleared);
      }
    };

    //
    // RESOURCE
    //------------------------------------------------------------------------------------------//
    // @description
    Valence.Resource = function(name, model) {
      var self = this;
      var obj = {};
          obj[model.name] = model;

      //
      // INSTANCE MEMBERS
      //------------------------------------------------------------------------------------------//
      // @description
      this.__instance__ = {
        models: ValenceStruct.Object(),
        endpoints: ValenceStruct.Object(),
        resources: ValenceStruct.Object(),
        options: {
          cache: true,
          forceload: false,
          reload: false,
          autotype: false
        },
        loaded: false,
        type: Object,
        data: null,
        events: ValenceEvents
      };

      // Don't judge me, I see you, Forest.
      this.__instance__.structs = {};
      this.__instance__.structs[Object] = 'Object';
      this.__instance__.structs[Array] = 'Array';
      this.__instance__.structs[String] = 'String';

      // Create a named map to this instance for
      // working with object structs
      this.__instance__.reference = {};
      this.__instance__.reference[this.name] = this;

      //
      // PUBLIC MEMBERS
      //------------------------------------------------------------------------------------------//
      // @description
      this.name = name;
      this.models = this.__instance__.models.data;
      this.endpoints = this.__instance__.endpoints.data;
      this.resources = this.__instance__.resources.data;

      //
      // INIT TASKS
      //------------------------------------------------------------------------------------------//
      // @description

      // Add resource reference
      resources.add(this.__instance__.reference);
      // Add resource to models
      this.__instance__.models.add(obj);
      // Update the console.
      ValenceConsole.resource(this);

      //
      // EVENTS
      //------------------------------------------------------------------------------------------//
      // @description
      this.__instance__.models.forEach(function(model) {
        model.on(self.__instance__.events.resources.flush, function(model) {
          Valence.flushResource.call(self, model);
        });
      });

      return this;
    };

    //
    // RESOURCE API
    //------------------------------------------------------------------------------------------//
    // @description

    /**
     * LOAD
     *
     * @description Loads a model, typically used after creation. Aliased by get - this ignores caching due to semantics.
     * @returns {*}
     */
    Valence.Resource.prototype.load = function() {
      var self = this;
      var promise = ValenceCloud.get(this.endpoints.get);

      promise.success(function(resource) {
        if(self.__instance__.options.autotype && self.__instance__.type !== resource.constructor) {
          self.__instance__.type = resource.constructor;
          self.__instance__.data = ValenceStruct[self.__instance__.structs[self.__instance__.type]](self.__instance__.options);
          self.__instance__.strategy = ValenceData[self.__instance__.structs[self.__instance__.type]];
        }

        if(self.__instance__.options.autofill !== false) {
          return self.__instance__.data[self.__instance__.strategy.fill](resource, self.__instance__.options);
        }
      });

      // Autofill short circuit - use has option to trigger this via call of set.
      if(self.__instance__.options.autofill === false) { return promise; }

      promise.then(function() {
        // Refresh public pointer -- need to isolate if this is hurting angular, maybe case for primitives.
        self.data = self.__instance__.data.data;
        self.propagate(self.__instance__.events.resource.loaded);
      }).then(function() {
        self.__instance__.loaded = true;
      });

      promise.error(function() {
        self.propagate(self.__instance__.events.resource.error);
      });

      return promise;
    };

    /**
     * SET
     *
     * @description Adds data to a resource that isn't reliant on HTTP
     * @param data
     */
    Valence.Resource.prototype.set = function(data) {
      this.__instance__.data[this.__instance__.strategy.create](data, this.__instance__.options);
      // refresh public pointer - stupid primitives
      this.data = this.__instance__.data.data;
      // mark as loaded
      this.__instance__.loaded = true;
      // Notify
      this.propagate(this.__instance__.events.resource.loaded);
    };

    /**
     * NORMALIZE
     *
     * @param data
     */
    Valence.Resource.prototype.normalize = function(data) {
      // Store original data;
      this.__instance__.pristine = angular.copy(this.__instance__.data.data);
      // Fill normalized data to __instance__
      this.__instance__.data[this.__instance__.strategy.flush](data, this.__instance__.options)[this.__instance__.data[this.__instance__.strategy.fill](data, this.__instance__.options)];
      // refresh public pointer - stupid primitives
      this.data = this.__instance__.data.data;
      // mark as loaded
      this.__instance__.loaded = true;
      // Notify
      this.propagate(this.__instance__.events.resource.loaded);
    };

    /**
     * ADD
     *
     * @description Is used to add a resource to this resource
     * @param name
     * @param model
     */
    Valence.Resource.prototype.add = function() {

    };

    /**
     * CREATE
     *
     * @description Ingests config and options for resource behavior
     * @param specs
     * @returns {Valence.Resource}
     */
    Valence.Resource.prototype.create = function(specs) {
      var self = this;
      var methods = ['get', 'put', 'post', 'delete'];
      var endpoints = specs.endpoints;

      for(var opt in specs.options) {
        this.__instance__.options[opt] = specs.options[opt];
      }

      this.__instance__.type = specs.type || this.__instance__.type;
      this.__instance__.data = ValenceStruct[this.__instance__.structs[this.__instance__.type]](this.__instance__.options);
      this.__instance__.strategy = ValenceData[this.__instance__.structs[this.__instance__.type]];
      this.__instance__.url = this.__instance__.url || specs.url;

      methods.forEach(function(method) {
        var obj = {};
            obj[method] = {url: (endpoints && endpoints[method]? endpoints[method].url : self.__instance__.url)};

        self.__instance__.endpoints.add(obj);
      });

      // Set public data pointer.
      this.data = this.__instance__.data.data;

      return this;
    };

    /**
     * UPDATE
     *
     * @description essentially re-runs create with new config.
     * @type {create}
     */
    Valence.Resource.prototype.update = Valence.Resource.prototype.create;

    /**
     * DESTROY
     *
     * @destroys a resource
     * @param specs
     */
    Valence.Resource.prototype.destroy = function() {
      resources.remove(this.name);
    };

    /**
     * PROPAGATE
     *
     * @description Notifies all concerned models with specific events
     * @param event
     */
    Valence.Resource.prototype.propagate = function(event) {
      var self = this;

      this.__instance__.models.forEach(function(model) {
        model.emit(event, self);
      });
    };

    //
    // RESOURCE REST
    //------------------------------------------------------------------------------------------//
    // @description

    /**
     * GET
     *
     * @param options
     * @returns {*}
     */
    Valence.Resource.prototype.get = function(options) {
      options = options || {};

      var def = $q.defer();

      if(this.__instance__.options.cache && this.__instance__.data[this.__instance__.strategy.truthy]()) {
        def.resolve(this.data);
      } else {
        return this.load(options);
      }

      return def.promise;
    };

    /**
     * PUT
     *
     * @param data
     * @param options
     * @returns {*}
     */
    Valence.Resource.prototype.put = function(data, options) {
      options = options || {};

      var self = this;
      var specs = {data: data, url: this.endpoints.put.url};

      return ValenceCloud.put(specs).success(function() {
        // we can't always guarantee that the endpoint actually returns the data that was sent to update,
        // but if the response is 20*, we can assume the update was successful and that we can
        // update our resource with the data that was originally provided to be sent to the server.
        if(self.__instance__.options.reload) {
          return self.load();
        } else {
          self.__instance__.data[self.__instance__.strategy.create](data);
        }
      }).error(function() {
        // handle errors
      });
    };

    /**
     * POST
     *
     * @param data
     * @param options
     * @returns {*}
     */
    Valence.Resource.prototype.post = function(data, options) {
      options = options || {};

      var self = this;
      var obj = {url: this.endpoints.post.url, data:data};

      return ValenceCloud.post(obj).success(function(data) {
        if(self.__instance__.options.reload) {
          return self.load(options);
        } else {
          console.log(obj);
          self.__instance__.data[self.__instance__.strategy.create](data);
        }
      }).error(function() {

      });
    };

    /**
     * DELETE
     *
     * @param data
     * @param options
     * @returns {*}
     */
    Valence.Resource.prototype.delete = function(data, options) {
      options = options || {};

      var self = this;
      var obj = {url: this.endpoints.delete.url, data:data};

      return ValenceCloud.delete(obj).success(function(data) {
        if(options.reload !== false && self.__instance__.options.reload) {
          return self.load();
        } else {
          self.__instance__.data[self.__instance__.strategy.delete](data);
        }
      }).error(function() {

      });
    };

    //
    // INSTANCE CREATION
    //------------------------------------------------------------------------------------------//
    // @description
    return function(name, model) {
      return resources.find(name, {single: true}) || new Valence.Resource(name, model);
    };
  }]);
