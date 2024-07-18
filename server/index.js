// API File
const express = require("express");
const {
  client,
  createReservation,
  destroyReservation,
  fetchCustomers,
  fetchReservations,
  fetchRestaurants,
} = require("./db");

// create express server
const server = express();
// connect to db pg client
client.connect();
// middleware
server.use(express.json());

// routes
// returns array of customers
server.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});
// returns array of restaurants
server.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error);
  }
});
// returns array of reservations
server.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    next(error);
  }
});
/* payload: an object which has a valid restaurant_id, date, and party_count.
returns the created reservation with a status code of 201 */
server.post(
  "/api/customers/:customer_id/reservations",
  async (req, res, next) => {
    try {
      const { customer_id } = req.params;
      res
        .status(201)
        .send(await createReservation({ ...req.body, customer_id }));
    } catch (error) {
      next(error);
    }
  }
);
/* - the id of the reservation to delete and 
the customer_id is passed in the URL, returns nothing with a status code of 204 */
server.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      const { customer_id, id } = req.params;
      await destroyReservation({ customer_id, id });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);
// error handling route which returns an object with an error property.
server.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});

// have server listen on port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
