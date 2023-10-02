import React from 'react';

export default function DataCard({ type, value }: any) {
    return (
        <div className="flex flex-col w-full bg-blue-200 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{type}</h2>
            <p className="text-2xl">{value}</p>
        </div>
    );
};