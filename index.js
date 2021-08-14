const express = require('express')
require('dotenv').config()
const cors = require('cors')
// const bodyParser = require('body-parser');

const { MongoClient } = require('mongodb');
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// middleware
app.use(express.json());  //express instead of bodyParser
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.cnvk9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("Ema_John_DB").collection("products");
//   console.log('Database Connected')

  //post endpoint
   app.post('/addProduct',(req,res)=>{
       const products=req.body;
       console.log(products)
       productCollection.insertMany(products)  //insertOne / insertMany
       .then(result=>{
        //    console.log(result);
        console.log(result.insertedCount);
        res.send(result.insertedCount)
          
       })
   })

   app.get('/products',(req,res)=>{
       productCollection.find({}).limit(30)
       .toArray((err,documents)=>{
           res.send(documents);
       })
   })


});

app.listen(port)