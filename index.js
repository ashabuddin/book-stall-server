const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectID;

const port = 5000;

app.use(cors());
app.use(bodyParser.json());
//console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxbrw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const bookCollection = client.db("book-stall").collection("books");
    const orderCollection = client.db("book-stall").collection("order");

    app.get('/books',(req,res) => {
      bookCollection.find()
      .toArray((err, books) => {
        res.send(books)
      })
    })
   
    app.get('/book/:id',(req,res) => {
      bookCollection.find({_id:ObjectId(req.params.id)})
      .toArray((err, book) => {
        res.send(book[0])
      })
    })

    app.post('/addBook', (req,res) => {
     const newBook = req.body;
     console.log('adding new book', newBook );
     bookCollection.insertOne(newBook)
     .then(result => {
       console.log('inserted',result.insertedCount );
       res.send(result.insertedCount > 0)
     })
    })

    // app.delete('/delete/:id',(req,res)=> {
    //   const id = ObjectId(req.params.id)
    //   bookCollection.findOneAndDelete({_id: id})
    //   .then(document =>{
    //     res.send(!!document.value)
    //   })
    // })

    app.post('/addOrder', (req,res) => {
     const newOrder = req.body;
      orderCollection.insertOne(newOrder)
     .then(result => {
       console.log('inserted',result.insertedCount );
       res.send(result.insertedCount > 0)
     })
    })

    app.get('/order',(req,res) => {
      orderCollection.find({})
      .toArray((err, order) => {
        res.send(order)
      })
    })
    
  });
  
app.listen(port)