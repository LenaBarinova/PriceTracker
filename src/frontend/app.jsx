/* jshint ignore:start */
(function(){
  "use strict";

  let React = require('react');
  let ReactDOM = require('react-dom');
  let Categories = require('./components/categories-list');
  let Products = require('./components/products-page');
  let InitializeActions = require('./actions/initialize-actions');

  InitializeActions.initApp();
  /*
  ReactDOM.render(
    <Categories />,
    document.getElementById('categories')
  );
  */
  ReactDOM.render(
    <Products/>,
    document.getElementById('products')
  );

  })();
  /* jshint ignore:end */