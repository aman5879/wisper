import mongoose from "mongoose";
import FeedbackPromptModel from "@/modules/FeedbackPrompt";
import userModel from "@/modules/User";
import dbConnect from "@/lib/dbConnect";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // 1. Parse the request body safely
        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return Response.json(
                {
                    success: false,
                    message: "Invalid JSON request body.",
                },
                { status: 400 }
            );
        }

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid request body.",
                },
                { status: 400 }
            );
        }

        const data = body as Record<string, unknown>;

        // 2. Extract and normalize input
        const username =
            typeof data.username === "string"
                ? data.username.trim()
                : "";

        const senderUsername =
            typeof data.senderUsername === "string"
                ? data.senderUsername.trim()
                : "";

        const content =
            typeof data.content === "string"
                ? data.content.trim()
                : "";

        // 3. Validate the recipient, sender username, and message
        if (!username) {
            return Response.json(
                {
                    success: false,
                    message: "Recipient username is required.",
                },
                { status: 400 }
            );
        }

        if (
            !senderUsername ||
            senderUsername.length > 30
        ) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Sender username must contain between 1 and 30 characters.",
                },
                { status: 400 }
            );
        }

        // Keep this aligned with your public message form:
        // minimum 10 characters, maximum 300 characters.
        if (content.length < 10 || content.length > 300) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Message must be between 10 and 300 characters.",
                },
                { status: 400 }
            );
        }

        // 4. Validate the custom feedback link, if supplied
        const rawPromptId = data.promptId;

        let promptSnapshot:
            | { promptId: string; promptText: string }
            | undefined;

        if (rawPromptId !== undefined && rawPromptId !== null) {
            if (
                typeof rawPromptId !== "string" ||
                !mongoose.isValidObjectId(rawPromptId)
            ) {
                return Response.json(
                    {
                        success: false,
                        message: "Invalid feedback link.",
                    },
                    { status: 400 }
                );
            }

            const linkedPrompt = await FeedbackPromptModel.findOne({
                _id: rawPromptId,
                username,
                isActive: true,
            })
                .select("_id question")
                .lean();

            if (!linkedPrompt) {
                return Response.json(
                    {
                        success: false,
                        message: "This feedback question is unavailable.",
                    },
                    { status: 404 }
                );
            }

            promptSnapshot = {
                promptId: linkedPrompt._id.toString(),
                promptText: linkedPrompt.question,
            };
        }

        // 5. Atomically add the message only if the recipient accepts messages
        const newMessage = {
            content,
            senderUsername,
            createdAt: new Date(),
            ...(promptSnapshot ?? {}),
        };

        const result = await userModel.updateOne(
            {
                username,
                isAcceptingMessage: true,
            },
            {
                $push: {
                    message: newMessage,
                },
            },
            {
                runValidators: true,
            }
        );

        // 6. Handle missing recipients or disabled message acceptance
        if (result.matchedCount === 0) {
            const existingUser = await userModel
                .exists({ username })
                .lean();

            return Response.json(
                {
                    success: false,
                    message: existingUser
                        ? "This user is not accepting messages."
                        : "User not found.",
                },
                {
                    status: existingUser ? 403 : 404,
                }
            );
        }

        // 7. Success
        return Response.json(
            {
                success: true,
                message: "Message sent successfully.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding message:", error);

        return Response.json(
            {
                success: false,
                message: "Internal server error.",
            },
            { status: 500 }
        );
    }
}
