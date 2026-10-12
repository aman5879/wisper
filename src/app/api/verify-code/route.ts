
import dbConnect from '@/lib/dbConnect';
import userModel from '@/modules/User';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { username, code } = await request.json();

        if (
            typeof username !== 'string' ||
            typeof code !== 'string'
        ) {
            return Response.json(
                {
                    success: false,
                    message: 'Username and verification code are required.',
                },
                { status: 400 }
            );
        }

        const decodedUsername = decodeURIComponent(username);

        // Search using the actual schema field: username
        const user = await userModel.findOne({
            username: decodedUsername,
        });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found.',
                },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return Response.json(
                {
                    success: true,
                    message: 'Account is already verified.',
                },
                { status: 200 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired =
            new Date(user.verifyCodeExpiry) > new Date();

        if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: 'Verification code has expired. Please sign up again.',
                },
                { status: 400 }
            );
        }

        if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: 'Incorrect verification code.',
                },
                { status: 400 }
            );
        }

        user.isVerified = true;
        await user.save();

        return Response.json(
            {
                success: true,
                message: 'Account verification successful.',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error verifying user:', error);

        return Response.json(
            {
                success: false,
                message: 'Error verifying user.',
            },
            { status: 500 }
        );
    }
}
