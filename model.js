import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
},
    {timestamps: true}
)
const ChatUser = mongoose.model("Userchat", userSchema);

const mesgSchema = new mongoose.Schema({
    auther: {type: String, required: true},
    message: {type: String, required: true},
    time: {type: String, required: true}
},
    {timestamps: true}
)
const userMesg = mongoose.model("UserMesg", mesgSchema);

export default  {ChatUser, userMesg};