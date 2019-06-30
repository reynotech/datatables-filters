module.exports = function (column, options) {

    var head = $(column.header()),
        remove = function(col) {
            if($('.r-c-f[data-i='+col+']').length) {
                $('.r-c-f[data-i='+col+']').remove();
            }
        }
    options = _.merge({
        title: "Filtrar " + head.text(),
        button: `<button class="btn btn-info w-100"><i class="fa fa-${options.icon}"></i> Filtrar</button>`,
        body: ``,
        cancelled: function() {}
    }, options)

    $(options.button)
        .on('click', function(){
        showBSModal({
            title: options.title,
            body: options.body,
            onShow: function() {
                options.shown(column, this, head)
            },
            actions: [{
                label: 'Cancelar',
                cssClass: 'btn-danger',
                onClick: function(e){
                    head.data('search', '');
                    head.data('search-type', '');

                    column.search('').draw();

                    $(e.target).parents('.modal').modal('hide');

                    remove(column.index())
                    options.cancelled(column);
                }
            },{
                label: 'Buscar',
                cssClass: 'btn-success',
                onClick: function(e){
                    var val = head.data('search'), type = head.data('search-type');
                    if (options.search(column, val, type)) {
                        if(!$(`.r-c-f[data-i=${column.index()}]`).length) {
                            $(`<button class="btn btn-danger r-c-f w-20" data-i="${column.index()}">&times;</button>`).on('click', function () {
                                head.data('search', '');
                                head.data('search-type', '');

                                column.search('').draw();
                                $(this).remove();
                                options.cancelled(column);
                            }).appendTo($(column.footer()).find('div'));
                        }

                    } else {
                        column.search('').draw();
                        remove(column.index())
                    }

                    $(e.target).parents('.modal').modal('hide');
                }
            }],
        });
    })
    .appendTo(
        $(column.footer())
            .html('<div class="btn-group d-flex" role="group"></div>')
            .find('div')
    );
}
/*

    var filter = require('./filter')
     return filter(column, {
         icon: '',
         body: ``,
         shown: function(column, ctx, head) {},
         search: function(column, val, type) {}
     })

 */