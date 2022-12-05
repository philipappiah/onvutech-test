import app from "./app";
import Database from './config/db'
var cluster = require('cluster');
require('dotenv').config();


if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker:any) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died ');
        cluster.fork();

    });


}else{

const MONGO_URL = process.env.MONGO_URL ||  `mongodb://127.0.0.1:27017/mydb`
const PORT = process.env.PORT || 4000

new Database(MONGO_URL).connectDataBase()



app.listen(PORT,  () => {
    console.log(`App is running on port ${PORT}`)
})

}