import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';

import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import userModel from '@/modules/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return Response.json(
                { success: false, message: 'User unauthenticated.' },
                { status: 401 }
            );
        }

        const userId = session.user._id;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return Response.json(
                { success: false, message: 'Valid user ID not found in session.' },
                { status: 401 }
            );
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return Response.json(
                { success: false, message: 'Request body must be valid JSON.' },
                { status: 400 }
            );
        }

        const acceptMessages = (body as { acceptMessages?: unknown })?.acceptMessages;

        if (typeof acceptMessages !== 'boolean') {
            return Response.json(
                { success: false, message: '`acceptMessages` must be a boolean.' },
                { status: 400 }
            );
        }

        await dbConnect();

        const updatedUser = await userModel
            .findByIdAndUpdate(
                userId,
                { isAcceptingMessage: acceptMessages },
                { new: true, runValidators: true }
            )
            .select('isAcceptingMessage');

        if (!updatedUser) {
            return Response.json(
                { success: false, message: 'User not found.' },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully.',
                isAcceptingMessage: updatedUser.isAcceptingMessage,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating message acceptance status:', error);

        return Response.json(
            { success: false, message: 'Error updating message acceptance status.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return Response.json(
                { success: false, message: 'User unauthenticated.' },
                { status: 401 }
            );
        }

        const userId = session.user._id;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return Response.json(
                { success: false, message: 'Valid user ID not found in session.' },
                { status: 401 }
            );
        }

        await dbConnect();

        const foundUser = await userModel
            .findById(userId)
            .select('isAcceptingMessage')
            .lean();

        if (!foundUser) {
            return Response.json(
                { success: false, message: 'User not found.' },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, isAcceptingMessage: foundUser.isAcceptingMessage },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching message settings:', error);

        return Response.json(
            { success: false, message: 'Error fetching message settings.' },
            { status: 500 }
        );
    }
}