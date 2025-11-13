import React from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Helper to get the correct icon for the order status
const getStatusIcon = (status) => {
  if (status === 'COMPLETED') {
    return <FaCheckCircle className="text-green-500" title="Completed" />;
  }
  if (status === 'PENDING') {
    return <FaClock className="text-yellow-500" title="Pending" />;
  }
  return <FaTimesCircle className="text-red-500" title="Cancelled" />;
};

function RecentOrdersList({ orders }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
        <Link to="/orders" className="text-sm text-green-400 hover:text-green-300">
          View All
        </Link>
      </div>
      <ul className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No recent orders found.</p>
        ) : (
          orders.slice(0, 5).map((order) => ( // Show the 5 most recent
            <li key={order.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-bold text-white">{order.ticker}</p>
                  <p className="text-sm text-gray-400">
                    {order.type} {order.orderType}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{order.quantity} Shares</p>
                <p className="text-sm text-gray-400">@ ${order.limitPrice.toFixed(2)}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default RecentOrdersList;