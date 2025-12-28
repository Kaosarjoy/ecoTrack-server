const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = 3000
// Middleware
app.use(cors())
app.use(express.json())
// Routes
const uri = "mongodb+srv://ecoTrack_UserInfo:Ck4tTq2GZ428abNi@cluster0.uoqvvub.mongodb.net/?appName=Cluster0";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// MongoDB Client Setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
// Connect to MongoDB
async function run() {
  try {

    await client.connect();
    //create  a database called 
    const db = client.db("ecoTrackDB");
    const usersCollection = db.collection("users");
    const activitiesCollection = db.collection("activities");

//single user insert
    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    //multiple user 
    app.post('/users',async(req,res)=>{
      const user = req.body
      const result = await usersCollection.insertMany(user)
    })
    //delete user 
    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result =await usersCollection.deleteOne(query)
      res.send(result)
    })

    //activities

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);