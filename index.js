const express = require('express');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oroy6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      console.log('mongo database connected successfully');
      const database = client.db("tourism-web");
      const serviceCollection = database.collection("services");
      const organizersCollection = database.collection("organizers");
      const ordersCollection = database.collection("orders");

      // services get api
      app.get('/services', async(req, res)=>{
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.json(services);
      })

      // service get api
      app.get('/service/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const singleService = await serviceCollection.findOne(query);
        res.json(singleService);
      })

      // organizers get api
      app.get('/organizers', async(req, res)=>{
        const cursor = organizersCollection.find({});
        const organizers = await cursor.toArray();
        res.json(organizers);
      })

      // post order api
      app.post('/orders/:id', async(req, res)=>{
        const order = req.body;
        const id = req.params.id;
        order.status= 'pending';
        order.id= id;
        const result = await ordersCollection.insertOne(order);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        console.log("docs hitted");
        res.json(result);
      })

      // update orders api
      app.put('/orders/:id', async(req, res)=>{
        const id = req.params.id;
        const order = req.body;
        console.log('update is hitting', id , order);
        // const filter = {_id:ObjectId(id)};
        // const result = await ordersCollection.updateOne(filter, order);
        // res.json(result);
      })

      // get orders api
      app.get('/orders', async(req, res)=>{
        const cursor = ordersCollection.find({});
        const orders = await cursor.toArray();
        res.json(orders);
      })

      //delete services api
      app.delete('/orders/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await ordersCollection.deleteOne(query);
        res.json(result);
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res)=>{
    console.log('tourism service server successfully running'),
    res.send('tourism service server runing by node express')
})

app.listen(port, ()=>{
    console.log('server is runing with port', port );
})