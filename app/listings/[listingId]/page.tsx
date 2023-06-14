import getCurrentUser from '~/app/actions/getCurrentUser';
import getListingById from '~/app/actions/getListingById';
import getReservations from '~/app/actions/getReservations';
import { ClientOnly, EmptyState } from '~/app/components';
import ListingClient from './ListingClient';

interface Params {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: Params }) => {
    const listing = await getListingById(params);
    const reservations = await getReservations(params);
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    }
    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                currentUser={currentUser}
                reservations={reservations}
            />
        </ClientOnly>
    );
};

export default ListingPage;
