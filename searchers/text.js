module.exports = function (column) {
    $(`<input class="form-control ts" data-col="${column.index()}">`)
        .prependTo(
            $(column.footer()).html('<div class="input-group"></div>').find('.input-group')
        )
        .on('change', function () {
            var val = $(this).val(), that = $(this);

            column.search($(this).val(), false, false, true).draw();

            if(val.length !== 0 || val.trim()) {
                if($(`.r-c-f[data-i=${column.index()}]`).length == 0) {
                    $(`<div class="input-group-append">
                         <button class="btn btn-danger r-c-f" data-i="${column.index()}">&times;</button>
                       </div>`)
                    .on('click', function() {
                            that.val('');
                            column.search('').draw();
                            $(this).remove();
                        }
                    )
                    .appendTo($(column.footer()).find('div'));
                }
            }
        });
}