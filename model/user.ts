import mongoose , {Document , Schema , Model} from "mongoose";

interface IUser extends Document {
    name : string
    email : string , 
    password : string ,
    organization : string,
    agreeToTerms : boolean
    id : string
}



const UserSchema : Schema<IUser> = new mongoose.Schema({

    name : {
        type : String ,
        required : true
    },
    email : {
        type : String,
        unique : true ,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    organization : {
        type : String ,
        required : true 
    },
    agreeToTerms : {
        type : Boolean,
        required : true
    }
})

const User : Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User" , UserSchema)

export default User