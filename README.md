
# Fetch Rewards Take Home Project

## Installation

* `git clone https://github.com/tonynguyen98/fetch-rewards` 
* `npm install`

## Running / Development

* `node app.js`
* Visit the web server at [http://localhost:3000](http://localhost:3000).

## Testing
1.  Make these POST requests to `localhost:3000/add_transaction` with the following JSON body via Postman.
	* `{  "payer":  "DANNON",  "points":  1000,  "timestamp":  "2020-11-02T14:00:00Z"  }`
	* `{  "payer":  "UNILEVER",  "points":  200,  "timestamp":  "2020-10-31T11:00:00Z"  }`
	* `{  "payer":  "DANNON",  "points":  -200,  "timestamp":  "2020-10-31T15:00:00Z"  }`
	* `{  "payer":  "MILLER COORS",  "points":  10000,  "timestamp":  "2020-11-01T14:00:00Z"  }`
	* `{  "payer":  "DANNON",  "points":  300,  "timestamp":  "2020-10-31T10:00:00Z"  }`
* You should get a response `201 Created` with a body of `Added transaction.`
2.  Make a POST request to `localhost:3000/spend` with the following JSON body via Postman.
	* `{ "points":  5000 }`
* You should get a response of `200 OK` with a body of `[{"payer":"DANNON","points":-100},{"payer":"UNILEVER","points":-200},{"payer":"MILLER COORS","points":-4700}]`
3. Make a GET request to `localhost:3000/balances` via Postman.
* You should get a response of `200 OK` with a body of `{"DANNON":1000,"UNILEVER":0,"MILLER COORS":5300}`
