import { create } from 'zustand';
import prisma from '~/app/libs/prismadb';

interface Params {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(params: Params) {
    try {
        const { listingId, authorId, userId } = params;
        const query: any = {};

        if (listingId) {
            query.listingId = listingId;
        }
        if (userId) {
            query.userId = userId;
        }
        if (authorId) {
            query.listing = { userId: authorId };
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const safeReservations = reservations.map((reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing: {
                ...reservation.listing,
                createdAt: reservation.createdAt.toISOString(),
            },
        }));

        return safeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}
