module.exports = function(col, dateCols) {
    col.api().columns().every(function () {
        var column = this;
        if ($.inArray(this.dataSrc(), dateCols) != -1) {
            dateSearch(column);
        } else if(this.dataSrc() == 'action') { }
        else {
            textSearch(column);
        }
    });
};