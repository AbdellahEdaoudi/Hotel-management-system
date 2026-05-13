import React from 'react';

const CardSkeleton = () => {
    return (
        <div className="bg-white rounded-md shadow-md pb-4 animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-t-md"></div>
            <div className="px-5 pt-4">
                <div className="flex justify-between mb-3">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex space-x-3 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex justify-between mt-5">
                    <div className="h-10 bg-gray-200 rounded w-28"></div>
                    <div className="h-10 bg-gray-200 rounded w-28"></div>
                </div>
            </div>
        </div>
    );
};

export default CardSkeleton;
