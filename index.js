const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require('dotenv').config()


app.use(cors())
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.sopxnju.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const productCollection = client.db("techzenith").collection("products");

app.post('/products',async(req,res)=>{
  const product = req.body;
  console.log(product)
  const result = await productCollection.insertOne(product)
  res.send(result)
});

app.get('/products',async(req,res)=>{
  
const cursor = productCollection.find()
const result = await cursor.toArray()
res.send(result)
})


app.get('/products/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {brand: id}
  const products = productCollection.find(query)
  const result = await products.toArray()
  res.send(result)
})


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('server is running')
})

app.listen(port, ()=> {
    console.log(`App is running on port ${port}`)
})