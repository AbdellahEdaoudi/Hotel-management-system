import React from 'react';

const ListSkeleton = () => {
    return (
        <div className="w-full animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 p-4 border rounded-md shadow-sm">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
};

export default ListSkeleton;
