// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
// requiring mongoose
const mongoose = require('mongoose');
// requiring from dotenv
const {MONGO_URI} = process.env;

exports.connect = () => {
    // connecting to the database
    mongoose
    .connect(MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // tls: {
        //     rejectUnauthorized: false
        //   }
    })
    .then(() => {
        console.log(" Successfully connected to the database ");
    })
    .catch((error) => {
        console.log(" database connection failed. existing now... ");
        console.error(error);
        process.exist(1);
    });
};

