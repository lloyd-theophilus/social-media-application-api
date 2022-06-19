const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv');



dotenv.config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.S3_BUCKET);
  console.log("Database connected");
}


const port = process.env.PORT || 3000;


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.listen(port, () => {
    console.log(`Listening on port ${port}`);
 })

