module.exports = function (column, table, col,queried=false) {
    var filter = require('./filter'), sel
    return filter(column, {
        icon: 'bars',
        body: `<div class="form-group">
                    <label for="mst">Filtrar por una opcion</label>
                    <select class="form-control mst" id="mst"></select>
               </div>`,
        shown: function(column, ctx, head) {
            var lastVal = head.data('search')

            let fetch = new Promise((resolve,reject) => {
                if(queried || !dataCols[col]) {
                    var cols = {}
                    column.columns().every(function(){
                        if(this.search()) {
                            cols[this.context[0].aoColumns[this.index()].name] = this.search()
                        }
                    })

                    var last = JSON.stringify(cols)

                    $.ajax({ url: `/distinct?table=${table}&column=${col}&last=${last}`})
                        .done(function( data ) {
                            dataCols[col] = _.map(data, function (d) {return {text:d,id:d}})
                            sel = $('.mst').select2({
                                data: _.map(data, function (d) {return {text:d,id:d}}),
                                allowClear: true,
                                placeholder: 'Seleccionar...',
                                theme: 'bootstrap4'
                            }).on('change', function(){
                                head.data('search', $(this).val());
                            });

                            sel.val(null).trigger('change')

                            resolve()
                        });
                } else {
                    sel = $('.mst').select2({
                        data: dataCols[col],
                        allowClear: true,
                        theme: 'bootstrap4',
                        placeholder: 'Seleccionar...'
                    }).on('change', function(){
                        head.data('search', $(this).val());
                    });

                    resolve()
                }
            })

            fetch.then(() => {
                if(lastVal) {
                    sel.val(lastVal).trigger('change');
                } else {
                    sel.val(null).trigger('change')
                }
            })

        },
        search: function(column, val, type) {
            if (!_.isEmpty(val)) {
                column.search(val, false, false, true).draw();
                return true
            } else {
                return false
            }
        }
    })
}