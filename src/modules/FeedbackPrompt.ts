import mongoose, { Document, Schema, Types } from "mongoose";

export interface FeedbackPrompt extends Document {
    ownerId: Types.ObjectId;
    username: string;
    question: string;
    isActive: boolean;
    createdAt: Date;
}

const FeedbackPromptSchema: Schema<FeedbackPrompt> = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    question: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 500,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const FeedbackPromptModel =
    (mongoose.models.FeedbackPrompt as
        | mongoose.Model<FeedbackPrompt>
        | undefined) ??
    mongoose.model<FeedbackPrompt>("FeedbackPrompt", FeedbackPromptSchema);

export default FeedbackPromptModel;