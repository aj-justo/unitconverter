// dependencies: converter.js

/**
 * Manage a collection of Converter instances.
 * @param defaults: optional, Array of conversion hashes, in the format:
 *     {from: {unit: 'gr', measure: 1}, to: {unit: 'oz'}}
 **/ 
var ConverterCollection = function(defaults){
    // in case this is called without "new"
    if(!this instanceof ConverterCollection){
        return new ConverterCollection();
    }
    var that = this;
    // object to store converters in an easy to retrieve way
    that.convertersIndex = {};
    // array with the same converters to pass to rivets for dom binding
    that.converters = [];

    // default conversions
    that.defaults = [
        {from: {unit: 'pint', measure: 1}, to: {unit: 'ml'}},
        {from: {unit: 'gr', measure: 100}, to: {unit: 'oz'}},
        {from: {unit: 'tbsp', measure: 1}, to: {unit: 'ml'}},
        {from: {unit: 'inch', measure: 2}, to: {unit: 'cm'}}
    ];

    // create default converters
    _.forEach(that.defaults, function(d){
        var c = new Converter();
        c.convert(d.from.unit, d.from.measure, d.to.unit);
        that.convertersIndex[c.id] = c; 
    });
    // also store converters in a simple array that helps when binding to DOM elements
    that.converters = _.values(that.convertersIndex);
};

ConverterCollection.prototype = {
    // add new converter to UI 
    addConverter: function(){
        var c = new Converter();
        // TODO: have more useful defaults instead of repeating first one
        var d = this.defaults[0];
        c.convert(d.from.unit, d.from.measure, d.to.unit);
        this.converters.push(c);
        this.convertersIndex[c.id] = c;
    }
};

