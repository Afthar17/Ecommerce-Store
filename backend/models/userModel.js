import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Please provide your name"]
    },
    email:{
        type: String,
        required:[true, "Please provide your email"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Please provide your password"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    cartItems:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity:{
                type: Number,
                required: true,
                default: 1
            },
            
        }
    ],
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }
},
{
    timestamps: true
})


// Hashing the password before saving the user
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }else{
        try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
            next()
        } catch (error) {
            next(error)
        }
    }
    
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);
export default User;