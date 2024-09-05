
const fs = require('fs');
const { faker } = require('@faker-js/faker');

// Store generated data
const users = [];
const addresses = [];
const accounts = [];
const categories = [];
const products = [];
const orders = [];
const order_items = [];
const carts = [];
const cart_items = [];

// Initialize counters for serial IDs
let addressIdCounter = 1;
let categoryIdCounter = 1;
let orderItemIdCounter = 1;
let cartItemIdCounter = 1;

// Helper function to generate UUIDs
const generateUUID = () => faker.string.uuid();

// Generate Users and Addresses
for (let i = 0; i < 10; i++) {
  const userId = generateUUID();
  const addressId = generateUUID();
  const user = {
    id: userId,
    name: faker.person.firstName(),
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
    password_hash: faker.internet.password(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
  users.push(user);

  const address = {
    id: addressId,
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip_code: faker.location.zipCode(),
    user_id: userId,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
  addresses.push(address);
}

// Generate Categories and Products
for (let i = 0; i < 9; i++) {
  const categoryId = faker.number.int({ min: 1, max: 100 });
  const category = {
    id: categoryId,
    name: faker.commerce.department(),
    description: faker.commerce.productDescription(),
  };
  categories.push(category);

  for (let j = 0; j < 10; j++) {
    const productId = generateUUID();
    const product = {
      id: productId,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({min: 35, max: 999}),
      stock: faker.number.int({ min: 1, max: 100 }),
      category_id: categoryId,
      accordion: [
        {
          question: "Information",
          answer: faker.lorem.lines({ min: 2, max: 4 })
        },
        {
          question: faker.lorem.words({ min: 3, max: 5 }),
          answer: faker.lorem.sentences({ min: 1, max: 3 })
        },
        {
          question: faker.lorem.words({ min: 3, max: 5 }),
          answer: faker.lorem.sentences({ min: 1, max: 3 })
        }
      ],
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    };
    products.push(product);
  }
}

// Helper function to generate fake order items and calculate total price
function createFakeOrderItems(orderId) {
  const itemId = generateUUID();
  const numberOfOrderItems = faker.number.int({ min: 1, max: 5 });
  let totalPrice = 0;
  const items = [];

  for (let i = 0; i < numberOfOrderItems; i++) {
    const product = faker.helpers.arrayElement(products);
    const quantity = faker.number.int({ min: 1, max: 5 });
    const price = product.price * quantity;
    totalPrice += price;

    items.push({
      id: itemId,
      order_id: orderId,
      product_id: product.id,
      quantity: quantity,
      price: price,
    });
  }

  return { items, totalPrice };
}

// Generate Orders and Order Items
for (let i = 0; i < 10; i++) {
  const userId = faker.helpers.arrayElement(users).id;
  const orderId = generateUUID();
  const { items, totalPrice } = createFakeOrderItems(orderId);

  const order = {
    id: orderId,
    user_id: userId,
    status: faker.helpers.arrayElement(['pending', 'paid', 'done', 'customer_canceled']),
    total: totalPrice,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
  orders.push(order);
  order_items.push(...items);
}

// Generate Carts and Cart Items
for (let i = 0; i < 5; i++) {
  const userId = faker.helpers.arrayElement(users).id;
  const cartId = generateUUID();

  const cart = {
    id: cartId,
    user_id: userId,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
  carts.push(cart);

  for (let j = 0; j < 5; j++) {
    const product = faker.helpers.arrayElement(products);
    const quantity = faker.number.int({ min: 1, max: 10 });

    const cartItem = {
      id: cartItemIdCounter++,
      cart_id: cartId,
      product_id: product.id,
      quantity: quantity,
      added_at: faker.date.recent(),
    };
    cart_items.push(cartItem);
  }
}

// Generate Accounts
for (let i = 0; i < 10; i++) {
  const userId = faker.helpers.arrayElement(users).id;
  const accountId = generateUUID();
  const account = {
    id: accountId,
    user_id: userId,
    type: faker.helpers.arrayElement(['user', 'admin']),
    provider: faker.company.name(),
    provider_account_id: faker.string.uuid(),
    refresh_token: faker.internet.password(),
    access_token: faker.internet.password(),
    expires_at: faker.date.future(),
    token_type: faker.string.nanoid(),
    scope: faker.string.alpha(10),
    id_token: faker.internet.password(),
    session_state: faker.string.alpha(10),
  };
  accounts.push(account);
}

// Output generated data
console.log("Users:", users.length);
console.log("Addresses:", addresses.length);
console.log("Accounts:", accounts.length);
console.log("Categories:", categories.length);
console.log("Products:", products.length);
console.log("Orders:", orders.length);
console.log("Order Items:", order_items.length);
console.log("Carts:", carts.length);
console.log("Cart Items:", cart_items.length);

console.log("Printed data to console,Staring to write to JSON file");


// Write generated data to JSON files
fs.writeFileSync('../generatedData/fakeData4.json', JSON.stringify({users, addresses, accounts, categories, products,orders, order_items, carts, cart_items}, null, 2), (err) => {
  if (err) {
    console.error(err);
  }
  console.log('Data written to fakeData.json');
});

