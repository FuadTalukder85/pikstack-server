const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5100;

//middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

//

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.PIKSTACK}:${process.env.DB_PASS}@cluster0.az94fyn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("Pikstack");
    const pikstackCollection = database.collection("pikstackItemCollection");

    // Add assets
    app.post("/additem", async (req, res) => {
      const addedItem = req.body;
      const result = await pikstackCollection.insertOne(addedItem);
      res.send(result);
    });

    // Get assets
    app.get("/allitem", async (req, res) => {
      const result = await pikstackCollection.find().toArray();
      res.send(result);
    });

    // Get assets by id
    app.get("/assets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await pikstackCollection.findOne(query);
      res.send(result);
    });

    // Delete assets by id
    app.delete("/assets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await pikstackCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Pikstack");
});

app.listen(port, () => {
  console.log(`Pikstack running on port ${port}`);
});
