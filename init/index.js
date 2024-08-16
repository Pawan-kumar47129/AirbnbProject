const mongoose=require("mongoose");
const {data} =require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

mongoose
  .connect(MONGO_URL)
  .then((res) => {
    console.log("data base connected seccussfully");
  })
  .catch((err) => {
    console.log(err);
  });

  async function initDataBase(){
    try{
    await Listing.deleteMany({});
    const res=await Listing.insertMany(data);
    console.log("data was initialize");
    console.log(res);
    }
    catch(err){
        console.log(err);
    }
  }
  initDataBase();