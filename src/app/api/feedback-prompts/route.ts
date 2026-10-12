import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import userModel from "@/modules/User";
import FeedbackPromptModel from "@/modules/FeedbackPrompt";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        const promptId = searchParams.get("promptId");

        // Public request: fetch a question from a custom feedback link
        if (username || promptId) {
            if (!username || !promptId) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Username and prompt ID are required.",
                    },
                    { status: 400 }
                );
            }

            if (!mongoose.isValidObjectId(promptId)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid feedback link.",
                    },
                    { status: 400 }
                );
            }

            const prompt = await FeedbackPromptModel.findOne({
                _id: promptId,
                username,
                isActive: true,
            }).select("_id username question");

            if (!prompt) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "This feedback link is unavailable.",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    prompt,
                },
                { status: 200 }
            );
        }

        // Private request: list the logged-in owner's questions
        const session = await getServerSession(authOptions);
        // console.log("Feedback API session:", session);

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User unauthenticated. No session found.",
                },
                { status: 401 }
            );
        }

        const ownerId = session.user._id;

        if (!ownerId || !mongoose.isValidObjectId(ownerId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Session exists, but a valid user ID was not found.",
                },
                { status: 401 }
            );
        }

        const prompts = await FeedbackPromptModel.find({
            ownerId,
        })
            .sort({ createdAt: -1 })
            .select("_id username question isActive createdAt")
            .lean();

        return NextResponse.json(
            {
                success: true,
                prompts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/feedback-prompts error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch feedback questions.",
            },
            { status: 500 }
        );
    }
}

// POST: Create a feedback question for the logged-in user
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const ownerId = session?.user?._id;

        if (!ownerId || !mongoose.isValidObjectId(ownerId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Please sign in.",
                },
                { status: 401 }
            );
        }

        const body: unknown = await request.json().catch(() => null);

        if (
            !body ||
            typeof body !== "object" ||
            !("question" in body) ||
            typeof body.question !== "string"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please provide a valid question.",
                },
                { status: 400 }
            );
        }

        const question = body.question.trim();

        if (question.length < 5 || question.length > 500) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Question must be between 5 and 500 characters.",
                },
                { status: 400 }
            );
        }

        await dbConnect();

        // Get the username from the authenticated user's database record.
        const owner = await userModel.findById(ownerId).select("username");

        if (!owner) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User account not found.",
                },
                { status: 404 }
            );
        }

        const prompt = await FeedbackPromptModel.create({
            ownerId: owner._id,
            username: owner.username,
            question,
            isActive: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Feedback question created successfully.",
                prompt: {
                    _id: prompt._id,
                    username: prompt.username,
                    question: prompt.question,
                    isActive: prompt.isActive,
                    createdAt: prompt.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/feedback-prompts error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create feedback question.",
            },
            { status: 500 }
        );
    }
}
