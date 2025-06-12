import readline from "node:readline/promises";
import connectMongoose from "./lib/connectMongoose.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import "dotenv/config";

const connection = await connectMongoose();
console.log("Connected to MongoDB:", connection.name);

const answer = await ask(
  "Are you sure you want to delete database collections? (n)"
);
if (answer.toLowerCase() !== "y") {
  console.log("Operation aborted.");
  process.exit();
}

await initUsers();
await initProducts();

await connection.close();

async function initUsers() {
  // delete all users
  const result = await User.deleteMany();
  console.log(`Deleted ${result.deletedCount} users.`);

  // create users
  const insertResult = await User.insertMany([
    { email: "admin@example.com", password: await User.hashPassword("1234") },
    { email: "user@example.com", password: await User.hashPassword("1234") },
  ]);
  console.log(`Inserted ${insertResult.length} users.`);
}

async function initProducts() {
  // delete all products
  const result = await Product.deleteMany();
  console.log(`Deleted ${result.deletedCount} products.`);

  const [admin, user] = await Promise.all([
    User.findOne({ email: "admin@example.com" }),
    User.findOne({ email: "user@example.com" }),
  ]);

  // create products
  const insertResult = await Product.insertMany([
    {
      name: "Volkswagen Golf",
      owner: admin._id,
      price: 20000,
      image:
        "https://cdn.autobild.es/sites/navi.axelspringer.es/public/media/image/2024/01/volkswagen-golf-3265600.jpg?tf=1200x",
      tags: ["motor", "lifestyle"],
    },
    {
      name: "Iphone 13",
      owner: admin._id,
      price: 900,
      image: "https://i.blogs.es/5afa41/iphone-13-mini-12-/650_1200.jpg",
      tags: ["mobile", "work"],
    },
    {
      name: "Bosch drill machine",
      owner: user._id,
      price: 150,
      image: "https://m.media-amazon.com/images/I/61T3Nj83OuL.jpg",
      tags: ["work"],
    },
  ]);
  console.log(`Inserted ${insertResult.length} products.`);
}

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const result = await rl.question(question);
  rl.close();
  return result;
}
