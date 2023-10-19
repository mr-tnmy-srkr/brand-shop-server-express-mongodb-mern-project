const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@brandshopcluster.dpvzthu.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();

    const brandCollection = client.db("brandDB").collection("brands");
    const productCollection = client.db("productDB").collection("products");

    //find all multiple brands
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });
    // post/insert new single products

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      // console.log(result);
      res.send(result);
    });

    // find multiple product by brand name
    app.get("/product/:brandName", async (req, res) => {
      const brand_name = req.params.brandName;
      console.log(brand_name);
      const query = { brand: brand_name };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    // find single product by id for update product
    app.get("/product/updateProduct/:brandName/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
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
  res.send("Brand shop server is running");
});

app.listen(port, () => {
  console.log(`Brand shop server is listening on port ${port}`);
});
