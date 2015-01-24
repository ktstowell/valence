'use strict';

/***********************************************************************************************************************************************
 * VALENCE EVENTS
 ***********************************************************************************************************************************************
 * @description
 */

angular.module('valence')
  .service('valence.events', function() {
    return {
      resource: {
        loaded: 'resource.loaded',
        updated: 'resource.updated',
        cleared: 'resource.cleared'
      },
      resources: {
        loaded: 'resources.loaded',
        flush: 'resources.flush'
      }
    };
  });
