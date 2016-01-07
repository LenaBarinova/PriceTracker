/* jshint ignore:start */
(function(){
  "use strict";

  let React = require('react');
  let AppStore = require('../stores/app-store');
  let _ = require('lodash');

  let StoreItem = React.createClass({
    
    render() {

      let divName = "price";
      let iconName = "fa fa-caret";

      if (this.props.store.priceChangeNumeric < 0) {
        divName += "-down";
        iconName += "-down";
      } else if (this.props.store.priceChangeNumeric > 0) {
        divName += "-up";
        iconName += "-up";
      }
      let storeClass = "store store-" + this.props.store.name.toLowerCase();
      return (

        <li className="media">
          <div className="media-left media-middle">
            <a href={this.props.store.url} target="_blank">
              <i className={storeClass}></i>
            </a>
          </div>
          <div className="media-body media-middle">
            <h4 className="media-heading">${this.props.store.latestPrice.amount}</h4><span className={divName}>{this.props.store.priceChangePercentage}% <i className={iconName}></i></span>
          </div>
        </li>
    )}
  });

  let StoreComponent = React.createClass({
    render() {

      let storesToShow =[];
      if (this.props.cheapest) {
        storesToShow.push(this.props.product_stores[0]);
      } else {
        storesToShow = this.props.product_stores;
      }
      let storeItems = storesToShow.map(function(store) {
        return (
          <StoreItem store={store} key={store.name}/>
        );
      });
      return (
        <ul className="media list" key={this.props.key}>
          {storeItems}
        </ul>
      );
    }

  });

  module.exports = StoreComponent;

})();
/* jshint ignore:end */