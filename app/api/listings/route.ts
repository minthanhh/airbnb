import prisma from '~/app/libs/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '~/app/actions/getCurrentUser';

export async function POST(req: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await req.json();
    const {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,
        price,
    } = body;

    Object.keys(body).forEach((v: any) => {
        if (!body[v]) {
            NextResponse.error();
        }
    });

    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            bathroomCount,
            category,
            guestCount,
            locationValue: location.value,
            price: parseInt(price, 10),
            roomCount,
            userId: currentUser.id,
        },
    });

    return NextResponse.json(listing);
}
