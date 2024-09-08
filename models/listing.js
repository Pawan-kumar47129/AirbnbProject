const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  image:{
    type:String,
    default:"https://plus.unsplash.com/premium_photo-1723492163651-c788d9a369f8?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set:(link)=>link===""?"https://plus.unsplash.com/premium_photo-1723492163651-c788d9a369f8?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":link,
  },
  price:{
    type:Number,
    required:true,
  },
  location:{
    type:String,
  },
  country:{
    type:String,
    require:true,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ]

},{timestamps:true});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;