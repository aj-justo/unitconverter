/** 
* Converter object.
**/
var Converter = function(){
    // in case this is called without "new"
    if(!this instanceof Converter){
        return new Converter();
    }

    // unique ID for converter instance
    this.id = 'c' + String((Math.random() * 10000000)).substring(0,7);

    // keep track of the latest conversion
    // also used when changing values on UI
    this.last = {
        left: {
            unit: '',
            measurement: 0,
        },
        right: {
            unit: '',
            measurement: 0
        }
    };
};

Converter.prototype = {
    units: {
        length: {
            mm: 1,
            cm: 10,
            m: 1000,
            inch: 25.4,
            foot: 304.8
        },
        weight: {
            gr: 1,
            kg: 1000,
            oz: 28.3495,
            lb: 453.592
        },
        volume: {
            ml: 1,
            cl: 100,
            l: 1000,
            pint: 568.261,
            galon: 4546.09,
            tbsp: 17.7582,
            tsp: 5.91939,
            cup: 284.131
        }
    },

    /**
    * Convert a measurement in one unit to a measurement in another unit.
    **/
    convert: function(unit1, measurement1, unit2, measurement2){
        var that = this;

        // get a list of types of units (length, weight, volume, etc)
        var _getUnitTypes = function(){
            return _.keys(that.units);
        };

        // shortcut method
        var _setLast = function(unit1, measurement1, unit2, measurement2){
            that.last.left.unit = unit1;
            that.last.left.measurement = measurement1;
            that.last.right.unit = unit2;
            that.last.right.measurement = measurement2;
        };

        // see to which unit type the unit corresponds (length/weight/volume)
        // both units have to be of same type
        var types = _getUnitTypes();
        var base = 0, result = NaN;
        _.forEach(types, function(s){
            var units = Converter.getUnitsForType(s);
            if(_.includes(units, unit1)){
                if(!_.includes(units, unit2)){  // if unit2 different type, change it
                    unit2 = units[0];
                }
                if(!measurement1){
                    base = measurement2 * that.units[s][unit2];     
                    result = measurement1 = base / that.units[s][unit1];
                } else{
                    base = measurement1 * that.units[s][unit1];
                    result = measurement2 = base / that.units[s][unit2];
                }
                // keep a record of last conversion
                _setLast(unit1, measurement1, unit2, measurement2);
                return false; // end the iteration
            };    
        });
        return result;
    },

    /**
    * Convert values stored in Converter.last from left to right
    **/
    convertLeftFromLast: function(){
        // if units are not of same type, convert right hand side one to same type
        if(!Converter.compatibleUnits(this.last.left.unit, this.last.right.unit)){
            var type = Converter.getUnitType(this.last.left.unit);
            this.last.right.unit = Converter.getUnits()[type][0];
        }
        return this.convert(this.last.left.unit, this.last.left.measurement, this.last.right.unit, null);
    },

    /**
    * Convert values stored in Converter.last from right to left
    **/
    convertRightFromLast: function(){
        // if units are not of same type, convert left hand side one to same type
        if(!Converter.compatibleUnits(this.last.left.unit, this.last.right.unit)){
            var type = Converter.getUnitType(this.last.right.unit);
            this.last.left.unit = Converter.getUnits()[type][0];
        }
        return this.convert(this.last.left.unit, null, this.last.right.unit, this.last.right.measurement);
    }
};

Converter.getUnits = function(){
    return Converter.prototype.units;
};

Converter.compatibleUnits = function(unit1, unit2){
    var types = _.keys(Converter.getUnits());
    var result = false;
    _.forEach(types, function(s){
        var units = Converter.getUnitsForType(s);
        if(_.includes(units, unit1) && _.includes(units, unit2)){  
            result = true;
            return false;
        }
    });
    return result;
};

Converter.getUnitType = function(unit){
    var foundType = null;
    _.forEach(Converter.getUnits(), function(units, type){
        if(_.includes(_.keys(units), unit)){
            foundType = type;
            return false;
        }        
    });
    return foundType;
};

// Get a list of the units for a given type (volume, weight, length)
Converter.getUnitsForType = function(type){
    var units = Converter.getUnits()[type];
    if(typeof units !== 'undefined'){
        return _.keys(units);
    }
    return [];            
};

