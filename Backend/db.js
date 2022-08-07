

const db=  require("mongoose");
const DbURI="mongodb://localhost:27017/inotebook";

const connectToMongo= ()=>{
    db.connect(DbURI, ()=>{
        console.log("Connected to DB");
    })
}
module.exports=connectToMongo;
