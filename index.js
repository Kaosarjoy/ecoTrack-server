require('dotenv').config();
console.log("Current URI:", process.env.MONGO_URI); 

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// mongo uri
const uri = process.env.MONGO_URI;

// mongo client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('ecoTrackDB');
    const challengesCollection = db.collection('challenges');
    const userChallengesCollection = db.collection('userChallenges');
    const tipsCollection = db.collection('tips');
    const eventsCollection = db.collection('events');

    // ---------------- ROOT ----------------
    app.get('/', (req, res) => {
      res.send('EcoTrack Server Running');
    });

    // ---------------- CHALLENGES ----------------

    // GET challenges (with filter)
    app.get('/api/challenges', async (req, res) => {
      const { categories, minParticipants, maxParticipants } = req.query;
      const query = {};

      if (categories) {
        query.category = { $in: categories.split(',') };
      }

      if (minParticipants || maxParticipants) {
        query.participants = {
          $gte: Number(minParticipants || 0),
          $lte: Number(maxParticipants || 999999),
        };
      }

      const result = await challengesCollection.find(query).toArray();
      res.send(result);
    });

    // GET single challenge
    app.get('/api/challenges/:id', async (req, res) => {
      const id = req.params.id;
      const result = await challengesCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // POST create challenge
    app.post('/api/challenges', async (req, res) => {
      const challenge = {
        ...req.body,
        participants: 0,
        createdAt: new Date(),
      };
      const result = await challengesCollection.insertOne(challenge);
      res.send(result);
    });

    // PATCH update challenge
    app.patch('/api/challenges/:id', async (req, res) => {
      const id = req.params.id;
      const updateDoc = {
        $set: {
          ...req.body,
          updatedAt: new Date(),
        },
      };
      const result = await challengesCollection.updateOne(
        { _id: new ObjectId(id) },
        updateDoc
      );
      res.send(result);
    });

    // DELETE challenge
    app.delete('/api/challenges/:id', async (req, res) => {
      const id = req.params.id;
      const result = await challengesCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // JOIN challenge
    app.post('/api/challenges/join/:id', async (req, res) => {
      const challengeId = req.params.id;
      const { email } = req.body;

      await challengesCollection.updateOne(
        { _id: new ObjectId(challengeId) },
        { $inc: { participants: 1 } }
      );

      const joinData = {
        userId: email,
        challengeId: new ObjectId(challengeId),
        status: 'Ongoing',
        progress: 0,
        joinDate: new Date(),
      };

      const result = await userChallengesCollection.insertOne(joinData);
      res.send(result);
    });

    // ---------------- USER ACTIVITIES ----------------

    // GET my activities
    app.get('/api/my-activities', async (req, res) => {
      const email = req.query.email;
      const result = await userChallengesCollection
        .find({ userId: email })
        .toArray();
      res.send(result);
    });

    // UPDATE progress
    app.patch('/api/my-activities/:id', async (req, res) => {
      const id = req.params.id;
      const { progress, status } = req.body;

      const result = await userChallengesCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            progress,
            status,
            updatedAt: new Date(),
          },
        }
      );
      res.send(result);
    });

    // ---------------- TIPS ----------------
    app.get('/api/tips', async (req, res) => {
      const limit = Number(req.query.limit) || 5;
      const result = await tipsCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      res.send(result);
    });

    // ---------------- EVENTS ----------------
    app.get('/api/events', async (req, res) => {
      const limit = Number(req.query.limit) || 4;
      const result = await eventsCollection
        .find()
        .sort({ date: 1 })
        .limit(limit)
        .toArray();
      res.send(result);
    });

    console.log('MongoDB connected successfully');
  } finally {
    // keep connection alive
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`EcoTrack server running on port ${port}`);
});
