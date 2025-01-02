const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8ggzn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const menuCollention = client.db("bistroDb").collection("menu");
    const reviewCollention = client.db("bistroDb").collection("reviews");
    const cartCollention = client.db("bistroDb").collection("carts");

    // get all menu data
    app.get("/menu", async (req, res) => {
      const result = await menuCollention.find().toArray();
      res.send(result);
    });

    // get all reviews data
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollention.find().toArray();
      res.send(result);
    });

    //get user specific data from cartCollection
    app.get('/carts', async(req, res)=>{
      const email = req.query.email
      const query = {email: email}
      const result = await cartCollention.find(query).toArray()
      res.send(result)
    })
    // post cart item to database
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollention.insertOne(cartItem);
      res.send(result);
    });

    // delete cart item
    app.delete('/carts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollention.deleteOne(query)
      res.send(result)
    })


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
  res.send("server running");
});

app.listen(port, (req, res) => {
  console.log("Bistro boss running on port: ", port);
});
