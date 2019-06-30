module.exports = function (column, options) {
    var filter = require('./filter')
    return filter(column, {
        icon: '',
        body: `<div class="form-group">
                        <label for="mst">Filtrar por rango de valores</label>
                        <div class="row">
                            <div class="col">
                                <input type="text" class="form-control val-from" placeholder="De" name="valfrom">
                            </div>
                            <div class="col">
                                <input type="text" class="form-control val-to" placeholder="A" name="valto">
                            </div>
                        </div>
                        <label for="">Filtrar por valor especifico</label>
                        <input type="text" class="form-control val-equal" name="equal">
                   </div>`,
        shown: function(column, ctx, head) {
            var lastVal = head.data('search'),
                searchType = head.data('search-type'),
                s = column.search()

            if(s.includes(column.dataSrc()+'_e:')) {
                $('.val-equal').val(s.replace(column.dataSrc()+'_e:',''))
            } else {
                var sss = s.replace(column.dataSrc()+'_bw:','').split(',')
                $('.val-from').val(sss[0])
                $('.val-to').val(sss[1])
            }
        },
        search: function(column, val, type) {
            var col;

            var vfr = $('.val-from').val(),
                vto = $('.val-to').val(),
                veq = $('.val-equal').val()

            if(vfr != '' || vto != '' || veq != '') {

                if (vfr != '' && vto != '') {
                    col = column.dataSrc() + '_bw';
                    val = `${vfr},${vto}`
                } else {
                    col = column.dataSrc() + '_e';
                    val = veq
                }

                column.search(col + ':' + val, false, false, true).draw();

                return true
            } else {
                return false
            }
        }
    })
}