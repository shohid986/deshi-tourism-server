const express = require('express');
var cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
// const uri = "mongodb+srv://<username>:<password>@cluster0.oroy6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// tourismMongoDB
// Nz9TbAF4WZCoLz3e
const uri = "mongodb+srv://tourismMongoDB:Nz9TbAF4WZCoLz3e@cluster0.oroy6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      console.log('mongo database connected successfully');
      const database = client.db("tourism-web");
      const movies = database.collection("services");
      app.get('/services', async(req, res)=>{
        const cursor = movies.find({});
        const result = await cursor.toArray();
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