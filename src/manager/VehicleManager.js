const redisManager = require('./RedisManager');

class VehicleManager {

    constructor()
    {

    }

    async saveVehicle(data)
    {
        try {
            let store = {};
            console.log(data);
            for(let item in data)
            {
                let object = {
                    type: data[item].type,
                    lat: data[item].lat,
                    lng: data[item].lng
                };
                await redisManager.storeData(data[item].name,object);
                store[data[item].name] = data[item].type;
            }
            await redisManager.storeData('vehicles',store);
            return true
        } catch (error) {
            console.error(error);
            let errorMessage = new Error(error.message);
                errorMessage.code = (error.code) ? error.code : 400;
            throw errorMessage;
        }
    }

    async getAllVehicle()
    {
        try {
            let vehicle = {
                'cab1': "normal",
                'cab2': "pink",
                "cab3": "normal"
            }
            client.set("cab1",JSON.stringify(vehicle));
            client.get("cab1",(err,result)=>{
                console.log(result);
            })
            
        } catch (error) {
            console.error(error);
        }
    }
}
module.exports = new VehicleManager();
