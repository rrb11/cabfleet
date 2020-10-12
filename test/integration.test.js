const chai = require('chai'),
chaiHttp = require('chai-http'),
i18n = require('i18n');

const app = require('../src/app');
chai.use(chaiHttp);
const { expect } = chai;

let bookingId_1, bookingId_2;

describe('Cab booking process',()=>{
    if('It should add all the cab list',async()=>{
        const data= [
            {
                "name": "cab1",
                "type": "normal",
                "lat": "20.2713554",
                "lng": "85.8333893"
            },
            {
                "name": "cab2",
                "type": "pink",
                "lat": "21.2713554",
                "lng": "84.8333893"
            },
            {
                "name": "cab3",
                "type": "normal",
                "lat": "20.2713554",
                "lng": "85.8333893"
            }
        ]
        const response = await chai.request(app).post('/api/v1/user/create').send(data);
        expect(response).to.have.status(403);
    });

    it("User should able to book the cab", async()=>{
        const data = {
            "start_lat": "20.270276",
            "start_long": "85.8376925",
            "end_lat": "20.239173",
            "end_long": "85.828814",
        };
        const response = await chai.request(app).post('/api/v1/cab/booking').send(data);
        bookingId_1 = response.body.data.bookingId;
        expect(response).to.have.status(200);
        expect(response.body.data).to.have.property('bookingId').to.be.a('string');
    });

    it("User should able complete the booking", async()=>{
        const response = await chai.request(app).post('/api/v1/cab/booking/'+bookingId_1+'/completed').send(data);
        expect(response).to.have.status(200);
        expect(response.body.data).to.have.property('price').to.be.a('number');
    });

    it("User should able to book pink cab", async()=>{
        const data = {
            "start_lat": "20.270276",
            "start_long": "85.8376925",
            "end_lat": "20.239173",
            "end_long": "85.828814",
            "type": "pink"
        };
        const response = await chai.request(app).post('/api/v1/cab/booking').send(data);
        bookingId_2 = response.body.data.bookingId;
        expect(response).to.have.status(200);
        expect(response.body.data).to.have.property('bookingId').to.be.a('string');
    });
    it("It should throw error if pink cab is not available", async()=>{
        const data = {
            "start_lat": "20.270276",
            "start_long": "85.8376925",
            "end_lat": "20.239173",
            "end_long": "85.828814",
            "type": "pink"
        };
        const response = await chai.request(app).post('/api/v1/cab/booking').send(data);
        expect(response).to.have.status(400);
    });
});