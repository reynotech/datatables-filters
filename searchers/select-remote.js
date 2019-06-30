module.exports = function (column, options) {
    // todo remember last values
    options = _.merge({
        title: 'Filtrar',
        allowClear: true,
        placeholder: 'Seleccionar...',
        theme: 'bootstrap4',
        multiple: true
    }, options)

    var filter = require('./filter')
    return filter(column, {
        icon: 'bars',
        body: `<div class="form-group">
                        <label>Filtrar por uno o varias opciones</label>
                        <select class="form-control mst"></select>
                   </div>`,
        shown: function(column, ctx, head) {
            var lastVal = head.data('search'),
                searchType = head.data('search-type');

            var sel = $('.mst').select2(options).on('change', function(){
                head.data('search', $(this).val());
                head.data('search-type', 'in');
            });

            if(searchType === 'in') {
                sel.val(lastVal).trigger('change');
            }
        },
        search: function(column, val, type) {
            var col

            if (!_.isEmpty(val)) {

                switch (type) {
                    case 'in' :
                        col = column.dataSrc() + '_in';
                        val = val.join(',');
                        break;
                    case 'equal' :
                        col = column.dataSrc() + '_e';
                        break;
                }

                column.search(col + ':' + val, false, false, true).draw();

                return true
            } else {
                return false
            }
        }
    })
}