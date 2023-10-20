const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require('dotenv').config()


app.use(cors())
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
      // await client.connect();
    // Send a ping to confirm a successful connection
    const productCollection = client.db("techzenith").collection("products");
    const cartCollection = client.db("techzenith").collection("cart");

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


app.get('/products/:id', async (req, res) => {
  const brand = req.params.id; 
  const query = { brand: brand };
  const products = await productCollection.find(query).toArray();
  res.send(products);
});

app.get('/products/id/:id', async (req, res) => {
  const productId = req.params.id;
  const query = { _id: new ObjectId(productId) };
  const product = await productCollection.findOne(query);
  
  if (product) {
    res.send(product);
  } else {
    res.status(404).send("Product not found");
  }
});

app.put('/products/:id', async (req, res) => {
  const id = req.params.id;
  const product = req.body;
  const filter = { _id: new ObjectId(id) };

  const updateOperation = {
    $set: {
      name: product.name,
      photourl:product.photourl,
      brand: product.brand,
      shortdescription: product.shortdescription,
      rating: product.rating,
      price: product.price,
      avaiablity: product.avaiablity,
    }
  };
  const result = await productCollection.updateOne(filter, updateOperation);
    res.send(result);
});
// cart data
app.post('/cart',async(req,res)=>{
  const cart = req.body;
  console.log('our cart added',cart)
  const result = await cartCollection.insertOne(cart)
  res.send(result)
})

app.get('/cart', async(req,res)=>{
  const cursor = cartCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.delete('/cart/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await cartCollection.deleteOne(query)
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