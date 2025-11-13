import React, { useState, useEffect } from 'react';
import { getOrderHistory } from '../api/orderService';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const getStatusIcon = (status) => {
  if (status === 'COMPLETED') {
    return <FaCheckCircle className="text-green-500" />;
  }
  if (status === 'PENDING') {
    return <FaClock className="text-yellow-500" />;
  }
  return <FaTimesCircle className="text-red-500" />;
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getOrderHistory();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch order history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold text-green-400 mb-8">Order History</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 p-8">Loading order history...</p>
        ) : (
          <table className="min-w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Ticker</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Order Type</th>
                <th className="text-right p-4">Quantity</th>
                <th className="text-right p-4">Price</th>
                <th className="text-center p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold">{order.ticker}</td>
                  <td className={`p-4 font-semibold ${order.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    {order.type}
                  </td>
                  <td className="p-4">{order.orderType}</td>
                  <td className="text-right p-4">{order.quantity}</td>
                  <td className="text-right p-4">${order.limitPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;