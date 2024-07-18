// Data layer
const pg = require("pg");
const uuid = require("uuid");

// create pg client with created acme_reservation_db database
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservation_db"
);

// drop child table first (table w/foreign keys)
const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS customers;

    CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE restaurants(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE reservations(
        id UUID PRIMARY KEY,
        reservation_date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
    );
  `;

  await client.query(SQL);
};
// creates customer and returns only the created record
const createCustomer = async ({ name }) => {
  const SQL = `
        INSERT INTO customers(id, name) 
        VALUES($1, $2) RETURNING *;
    `;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};
// returns an array of customers in the database
const fetchCustomers = async () => {
  const SQL = `
    SELECT * from CUSTOMERS;
  `;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};
// creates restaurant and returns only the created record
const createRestaurant = async ({ name }) => {
  const SQL = `
        INSERT INTO restaurants(id, name) 
        VALUES($1, $2) RETURNING *;
    `;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};
// returns an array of restaurants in the database
const fetchRestaurants = async () => {
  const SQL = `
        SELECT * FROM restaurants;
    `;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

module.exports = {
  client,
  createTables,
  createCustomer,
  fetchCustomers,
  createRestaurant,
  fetchRestaurants,
};
