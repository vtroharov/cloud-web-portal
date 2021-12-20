const mongoose = require('mongoose');
const config = require('config');

const uri = config.get('mongoURI');
const port = config.get('mongoPORT');
const user = config.get('mongoUSER');
const pass = config.get('mongoPASS');
const db = config.get('mongoDB');

const connectDB = async () => {
    try {
        await mongoose
            .connect(
                "mongodb://" +
                    user + ":" +
                    pass + "@" +
                    uri + ":" +
                    port + "/" +
                    db,
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                }
            );
        console.log('MongoDB Connected...');
    } catch(err) {
        console.error(err.message)
        process.exit(1);
    }
}

module.exports = connectDB;