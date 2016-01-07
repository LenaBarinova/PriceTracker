/* jshint ignore:start */
(function(){
  "use strict";

  let React = require('react');
  let ProductListItem = require('./product-list-item');

  let ProductList = React.createClass ({
    render() {
      let productComponents;

      if (this.props.products) {
        productComponents = this.props.products.map(function(product) {
          return (
            <ProductListItem name={product.name} product_stores={product.stores} imageUrl={product.imageUrl} key={product.name}/>
          );
        });
      }
      else {
        productComponents = <div />;
      }
      return (
        <div className="container">
          <div className="row">
            {productComponents}
          </div>
        </div>
      );
    }
  });

  module.exports = ProductList;
})();
/* jshint ignore:end */