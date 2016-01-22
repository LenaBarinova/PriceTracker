/* jshint ignore:start */
"use strict";

require('./dom-mock')('<html><body></body></html>');

var jsdom = require('mocha-jsdom');
var assert = require('assert');
var expect = require('chai').expect;

var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');

var ProductList = require('../../../src/frontend/components/product-list');

describe('Testing products list', function() {
  jsdom({ skipWindowCheck: true });

  var _products = {};

  before(() => {

    _products = [{
      user: 'test',
      slug: "arcteryx-beta-ar-jacket-mens-phoenix-medium",
      name: "Arc'teryx Beta AR Jacket Men's Phoenix Medium",
      stores: [
        {
          name: "Amazon",
          latestPrice: { amount: 12, currency: 'USD' },
          initialPrice: { amount: 14, currency: 'USD' }
        },
        {
          name: "Levis",
          latestPrice: { amount: 13, currency: 'USD' },
          initialPrice: { amount: 11, currency: 'USD' }
        },
        {
          name: "Backcountry",
          latestPrice: { amount: 130.7, currency: 'USD' },
          initialPrice: { amount: 130.7, currency: 'USD' }
        },
        {
          name: "REI",
          initialPrice: { amount: 14, currency: 'USD' }
        },
        {
          name: "CampSaver",
          latestPrice: { amount: 100, currency: 'USD' }
        },
        {
          name: "Nordstorm"
        }]
    },
    {
      user: 'test',
      slug: "arcteryx-beta-ar-jacket-womens-iceberg-xsmall",
      name: "Arc'teryx Beta AR Jacket Women's Iceberg XSmall",
      stores: [
        {
          name: "Amazon",
          latestPrice: { amount: 12, currency: 'USD' },
          initialPrice: { amount: 14, currency: 'USD' }
        },
        {
          name: "Levis",
          latestPrice: { amount: 13, currency: 'USD' },
          initialPrice: { amount: 11, currency: 'USD' }
        },
        {
          name: "Backcountry",
          latestPrice: { amount: 130.7, currency: 'USD' },
          initialPrice: { amount: 130.7, currency: 'USD' }
        },
        {
          name: "REI",
          initialPrice: { amount: 14, currency: 'USD' }
        },
        {
          name: "CampSaver",
          latestPrice: { amount: 100, currency: 'USD' }
        },
        {
          name: "Nordstorm"
        }]
    }
    ];

  });

  it('renders two cards when two products given', function() {

    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<ProductList products = {_products} />);
    const renderedTree = renderer.getRenderOutput();

    expect(renderedTree.props.children.props.children).to.have.length(2);
  });

  it('renders empty div when no products given', function() {

    const renderer = ReactTestUtils.createRenderer();
    renderer.render(<ProductList products = {null} />);
    const renderedTree = renderer.getRenderOutput();

    expect(renderedTree.props.children.props.children.props).to.be.empty;
  });
});
/* jshint ignore:start */