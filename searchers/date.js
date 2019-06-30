module.exports = function (column) {
    var filter = require('./filter')
    return filter(column, {
        icon: 'calendar',
        body: `<div class="form-group">
                        <label for="dtr">Filtrar por Rango de Fechas</label>
                        <div class="dtr"></div>
                   </div>
                    <div class="form-group">
                        <label for="dtr">Filtrar por Fecha en Especifico</label>
                        <div class="deq"></div>
                    </div>`,
        shown: function(column, ctx, head) {
            var lastVal = column.search(),
                searchType = head.data('search-type'), start = false, end = false,
                options = {
                    singleDatePicker: true,
                    showDropdowns: true,
                    timePicker: true,
                    locale: dateLocale,
                    autoUpdateInput: false
                }

            var range = $('<input id="dtr" class="form-control">')

            if(lastVal) {
                if(lastVal.includes(column.dataSrc()+'_dbw:')) {
                    range.val(lastVal.replace(column.dataSrc()+'_dbw:',''))
                }
            }

            range.daterangepicker(options).appendTo($(ctx).find('.dtr'))
                .on('apply.daterangepicker', function(ev, picker) {
                    $(this).val(picker.startDate.format(dateFormat) + ' - ' + picker.endDate.format(dateFormat));
                    var val = $(this).val();

                    if (val) {
                        head.data('search', val);
                        head.data('search-type', 'range');
                    }
                })
                .on('cancel.daterangepicker', function(){
                    $(this).val('');

                    head.data('search', '');
                    head.data('search-type', '');
                });

            var equal = $('<input id="deq" class="form-control">')

            equal.daterangepicker(options).on('apply.daterangepicker', function(ev, picker) {

                var val = picker.startDate.format(dateFormat);

                $('input#deq').val(val);

                if (val) {
                    head.data('search', val);
                    head.data('search-type', 'equal');
                }
            }).on('cancel.daterangepicker', function(){
                $(this).val('');

                head.data('search', '');
                head.data('search-type', '');
            }).appendTo($(ctx).find('.deq'));

            if(searchType === 'range') {
                var dates = lastVal.split(' - '), input = $('input#dtr'), dtr = input.data('daterangepicker');

                dtr.setStartDate(dates[0]);
                dtr.setEndDate(dates[1]);
                input.val(dtr.startDate.format(dateFormat) + ' - ' + dtr.endDate.format(dateFormat));
            } else if (searchType === 'equal') {
                var input = $('input#deq'), dtr = input.data('daterangepicker');
                dtr.setStartDate(lastVal);
                dtr.setEndDate(lastVal);
                input.val(lastVal);
            }
        },
        search: function(column, val, type) {
            var col;
            switch (type) {
                case 'range' :
                    col = column.dataSrc()+'_dbw';
                    break;
                case 'equal' :
                    col = column.dataSrc()+'_e';
                    break;
            }
            column.search(col+':'+val, false, false, true).draw();

            return true;
        }
    })
}