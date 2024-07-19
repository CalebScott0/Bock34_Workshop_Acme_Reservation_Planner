const {
  client,
  createTables,
  createCustomer,
  fetchCustomers,
  createRestaurant,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation,
} = require("./db");

// function to create database, seed data into tables
const init = async () => {
  await client.connect();
  console.log("Connected to database.");
  await createTables();
  console.log("Tables created.");

  const [bob, fred, carl, fogo, vai, mac] = await Promise.all([
    createCustomer({ name: "Bob" }),
    createCustomer({ name: "Fred" }),
    createCustomer({ name: "Carl" }),
    createRestaurant({ name: "Fogo de Chao" }),
    createRestaurant({ name: "Vai's Steakhouse" }),
    createRestaurant({ name: "Macdonalds" }),
  ]);
  console.log("Customers:", await fetchCustomers());
  console.log("Restaurants:", await fetchRestaurants());

  const [res1, res2] = await Promise.all([
    createReservation({
      date: "07/20/2024",
      party_count: 4,
      restaurant_id: fogo.id,
      customer_id: bob.id,
    }),
    createReservation({
      date: "08/12/2024",
      party_count: 6,
      restaurant_id: vai.id,
      customer_id: fred.id,
    }),
    createReservation({
      date: "08/05/2024",
      party_count: 3,
      restaurant_id: mac.id,
      customer_id: carl.id,
    }),
  ]);
  console.log("Reservations:", await fetchReservations());

  await destroyReservation({ id: res1.id, customer_id: bob.id });
  console.log("Reservations after DELETE:", await fetchReservations());
  await client.end();
  console.log("Data Seeded!");
};
init();
