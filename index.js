const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');


const userRoute = require('./routes/User');
const authRoute = require('./routes/Auth');



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
app.use(express.urlencoded({ extended: true }));

// Implementing routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);




app.listen(port, () => {
    console.log(`Listening on port ${port}`);
 })

