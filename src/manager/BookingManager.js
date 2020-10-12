const redisManager = require('./RedisManager'),
shortid = require('shortid');

class BookingManager {

    constructor()
    {

    }

    async bookCab(option)
    {
        try {
            let cabDetails = await this.searchCab(option);
            let bookingId = shortid.generate();
            let bookingDetails = {
                start_lat: option.start_lat,
                start_long: option.start_long,
                end_lat: option.end_lat,
                end_long: option.end_long,
                cabId: cabDetails.cab
            };
            let save = await redisManager.storeData(bookingId,bookingDetails);
            let vehicle_list = await redisManager.getData('vehicles');
            delete vehicle_list[cabDetails.cab];
            await redisManager.storeData('vehicles',vehicle_list);
            return {bookingId: bookingId};
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async searchCab(option)
    {
        try {
            let vehicle_details = await redisManager.getData('vehicles');
            if(Object.keys(vehicle_details).length == 0)
            {
                let errorMessage = new Error("No cab available");
                    errorMessage.code = 400;
                throw errorMessage;
            }
            option.vehicles = vehicle_details;
            let fetchCab = await this.getCab(option);
            if(fetchCab.cab.length < 1)
            {
                let errorMessage = new Error("No cab available");
                    errorMessage.code = 400;
                throw errorMessage;
            }
            return fetchCab;
        } catch (error) {
            throw error;
        }
    }

    async getCab(option)
    {
        try {
            let result = {};
            let min_distance = 0;
            let cab = '';
            for(let key in option.vehicles )
            {
                let details = await redisManager.getData(key);
                if(option.type == details.type)
                {
                    let distanceQuery = {
                        start_lat: option.start_lat,
                        start_long: option.start_long,
                        end_lat: details.lat,
                        end_long: details.lng
                    }
                    let distance = this.calculateDistance(distanceQuery);
                    console.log(distance);
                    if(min_distance > distance)
                    {
                        min_distance = distance;
                    }
                    console.log(min_distance);
                    if(min_distance == distance)
                    {
                        cab = key;
                    }
                }
            }
            result.distance = min_distance;
            result.cab = cab;
            return result;
        } catch (error) {
            throw error;
        }
    }

    async completeTrip(option)
    {
        try {
            let booking = await redisManager.getData(option.bookingId);
            if(!booking)
            {
                let errorMessage = new Error("Invalid booking id");
                    errorMessage.code = 400;
                throw errorMessage;
            }
            let distance = this.calculateDistance(booking);
            console.log('distance',distance);
            let cab = await redisManager.getData(booking.cabId);
            console.log('cab',cab);
            let price = this.priceCalculator({distance: distance,type: cab.type});
            await redisManager.removeData(option.bookingId);
            cab.lat = booking.end_lat;
            cab.lng = booking.end_long;
            await redisManager.storeData(booking.cabId,cab);
            return {price:price};
        } catch (error) {
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    calculateDistance(option)
    {
        let d_eqw = (option.end_long - option.start_long)* Math.cos(option.start_lat);
        let d_ns = (option.end_lat - option.start_lat);
        let calculate = Math.sqrt(d_eqw * d_eqw + d_ns * d_ns);
        return Math.round(calculate);
    }

    priceCalculator(option)
    {
        let pricePerMinute = option.distance * 1;
        let pricePerKm = option.distance * 2;
        let totalPrice = pricePerKm + pricePerMinute;
        if(option.type == 'pink')
        {
            totalPrice = totalPrice + 5;
        }
        return totalPrice;
    }

}
module.exports = new BookingManager();