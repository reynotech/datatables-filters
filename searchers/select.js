module.exports = function (column, options) {
    var filter = require('./filter')
    return filter(column, {
        icon: 'bars',
        body: `<div class="form-group">
                         <label for="mst">Filtrar por uno o varias opciones</label>
                         <select class="form-control mst" id="mst" multiple></select>
                   </div>`,
        shown: function(column, ctx, head) {
            var lastVal = head.data('search'),
                searchType = head.data('search-type');

            var sel = $('.mst').select2({
                data: options,
                allowClear: true,
                placeholder: 'Seleccionar...',
                theme: 'bootstrap4'
            }).on('change', function(){
                head.data('search', $(this).val());
                head.data('search-type', 'in');
            });

            if(searchType === 'in') {
                sel.val(lastVal).trigger('change');
            }

        },
        search: function(column, val, type) {
            var col
            switch (type) {
                case 'in' :
                    col = column.dataSrc()+'_in';
                    val = val.join(',');
                    break;
                case 'equal' :
                    col = column.dataSrc()+'_e';
                    break;
            }

            column.search(col+':'+val, false, false, true).draw();
        }
    })
}