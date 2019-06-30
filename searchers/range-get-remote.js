module.exports = function (column, table, col, queried=false, order='asc') {
    var values = {from:null, to: null, equal: null}, from = null , to = null

    var filter = require('./filter')
    return filter(column, {
        icon: 'exchange',
        body: `<div class="form-group">
                        <label for="mst">Filtrar por rango de valores</label>
                        <div class="row">
                            <div class="col">
                                <div class="ld loading">
                                    <select type="text" class="form-control from" placeholder="De"></select>
                                </div>
                            </div>
                            <div class="col">
                                <div class="ld loading">
                                    <select type="text" class="form-control to" placeholder="A"></select>
                                </div>
                            </div>
                        </div>
                        <label for="">Filtrar por valor especifico</label>
                        <input type="text" class="form-control equal">
                   </div>`,
        shown: function(column, ctx, head) {

            var loading = function(load=true) {
                let el = $(ctx).find('.ld')
                if(load) {
                    el.addClass('loading')
                } else {
                    el.removeClass('loading')
                }
            }

            $(ctx).find('.equal').on('change', function(){
                values.equal = $(this).val()
            })

            var con = {
                allowClear: true,
                placeholder: 'Seleccionar...',
                theme: 'bootstrap4'
            }

            var init = function() {
                from = $(ctx).find('.from').select2(con).on('change', function() {values.from = $(this).val()})
                to = $(ctx).find('.to').select2(con).on('change', function() {values.to = $(this).val()})
            }, setValues = function(fr, t) {
                console.log(from,to);
                from.val(fr).trigger('change')
                to.val(t).trigger('change')
            }

            let fetch = new Promise((resolve,reject) => {
                if(queried || !dataCols[col]) {
                    var cols = {}
                    column.columns().every(function(){
                        if(this.search()) {
                            cols[this.context[0].aoColumns[this.index()].name] = this.search()
                        }
                    })

                    var last = JSON.stringify(cols)

                    console.log(col)

                    $.ajax({ url: `/distinct?table=${table}&column=${col}&order=${order}&last=${last}`})
                        .done(function( data ) {
                            dataCols[col] = _.map(data, function (d) {return {text:d,id:d}})

                            con.data = dataCols[col]

                            init()
                            setValues(null, null)

                            resolve()
                        });
                } else {
                    con.data = dataCols[col]

                    init()

                    resolve()
                }
            })

            fetch.then(() => {
                loading(false)
                var s = column.search()

                if(s != '') {
                    if(s.includes(column.dataSrc()+'_e:')) {
                        setValues(null, null)
                        values.equal = s.replace(column.dataSrc()+'_e:','')
                        $('.equal').val(values.equal)
                    } else {
                        var sss = s.replace(column.dataSrc()+'_bw:','').split(',')
                        values.from = sss[0]
                        values.to = sss[1]
                        setValues(sss[0], sss[1])
                    }
                } else {
                    if(from != null || to != null) {
                        setValues(null, null)
                        $('.equal').val('')
                    }
                }
            })
        },
        search: function(column, val, type) {
            var what;
            var vfr = values.from,
                vto = values.to,
                veq = values.equal


            if(vfr != null || vto != null || veq != null) {

                if (vfr != null && vto != null) {
                    what = column.dataSrc() + '_bw'
                    val = `${vfr},${vto}`
                } else {
                    what = column.dataSrc() + '_e'
                    val = veq
                }

                column.search(what + ':' + val, false, false, true).draw()

                return true
            } else { return false }
        },
        cancelled: function() {
            values = {from:null, to: null, equal: null}
        }
    })
}