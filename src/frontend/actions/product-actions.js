(function(){
  "use strict";

  let Dispatcher = require('../dispatcher/dispatcher');
  let ActionTypes = require('../constants/action-types');

  let ProductActions = {

    updateProducts(products) {
      Dispatcher.dispatch({
        actionType: ActionTypes.PRODUCTS_LOADED,
        data: {
          products: products
        }
      });
    }

  };

  module.exports = ProductActions;

})();