describe("A converter", function() {
    it("contains the units from/to which we can make conversions", function() {
        expect(typeof Converter.getUnits()).toBe('object');
        expect(Converter.getUnits().length.mm).toBe(1);
        expect(Converter.getUnits().length.cm).toBe(10);
        expect(Converter.getUnits().weight.gr).toBe(1);
    });
    
    it("can convert from 1 existing unit to another unit of same type", function() {
        var c = new Converter();
        expect(c.convert('inch', 1, 'mm').toFixed(2)).toBe('25.40');
        expect(c.convert('gr', 100, 'oz').toFixed(2)).toBe('3.53');
        expect(c.convert('tbsp', 1, 'ml').toFixed(2)).toBe('17.76');
    });

    it("can convert last conversion from right to left", function() {
        // use case: user changes an existing conversion by changing unit on right-hand-side
        var c = new Converter();
        expect(c.convert('inch', 1, 'mm').toFixed(2)).toBe('25.40');
        // after we have done that conversion 
        // we can change the unit on the RHS and expect the LHS to update
        c.last.right.unit = 'm';
        c.convertRightFromLast();
        expect(c.last.left.unit).toBe('inch'); // no change 
        // 25.40 meters should have been converted to inches
        expect(c.last.left.measurement.toFixed(2)).toBe('1000.00');
    });

    it("can convert last conversion from left to right", function() {
        var c = new Converter();
        expect(c.convert('inch', 1, 'mm').toFixed(2)).toBe('25.40');
        c.last.left.unit = 'm';
        c.convertLeftFromLast();
        expect(c.last.right.unit).toBe('mm'); // no change 
        expect(c.last.left.unit).toBe('m'); // no change 
        // 1 meters should have been converted to mm
        expect(c.last.right.measurement.toFixed(2)).toBe('1000.00');
    });

});

describe("A converter collection", function() {
    var defaults = [
        {from: {unit: 'inch', measurement: 1}, to: {unit: 'mm'}},
        {from: {unit: 'ml', measurement: 100}, to: {unit: 'tbsp'}}
    ]; 

    it("accepts defaults to create the initial collection", function() {
        var cc = new ConverterCollection(defaults);
        expect(cc.converters.length).toBe(2);
    });

    it("allows to add converters", function() {
        var cc = new ConverterCollection(defaults);
        cc.addConverter();
        expect(cc.converters.length).toBe(3);
    });
});