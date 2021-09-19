# Scalapay Engineer Test

This web app uses React (with Material UI) for the frontend, and Node.js for the backend.

## Installation

Run 'npm install' in ./backend to setup the backend project.

## Running

Start the backend by running 'npm run server' in ./backend. This will launch a server on localhost:8123, expecting POST request at the /order endpoint.

Start the frontend by running 'npm start' in ./frontend. This will build and launch a React project that will be accessible at localhost:3000.

## Tests

The backend is covered by 2 Jest test suites. One covers the order validation the backend does before sending the order request to the Scalapay endpoint; the second covers making the request to the Scalapay endpoint and handling errors from that request.

Run the tests by running 'npm run test' in ./backend.

## Notes

The core of this web app is validating the order before making the request to the Scalapay endpoint.

Validation is performed by restricting inputs in the frontend, and validating the order in the backend. If the order is invalid, a set of errors is reported back. If it is valid, it is passed onto the Scalapay endpoint.

This approach:

- Reduces the complexity around making the order request to the Scalapay endpoint. If an order makes it to the Scalapay endpoint, it *should* result in a succcesful order. If it doesn't, we store the order and error in ValidationErrors.json (would be a DB in production) for debugging.
- Increases the snappiness of error reporting to the frontend user, who doesn't need to wait for the result of second HTTP request to the Scalapay endpoint.


#### Mark Havryliv 19 Sep 2021