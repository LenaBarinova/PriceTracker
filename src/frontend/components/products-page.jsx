/* jshint ignore:start */
(function(){
  "use strict";

  let React = require('react');
  let ProductList = require('./product-list');
  let AppStore = require('../stores/app-store');

  let ProductsPage = React.createClass ({

    getInitialState() {
      return {
        products: AppStore.getProducts()
      };
    },

    componentDidMount() {
      AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
      AppStore.removeChangeListener(this._onChange);
    },

    _onChange() {
      this.setState({
        products: AppStore.getProducts()
      });
    },

    render() {
      return (
        <ProductList products = {this.state.products}/>
      );
    }
  });

  module.exports = ProductsPage;

})();
/* jshint ignore:end */