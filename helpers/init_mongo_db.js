const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('mongoDB connected...')
    })
    .catch((err) => {
        console.log(`mongoDB connection error: ${err}`)
    });

mongoose.connection.on('connected', () => {
    console.log('mongoDB connection established...')
});

mongoose.connection.on('error', err => {
    console.log(`error establishing connection: ${err}`)
});

mongoose.connection.on('disconnected', err => {
    console.log('mongoDB connection disconnected...')
});

// terminate connectin
process.on('SIGINT', async() => {
    await mongoose.connection.close()
    process.exit(0)
})