'use strict';

/***********************************************************************************************************************************************
 * VALENCE DATA
 ***********************************************************************************************************************************************
 * @description
 */
angular.module('valence')
  .service('valence.struct', ['valence.struct.Array', 'valence.struct.Object', 'valence.struct.String', function(Array, Object, String) {
    return {
      Object: Object,
      Array: Array,
      String: String,
      Number: 'Number',
      List: 'List',
      Graph: 'Graph'
    };
  }]);