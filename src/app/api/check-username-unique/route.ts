import dbConnect from "@/lib/dbConnect";
import userModel from "@/modules/User";
import z from "zod";
import { usernameValidation } from "@/schema/signUpSchema"

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    // database connect
    await dbConnect();

    try {
        const searchParams = new URL(request.url).searchParams;
        const queryParams = {
            username: searchParams.get('username'),
        };
        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._error || [];

            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors && usernameErrors.length > 0
                            ? usernameErrors.join(", ")
                            : "Invalid query parameters",
                },
                {
                    status: 400,
                }
            );
        }

        const { username } = result.data;
        const existingVerifiedUser = await userModel.findOne({
            username,
            isVerified: true
        });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken."
            }, {
                status: 200
            });
        }
        return Response.json({
            success: true,
            message: "Username is unique."
        }, { status: 200 });


    } catch (error) {
        console.error('Error checking username.', error);
        return Response.json({
            success: false,
            message: "Error checking username."
        }, {
            status: 500
        });
    }
}