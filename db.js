import {MongoClient, ServerApiVersion} from "mongodb";

export const connectToDB = async (dbUri) => {
  const client = new MongoClient(dbUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    }
  );

  await client.connect();

  await client.db("").command({ping: 1});

  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  return client
}