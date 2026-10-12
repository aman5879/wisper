import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    senderUsername: string;
    createdAt: Date;
    promptId?: string;
    promptText?: string;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    senderUsername: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    promptId: {
        type: String,
        default: undefined,
    },
    promptText: {
        type: String,
        trim: true,
        maxlength: 500,
        default: undefined,
    },
});

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    isVerified: boolean,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean,
    message: Message[]
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "verification code is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "date is required"]
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: [MessageSchema]
});

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);
export default userModel;