import getCurrentUser from '../actions/getCurrentUser';
import getFavoritesListings from '../actions/getFavoriteListings';
import { ClientOnly, EmptyState } from '../components';
import FavoritesClient from './FavoritesClient';

const FavoritesPage = async () => {
    const favorites = await getFavoritesListings();
    const currentUser = await getCurrentUser();

    if (favorites.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No favorites found"
                    subtitle="Looks like you have no favorite listings"
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <FavoritesClient listings={favorites} currentUser={currentUser} />
        </ClientOnly>
    );
};

export default FavoritesPage;
