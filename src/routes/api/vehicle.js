const vehicleManager = require('../../manager/VehicleManager');

module.exports = (app) => {

    app.get('/api/v1/vehicle',
    async (req,res,next)=>{
        try {
            let vehicle = await vehicleManager.getAllVehicle();
            return res.status(200).json({"data":vehicle})
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
    });

    app.post('/api/v1/vehicle',
    async (req,res,next)=>{
        try {
            let body = req.body;
            let vehicle = await vehicleManager.saveVehicle(body);
            return res.status(201).json({"data":vehicle})
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
    });
}