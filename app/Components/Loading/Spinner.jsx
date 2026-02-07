import React from 'react';

const Spinner = ({ className = "h-6 w-6" }) => {
    return (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-amber-500 ${className}`}></div>
    );
};

export default Spinner;
