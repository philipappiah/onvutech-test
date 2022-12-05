import mongoose from "mongoose";


class Database {
    url:string
    constructor(connectionUrl:string){
        this.url = connectionUrl;
    }
     connectDataBase = () => {
       
        mongoose.connect(this.url,  () => {
            console.log("connected to database");
        })
    }
    
    
      disconnectDatabase = async () => {
        await mongoose.disconnect()
    }

}

export default Database

