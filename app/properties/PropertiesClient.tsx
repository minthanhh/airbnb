'use client';

import { useRouter } from 'next/navigation';
import { Container, Heading, ListingCard } from '../components';
import { SafeListing, SafeUser } from '../types';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface PropertiesProps {
    listings: SafeListing[];
    currentUser?: SafeUser | null;
}

const Properties: React.FC<PropertiesProps> = ({ listings, currentUser }) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback(
        (id: string) => {
            setDeletingId(id);
            axios
                .delete(`/api/listings/${id}`)
                .then(() => {
                    toast.success('Listing deleted');
                    router.refresh();
                })
                .catch((error) => toast.error(error?.respone?.data?.error))
                .finally(() => setDeletingId(''));
        },
        [router]
    );
    return (
        <Container>
            <Heading title="Properties" subtitle="List of your properties" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        data={listing}
                        actionId={listing.id}
                        onAction={onCancel}
                        actionLabel="Delete property"
                        disabled={deletingId === listing.id}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    );
};

export default Properties;
