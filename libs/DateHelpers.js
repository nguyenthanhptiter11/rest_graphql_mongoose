const dateToISOString = d => {

    return d ? new Date(d).toISOString() : null
}

module.exports = {
    dateToISOString: dateToISOString
}