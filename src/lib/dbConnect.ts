import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {}

const dbConnect = async (): Promise<void> =>{
    if(connection.isConnected){
        console.log('Already connected to the database');
        return
    }

    try{
        // connection od db
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected sucessfully");

    }catch (err){
        console.error("Database connection failed.", err);
        
        // exit in case of failed connection.
        process.exit(1);
    }
}

export default dbConnect;