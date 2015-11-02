;(function(){
    // things we need to do once DOM is ready
    $(function(){
        var cc = new ConverterCollection();

        // an array of unit types and their units to show to the user to change unit
        var unitTypes = [];
        _.map(Converter.getUnits(), function(v, type){
            var units = _.keys(v);
            unitTypes.push({name: type, values: units});
        });

        // two-way binding to dom
        rivets.bind($('#main'), {converters: cc.converters});
        rivets.bind($('#unitsModal'), {unitTypes: unitTypes});

        // update conversions when user enters new number
        $(document).on('input', 'input', function(){                
            var converterId = $(this).parents('section').data('id');
            var side = $(this).data('side');
            // we need to do the operations the other way around when changing right-hand-side input
            if(side === 'left'){
                cc.convertersIndex[converterId].convertLeftFromLast();
            } else {
                cc.convertersIndex[converterId].convertRightFromLast();
            }
        });

        // on clicking on unit button, set data attrs on modal 
        $(document).on('click tap', '.converterUnitSelector', function(){
            var converterId = $(this).parents('section').data('id');
            var side = $(this).data('side');
            // set the attributes on the modal
            $('#unitsModal').data('converterId', converterId);
            $('#unitsModal').data('side', side);
        });

        $('#reset').click(function(){
            window.location.reload();
        });

        $('#addConverter').click(function(){
            cc.addConverter();
        });

        // on user changing unit on modal
        $('#unitsModal').on('click tap', '.btn-unit', function(e){
            e.preventDefault();
            var $modal = $('#unitsModal');
            var converterId = $modal.data('converterId');
            var side = $modal.data('side');
            // TODO: use methods instead of accessing members, 
            // like: getConverter(id), setLast(side, unit, measure)
            cc.convertersIndex[converterId].last[side].unit = $(this).text();
            if(side === 'left'){
                cc.convertersIndex[converterId].convertLeftFromLast();
            } else {
                cc.convertersIndex[converterId].convertRightFromLast();
            }
            $modal.modal('hide');
        });
    });
})();

/**** rivets formatters ****/
// format a measurement 
rivets.formatters.measurement = function(value) {  
    // use commas to separate thousands etc
    var intcomma = function(value) {
        var origValue = String(value);
        var newValue = origValue.replace(/^(-?\d+)(\d{3})/, '$1,$2');
        if (origValue == newValue){
            return newValue;
        } else {
            return intcomma(newValue);
        }
    };   

    // is n a float?
    var isFloat = function(n){
        return n === Number(n) && n % 1 !== 0;
    };   

    if(isFloat(value)){
        value = parseFloat(value).toFixed(2); 
    }
    // this is incompatible with type=number
    // value = intcomma(Number(value));
    return value;
};

// filters to decide whether a unit belongs to a type or another (length, volume, etc)
rivets.formatters.isWeight = function(value){
    var weightUnits = _.keys(Converter.getUnits()['weight']);
    return _.contains(weightUnits, value);
}

rivets.formatters.isLength = function(value){
    var lengthUnits = _.keys(Converter.getUnits()['length']);
    return _.contains(lengthUnits, value); 
};

rivets.formatters.isVolume = function(value){
    var volumeUnits = _.keys(Converter.getUnits()['volume']);
    return _.contains(volumeUnits, value);
};

