(function(){
  "use strict";

  let Dispatcher = require('../dispatcher/dispatcher');
  let ActionTypes = require('../constants/action-types');
  let Api = require('../api/api');

  let InitializeActions = {

    initApp() {
      let products = Api.getProducts();
      Dispatcher.dispatch({
        actionType: ActionTypes.INITIALIZE,
        data: {
          products: products
        }
      });
    }
  };

  module.exports = InitializeActions;

})();