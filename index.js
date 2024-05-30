const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5100;

// Middleware
app.use(cors({ origin: "https://pikstack.vercel.app", credentials: true }));
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.PIKSTACK}:${process.env.DB_PASS}@cluster0.az94fyn.mongodb.net/?retryWrites=true&w=majority`;

// Function to create MongoDB client connection
async function createConnection() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client;
}

// Handle favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Routes
app.post("/additem", async (req, res) => {
  const client = await createConnection();
  const database = client.db("Pikstack");
  const pikstackCollection = database.collection("pikstackItemCollection");

  try {
    const addedItem = req.body;
    const result = await pikstackCollection.insertOne(addedItem);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to add item" });
  } finally {
    await client.close();
  }
});

app.get("/allitem", async (req, res) => {
  const client = await createConnection();
  const database = client.db("Pikstack");
  const pikstackCollection = database.collection("pikstackItemCollection");

  try {
    const result = await pikstackCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch items" });
  } finally {
    await client.close();
  }
});

app.get("/assets/:id", async (req, res) => {
  const client = await createConnection();
  const database = client.db("Pikstack");
  const pikstackCollection = database.collection("pikstackItemCollection");

  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await pikstackCollection.findOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch item by id" });
  } finally {
    await client.close();
  }
});

app.delete("/assets/:id", async (req, res) => {
  const client = await createConnection();
  const database = client.db("Pikstack");
  const pikstackCollection = database.collection("pikstackItemCollection");

  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await pikstackCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete item by id" });
  } finally {
    await client.close();
  }
});

app.get("/", (req, res) => {
  res.send("Hello Pikstack");
});

app.listen(port, () => {
  console.log(`Pikstack running on port ${port}`);
});
