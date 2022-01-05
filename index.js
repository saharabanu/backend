const express = require('express')
const app = express()
const cors = require('cors');

require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');


const port = process.env.PORT || 9000;




app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jy11d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

  try{
    await client.connect();
    console.log('database connected successfully')
    const database = client.db("scic_products");
    const productsCollection = database.collection("products");
    const orderCollection= database.collection("orders");
    const reviewCollection = database.collection('Reviews');
    const usersCollection = database.collection('Users');


            // post api 
            app.post('/addProducts',async(req,res)=>{
              const product = req.body;
              const result =await productsCollection.insertOne(product);
              console.log(result);
              res.json(result)
          });

          app.post("/addOrders", async (req, res) => {
                  const result = await orderCollection.insertOne(req.body);
                 res.send(result);
               });
            
                app.post("/addReview", async (req, res) => {
                   const result = await reviewCollection.insertOne(req.body);
                 res.send(result);
                 });
                 app.post("/addUsers", async (req, res) => {
                  const result = await usersCollection.insertOne(req.body);
                  res.send(result);
                   console.log(result);
                });
            
                 app.put("/makeAdmin", async (req, res) => {
                  const filter = { email: req.body.email };
                   const result = await usersCollection.find(filter).toArray();
                   console.log(result);
                   if (result) {
                     const document = await usersCollection.updateOne(filter, {
                      $set: { role: "admin" },
                     });
                   }
                 });

          // get request

    app.get("/addProducts", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
   });

   app.get("/orders", async (req, res) => {
           const result = await orderCollection.find({}).toArray();
          res.send(result);
        });
    
         app.get("/reviews", async (req, res) => {
          const result = await reviewCollection.find({}).toArray();
          res.send(result);
         });
         app.get("/myOrders/:email", async (req, res) => {
         const result = await orderCollection
            .find({ email: req.params.email })
             .toArray();
           res.send(result);
        });
    
        app.get('/orders/:id', async (req, res) => {
          const id = req.params.id;
           const query = { _id: ObjectId(id) }
           const result = await orderCollection.findOne(query)
          res.json(result);
        })
    
         // single service
         app.get("/singleProducts/:id", async (req, res) => {
           const result = await productsCollection
            .find({ _id: ObjectId(req.params.id) })
             .toArray();
           res.send(result[0]);
         });
    
         // check admin
        app.get("/chackadmin/:email", async (req, res) => {
           const result = await usersCollection
             .find({ email: req.params.email })
             .toArray();
           res.send(result);
        });
    
        // delete
    
        app.delete("/orders/:id", async (req, res) => {
           const id = req.params.id;
          const query = { _id: ObjectId(id) };
           const resutl = await orderCollection.deleteOne(query);
          console.log("deleting user With id", resutl);
          res.json(resutl);
       });
    
         app.delete("/addProducts/:id", async (req, res) => {
          const id = req.params.id;
           const query = { _id: ObjectId(id) };
           const resutl = await productsCollection.deleteOne(query);
           console.log("deleting user With id", resutl);
          res.json(resutl);
        });
    
        app.put("/statusUpdate/:id", async (req, res) => {
           const filter = { _id: ObjectId(req.params.id) };
          const result = await orderCollection.updateOne(filter, {
            $set: {
               status: req.body.status,
            },
          });
           res.send(result);
        });

   

  }
  finally{
    // await client.close();
  }

}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('backend server is running')
})

app.listen(port, () => {
  console.log(` listening at ${port}`)
})













































//     const productsCollection = client.db("scic-assignment").collection("products");
//     const orderCollection = client.db("scic-assignment").collection("orders");
//     const reviewCollection = client.db("scic-assignment").collection("reviews");
//     const usersCollection = client.db("scic-assignment").collection("users");

//     // post request

//     app.post("/addProducts", async (req, res) => {
//       const result = await productsCollection.insertOne(req.body);
//       res.send(result);
//     });

//     app.post("/addOrders", async (req, res) => {
//       const result = await orderCollection.insertOne(req.body);
//       res.send(result);
//     });

//     app.post("/addReview", async (req, res) => {
//       const result = await reviewCollection.insertOne(req.body);
//       res.send(result);
//     });
//     app.post("/addUsers", async (req, res) => {
//       const result = await usersCollection.insertOne(req.body);
//       res.send(result);
//       console.log(result);
//     });

//     app.put("/makeAdmin", async (req, res) => {
//       const filter = { email: req.body.email };
//       const result = await usersCollection.find(filter).toArray();
//       console.log(result);
//       if (result) {
//         const document = await usersCollection.updateOne(filter, {
//           $set: { role: "admin" },
//         });
//       }
//     });

//     // get request

//     app.get("/addProducts", async (req, res) => {
//       const result = await productsCollection.find({}).toArray();
//       res.send(result);
//     });
//     app.get("/orders", async (req, res) => {
//       const result = await orderCollection.find({}).toArray();
//       res.send(result);
//     });

//     app.get("/reviews", async (req, res) => {
//       const result = await reviewCollection.find({}).toArray();
//       res.send(result);
//     });
//     app.get("/myOrders/:email", async (req, res) => {
//       const result = await orderCollection
//         .find({ email: req.params.email })
//         .toArray();
//       res.send(result);
//     });

//     app.get('/orders/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: ObjectId(id) }
//       const result = await orderCollection.findOne(query)
//       res.json(result);
//     })

//     // single service
//     app.get("/singleProducts/:id", async (req, res) => {
//       const result = await productsCollection
//         .find({ _id: ObjectId(req.params.id) })
//         .toArray();
//       res.send(result[0]);
//     });

//     // check admin
//     app.get("/chackadmin/:email", async (req, res) => {
//       const result = await usersCollection
//         .find({ email: req.params.email })
//         .toArray();
//       res.send(result);
//     });

//     // delete

//     app.delete("/orders/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: ObjectId(id) };
//       const resutl = await orderCollection.deleteOne(query);
//       console.log("deleting user With id", resutl);
//       res.json(resutl);
//     });

//     app.delete("/addProducts/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: ObjectId(id) };
//       const resutl = await productsCollection.deleteOne(query);
//       console.log("deleting user With id", resutl);
//       res.json(resutl);
//     });

//     app.put("/statusUpdate/:id", async (req, res) => {
//       const filter = { _id: ObjectId(req.params.id) };
//       const result = await orderCollection.updateOne(filter, {
//         $set: {
//           status: req.body.status,
//         },
//       });
//       res.send(result);
//     });
//   } finally {
//     // await cllient.close()
//   }
// }

// run().catch(console.dir);

// // root serve link

// app.get("/", (req, res) => {
//   res.send("scic assignment server is running");
// });

// app.listen(port, () => {
//   console.log("Server Running Port", port);
// });
