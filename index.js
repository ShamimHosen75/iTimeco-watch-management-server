const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3gqpg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const database = client.db('iTimeco');
    const productsCollection = database.collection('products');

    //add product
    app.post('/addProduct', async (req, res) => {
      const result = await productsCollection.insertOne(req.body);
      res.json(result);
    });

    // get products
    app.get('/getProduct', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

     //get single product
     app.get('/inventory/:id', async (req, res) => {
      const result = await productsCollection.find({ _id: ObjectId(req.params.id) }).toArray();
      res.send(result);
     });
    
    
    

  
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('iTimeco Server is Running!');
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});