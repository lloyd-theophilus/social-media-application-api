const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');


const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');



// Dotenv config
dotenv.config();


// DB connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.S3_BUCKET);
  console.log("Database connected");
}


const port = process.env.PORT || 3000;


const app = express();

// middleware
app.use(cors());
app.use(helmet());  // for security purpose
app.use(morgan('common'));
app.use(express.json());

// Implementing routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute); 




app.listen(port, () => {
    console.log(`Listening on port ${port}`);
 })

