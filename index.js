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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);