/* jshint ignore:start */
(function(){
  "use strict";

  let React = require('react');
  let AppStore = require('../stores/app-store');
  let StoreComponent = require('./store-component');

  let ProductListItem = React.createClass ({

    handleClick: function(i, event) {
      var card = $(event.target).closest('.card-container');
      if(card.hasClass('hover')){
          card.removeClass('hover');
      } else {
          card.addClass('hover');
      }
    },

    render() {
      return (
        <div className="col-md-3 col-sm-6 col-xs-10" key={this.props.name}>
          <div className="card-container manual-flip">
            <div className="card">

              <div className="front">
                <div className="content">
                  <img className="img-responsive" src={this.props.imageUrl} alt={this.props.name}/>
                  <h5> {this.props.name} </h5>
                  <hr/>
                  <StoreComponent product_stores={this.props.product_stores} cheapest={true} key={this.props.name}/>
                </div>
                <div className="footer">
                  <button className="btn btn-simple" onClick={this.handleClick.bind(this, null)}>
                    <i className="fa fa-list-ol"></i> Price list
                  </button>
                </div>
              </div>

              <div className="back">
                <div className="content">
                  <h5> {this.props.name} </h5>
                  <hr/>
                  <StoreComponent product_stores={this.props.product_stores} cheapest={false} key={this.props.name}/>
                </div>
                <div className="footer">
                  <button className="btn btn-simple" onClick={this.handleClick.bind(this, null)}>
                    <i className="fa fa-chevron-left"></i> Back
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    }
  });

  module.exports = ProductListItem;

})();
/* jshint ignore:end */