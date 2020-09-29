# CabFleet

CabFleet

## Installation

```bash
npm install
npm start
```

## Usage
To store vehicle lists in redis here is the api

```
api/v1/vehicle
Method: POST
required body
[{
  "name": "cab1",
  "type": "normal",
  "lat": "20.270276",
  "lng": "85.8376925"
}]
```
To search and book a cab

```
api/v1/cab/booking
Method: POST
required body
  "start_lat": "20.270276",
   "start_long": "85.8376925",
   "end_lat": "20.239173",
   "end_long": "85.828814",
   "type": "pink"
```

To completed trip

```
api/v1/cab/booking/:bookingId/completed
Method: POST
```

## License
[MIT](https://choosealicense.com/licenses/mit/)