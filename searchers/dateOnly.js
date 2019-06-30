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
             var lastVal = head.data('search'),
                 searchType = head.data('search-type'), start = false, end = false,
             options = {
                 timePicker: false,
                 opens: 'left',
                 locale: dateLocale,
                 autoUpdateInput: false
             }

             $('<input id="dtr" class="form-control">').daterangepicker(options).appendTo($(ctx).find('.dtr'))
                 .on('apply.daterangepicker', function(ev, picker) {
                     $(this).val(picker.startDate.format(dateFormatSolo) + ' - ' + picker.endDate.format(dateFormatSolo));

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

             $('<input id="deq" class="form-control">').daterangepicker(options).on('apply.daterangepicker', function(ev, picker) {

                 var val = picker.startDate.format(dateFormatSolo);

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
                 input.val(dtr.startDate.format(dateFormatSolo) + ' - ' + dtr.endDate.format(dateFormatSolo));

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
                     col = column.dataSrc()+'_dsbw';
                     break;
                 case 'equal' :
                     col = column.dataSrc()+'_e';
                     break;
             }

             column.search(col+':'+val, false, false, true).draw();

             return true
         }
     })
}