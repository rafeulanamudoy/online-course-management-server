require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v0ciw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db("OnlineCourseMangement");
        const courseCollection = database.collection("course");
        console.log("server connect successfully")
        // create a document to insert
        app.get("/courses", async (req, res) => {
            const cursor = courseCollection.find({});
            const courses = await cursor.toArray();

            res.send({ status: true, data: courses });
        });
        app.get("/course/:id", async (req, res) => {

            const courseId = req.params.id;
            const filter = { _id: ObjectId(courseId) }
            const result = await courseCollection.findOne(filter);
            console.log(result)
            res.send({ status: true, data: result });
        });
        app.post("/course", async (req, res) => {
            const course = req.body;
            console.log(course)

            const result = await courseCollection.insertOne(course);

            res.send(result);
        });
        app.delete("/course/:id", async (req, res) => {
            const id = req.params.id;

            const result = await courseCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });


        app.put("/course/:id", async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            console.log(updateProduct, id)
            const option = { upsert: true }
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: updateProduct
            }
            const result = await courseCollection.updateOne(filter, updatedDoc, option);
            res.send(result);
        });

    } finally {
        // await client.close();

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

