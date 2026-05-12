import React, { useState } from 'react';
import { FiSearch, FiTruck, FiCheckCircle, FiAlertCircle, FiPackage, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { orderService } from '../services/orderService';

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTracking(null);
        try {
            const response = await orderService.getOrderTracking(orderNumber);
            if (response && response.success && response.data) {
                setTracking(response.data);
            } else if (response && response.message) {
                setError(response.message);
            } else {
                setError('Order not found');
            }
        } catch (err) {
            setError(err.message || 'Order not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-20 bg-gradient-to-br from-green-50 to-white py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-green-100">
                <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-green-700">
                    <FiTruck className="text-green-600" /> Track Your Order
                </h1>
                <form onSubmit={handleTrack} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        className="flex-1 border border-green-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                        placeholder="Enter your Order Number"
                        value={orderNumber}
                        onChange={e => setOrderNumber(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 font-semibold shadow"
                        disabled={loading}
                    >
                        <FiSearch /> {loading ? 'Tracking...' : 'Track'}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 flex items-center gap-2">
                        <FiAlertCircle /> {error}
                    </div>
                )}

                {tracking && (
                    <div className="mt-6">
                        <div className="bg-green-50 rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between mb-6 border border-green-100">
                            <div>
                                <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
                                    <FiPackage /> Order <span className="ml-1">#{tracking.order_number}</span>
                                </div>
                                <div className="mt-2 text-gray-700">
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={`capitalize px-2 py-1 rounded ${tracking.status === 'delivered' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {tracking.status}
                                    </span>
                                </div>
                                <div className="mt-1 text-gray-700">
                                    <span className="font-medium">Total:</span> ₹{tracking.total_amount} {tracking.currency}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col gap-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FiMapPin className="text-green-500" />
                                    <span>{tracking.shipping_address}, {tracking.shipping_city}, {tracking.shipping_state}, {tracking.shipping_postal_code}, {tracking.shipping_country}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiMail className="text-green-500" />
                                    <span>{tracking.shipping_email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiPhone className="text-green-500" />
                                    <span>{tracking.shipping_phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="font-semibold mb-2 text-green-700">Items</h3>
                            {tracking.items && tracking.items.length > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {tracking.items.map((item, idx) => (
                                        <li key={idx} className="py-2 flex justify-between items-center">
                                            <span className="font-medium">{item.product_name}</span>
                                            <span className="text-gray-600">x{item.quantity}</span>
                                            <span className="text-green-700 font-semibold">₹{item.total_price}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-gray-500">No items found.</div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h3 className="font-semibold mb-2 text-green-700">Order Timeline</h3>
                            <ol className="relative border-l border-green-300 ml-3">
                                {tracking.timeline && tracking.timeline.length > 0 ? (
                                    tracking.timeline.map((step, idx) => (
                                        <li key={idx} className="mb-8 ml-4">
                                            <div className={`absolute w-3 h-3 rounded-full -left-1.5 border-2 ${step.completed ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-300'}`}></div>
                                            <div className="flex items-center gap-2">
                                                {step.completed ? (
                                                    <FiCheckCircle className="text-green-600" />
                                                ) : (
                                                    <FiAlertCircle className="text-gray-400" />
                                                )}
                                                <span className="font-medium capitalize">{step.title}</span>
                                                <span className="text-gray-500 text-sm ml-2">{step.date ? new Date(step.date).toLocaleString() : ''}</span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No timeline available.</li>
                                )}
                            </ol>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}