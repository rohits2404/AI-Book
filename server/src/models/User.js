import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        minLength: 6,
        select: false
    },
    isPro: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
    },
    avatar: {
        type: String,
        default: ""
    },
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
