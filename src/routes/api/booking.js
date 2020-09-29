const { check, validationResult } = require('express-validator'),
bookingManager = require('../../manager/BookingManager');

module.exports = (app) => {

    app.post('/api/v1/cab/booking',[
        check('start_lat','current location lat is required').notEmpty(),
        check('start_long','current location long is required').notEmpty(),
        check('end_lat','current location lat is required').notEmpty(),
        check('end_long','current location lat is required').notEmpty(),
    ],
    (req,res,next)=>{
        
        const errors = validationResult(req); 
        if (!errors.isEmpty()) { 
            return res.status(403).json(errors) 
        }
        next();
    },
    async (req,res,next)=>{
        try {
            let query = {
                start_lat: req.body.start_lat,
                start_long: req.body.start_long,
                end_lat: req.body.end_lat,
                end_long: req.body.end_long,
                type: req.body.type
            }
            let booking = await bookingManager.bookCab(query);
            return res.status(200).json({"data":booking})
        } catch (error) {
            console.error(error);
            return res.status(error.code).json({"error":error.message});
        }
    });

    app.post('/api/v1/cab/booking/:bookingId/completed',
    async (req, res,next)=>{
        try {
            let query = {
                bookingId: req.params.bookingId
            }
            let booking = await bookingManager.completeTrip(query);
            return res.status(200).json({"data":booking})
        } catch (error) {
            return res.status(error.code).json({"error":error.message});
        }
    });
}