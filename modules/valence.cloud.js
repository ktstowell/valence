'use strict';

/***********************************************************************************************************************************************
 * VALENCE CLOUD
 ***********************************************************************************************************************************************
 * @description
 */

angular.module('valence')
  .service('valence.cloud', ['$http', function($http) {
    // TODO: all of these functions can be consolidated.
    return {
      get: function(specs) {
        var opts = {method: 'GET'};

        for(var spec in specs) {
          opts[spec] = specs[spec];
        }

        return $http(opts);
      },
      put: function(specs) {
        var opts = {method: 'PUT'};

        for(var spec in specs) {
          opts[spec] = specs[spec];
        }

        return $http(opts);
      },
      post: function(specs) {
        var opts = {method: 'POST'};

        for(var spec in specs) {
          opts[spec] = specs[spec];
        }

        return $http(opts);
      },
      delete: function(specs) {
        var opts = {method: 'DELETE'};

        for(var spec in specs) {
          opts[spec] = specs[spec];
        }

        return $http(opts);
      }
    };
  }]);