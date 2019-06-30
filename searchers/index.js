module.exports = {
    textSearch : require('./searchers/text'),
    dateSearch : require('./searchers/date'),
    dateOnlySearch : require('./searchers/dateOnly'),
    selectSearch : require('./searchers/select'),
    selectSearchRemoteFind : require('./searchers/select-get-remote'),
    selectRemoteSearch : require('./searchers/select-remote'),
    rangeSearch : require('./searchers/range'),
    rangeSearchRemoteSelect : require('./searchers/range-get-remote')
}