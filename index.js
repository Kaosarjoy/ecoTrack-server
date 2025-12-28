const express = require('express')
const cros = require('cros')
const app = express()
const port =process.env.PORT || 3000
const { MongoClient, ServerApiVersion } = require('mongodb');
//middleware
app.use(cros())
app.use(express.json())


const uri = "mongodb+srv://ecoTrack_UserInfo:ecoTrack@cluster0.uoqvvub.mongodb.net/?appName=Cluster0";

//create a client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
//mongodb test
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
