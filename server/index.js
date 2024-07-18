const {
  client,
  createTables,
  createCustomer,
  fetchCustomers,
  createRestaurant,
  fetchRestaurants,
} = require("./db");

// function to create database, seed data into tables
const init = async () => {
  await client.connect();
  console.log("Connected to database.");
  await createTables();
  console.log("Tables created.");

  const [bob, fred, carl] = await Promise.all([
    createCustomer({ name: "Bob" }),
    createCustomer({ name: "Fred" }),
    createCustomer({ name: "Carl" }),
    createRestaurant({ name: "Fogo de Chao" }),
    createRestaurant({ name: "Vai's Steakhouse" }),
    createRestaurant({ name: "Macdonalds" }),
  ]);
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());
};
init();
