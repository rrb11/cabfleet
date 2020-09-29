module.exports = (app) => {
    require('./api/booking')(app);
    require('./api/vehicle')(app);
}