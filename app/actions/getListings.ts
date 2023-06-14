import prisma from '~/app/libs/prismadb';

export interface ListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(params: ListingsParams) {
    try {
        const {
            userId,
            category,
            endDate,
            roomCount,
            startDate,
            guestCount,
            bathroomCount,
            locationValue,
        } = params;

        let query: any = {};
        if (userId) {
            query.userId = userId;
        }
        if (category) {
            query.category = category;
        }
        if (guestCount) {
            query.guestCount = {
                gte: +guestCount,
            };
        }
        if (roomCount) {
            query.roomCount = {
                gte: +roomCount,
            };
        }
        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount,
            };
        }

        if (locationValue) {
            query.locationValue = locationValue;
        }

        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: endDate },
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte: startDate },
                            },
                        ],
                    },
                },
            };
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}
