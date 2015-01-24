'use strict';


/***********************************************************************************************************************************************
 * VALENCE - DATA
 ***********************************************************************************************************************************************
 * @description Data Strategies Layer
 */
angular.module('valence')
  .service('valence.data', function() {
    var Strategies = {};

    Strategies.String = { create: 'set', read: 'get', update: 'set', delete: 'delete', fill: 'set', truthy: 'truthy', flush: 'delete'};
    Strategies.Object = { create: 'add', read: 'find', update: 'add', delete: 'remove', fill: 'fill', truthy: 'truthy', flush: 'empty'};
    Strategies.Array = { create: 'add', read: 'find', update: 'add', delete: 'remove', fill: 'fill', truthy: 'truthy', flush: 'empty'};

    return Strategies;
  });