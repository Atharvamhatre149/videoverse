import React from 'react';

export default function Subscriptions() {
    return (
        <div className="pt-16 p-4">
            <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Subscription content will go here */}
                <div className="text-center text-gray-500">
                    Your subscribed channels will appear here
                </div>
            </div>
        </div>
    );
} 