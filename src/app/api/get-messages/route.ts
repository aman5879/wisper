import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';

import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import userModel from '@/modules/User';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return Response.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const userId = (
            session.user as typeof session.user & { _id?: string }
        )._id;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return Response.json(
                { success: false, message: 'Valid user ID not found in session' },
                { status: 401 }
            );
        }

        await dbConnect();

        const user = await userModel.findById(userId).select('message');

        if (!user) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Your current User schema names this array "message" (singular).
        const messages = [...(user.message ?? [])].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

        return Response.json(
            { success: true, messages },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching messages:', error);

        return Response.json(
            { success: false, message: 'Error fetching messages' },
            { status: 500 }
        );
    }
}