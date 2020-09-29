const redis = require("redis");

class RedisManager {

    constructor()
    {
        try {
            this.client = redis.createClient();
            this.client.on("connect", function() {
                console.log("You are now connected");
            });
            this.client.on("error", function(error) {
                console.error(error);
                throw error
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async storeData(key,value)
    {
        try {
            this.client.set(key,JSON.stringify(value));
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getData(key)
    {
        let that = this;
        return new Promise((resolve, reject)=>{
            that.client.get(key,(err,result)=>{
                if(err)
                {
                    console.error('err',err);
                    reject(err);
                } else {
                    console.log('result',result);
                    resolve(JSON.parse(result));
                }
            })
        });
    }

    async removeData(key)
    {
        try {
            this.client.del(key);
            return true;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new RedisManager();