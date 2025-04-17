'use client';

import { useState } from 'react';

interface BulkOrder {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  numberOfPeople: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  totalAmount: number;
  additionalNotes?: string;
  deliveryAddress?: string;
  createdAt: string;
}

// Sample menu items for the new order form
const menuItems = [
  { id: '1', name: 'Veg Thali', price: 120 },
  { id: '2', name: 'Non-Veg Thali', price: 150 },
  { id: '3', name: 'South Indian Thali', price: 130 },
  { id: '4', name: 'North Indian Thali', price: 140 },
  { id: '5', name: 'Chinese Combo', price: 160 },
  { id: '6', name: 'Biryani Special', price: 180 },
];

export default function BulkOrdersManagement() {
  // More realistic sample data
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([
    {
      id: 'BO1',
      organizationName: 'Tech Corp',
      contactPerson: 'Jane Smith',
      email: 'jane@techcorp.com',
      phone: '+91-9876543210',
      eventDate: '2024-04-15',
      eventTime: '12:30',
      numberOfPeople: 100,
      items: [
        { name: 'Veg Thali', quantity: 70, price: 120 },
        { name: 'Non-Veg Thali', quantity: 30, price: 150 }
      ],
      status: 'confirmed',
      totalAmount: 12900,
      additionalNotes: 'Please ensure all items are properly packed. Need extra paper plates and cutlery.',
      deliveryAddress: 'Tech Corp Office, 123 Main Street, Bangalore',
      createdAt: '2024-04-10T10:00:00Z'
    },
    {
      id: 'BO2',
      organizationName: 'StartUp Hub',
      contactPerson: 'John Doe',
      email: 'john@startuphub.com',
      phone: '+91-8765432109',
      eventDate: '2024-04-20',
      eventTime: '18:00',
      numberOfPeople: 50,
      items: [
        { name: 'Chinese Combo', quantity: 30, price: 160 },
        { name: 'Veg Thali', quantity: 20, price: 120 }
      ],
      status: 'pending',
      totalAmount: 7200,
      additionalNotes: 'Need vegetarian and non-vegetarian items to be clearly marked',
      deliveryAddress: 'StartUp Hub, 456 Tech Park, Delhi',
      createdAt: '2024-04-12T15:30:00Z'
    },
    {
      id: 'BO3',
      organizationName: 'Annual College Event',
      contactPerson: 'Prof. Sarah Wilson',
      email: 'sarah@college.edu',
      phone: '+91-7654321098',
      eventDate: '2024-05-01',
      eventTime: '11:00',
      numberOfPeople: 200,
      items: [
        { name: 'South Indian Thali', quantity: 100, price: 130 },
        { name: 'North Indian Thali', quantity: 100, price: 140 }
      ],
      status: 'preparing',
      totalAmount: 27000,
      deliveryAddress: 'College Auditorium, University Campus, Mumbai',
      createdAt: '2024-04-05T09:15:00Z'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<BulkOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | BulkOrder['status']>('all');

  const [newOrder, setNewOrder] = useState<Omit<BulkOrder, 'id' | 'createdAt'>>({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    eventDate: '',
    eventTime: '',
    numberOfPeople: 0,
    items: [],
    status: 'pending',
    totalAmount: 0,
    additionalNotes: '',
    deliveryAddress: ''
  });

  const handleAddOrder = () => {
    const order: BulkOrder = {
      ...newOrder,
      id: `BO${bulkOrders.length + 1}`,
      createdAt: new Date().toISOString()
    };
    setBulkOrders(prev => [...prev, order]);
    setShowAddModal(false);
    setNewOrder({
      organizationName: '',
      contactPerson: '',
      email: '',
      phone: '',
      eventDate: '',
      eventTime: '',
      numberOfPeople: 0,
      items: [],
      status: 'pending',
      totalAmount: 0,
      additionalNotes: '',
      deliveryAddress: ''
    });
  };

  const handleStatusUpdate = (orderId: string, newStatus: BulkOrder['status']) => {
    setBulkOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this bulk order?')) {
      setBulkOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? bulkOrders 
    : bulkOrders.filter(order => order.status === statusFilter);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Bulk Orders Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and track large catering orders</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="flex items-center">
              <label htmlFor="statusFilter" className="mr-2 text-sm text-gray-700 dark:text-gray-300">Filter by status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="border dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
            >
              + New Bulk Order
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No bulk orders found matching the selected filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100">
                        {order.organizationName}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        #{order.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Created on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as BulkOrder['status'])}
                      className="border dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      order.status === 'confirmed' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Information</h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><span className="font-medium">Contact Person:</span> {order.contactPerson}</p>
                        <p><span className="font-medium">Email:</span> {order.email}</p>
                        <p><span className="font-medium">Phone:</span> {order.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Details</h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><span className="font-medium">Date:</span> {new Date(order.eventDate).toLocaleDateString()}</p>
                        <p><span className="font-medium">Time:</span> {order.eventTime}</p>
                        <p><span className="font-medium">Number of People:</span> {order.numberOfPeople}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Information</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.deliveryAddress}
                      </p>
                    </div>
                    {order.additionalNotes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Notes</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.additionalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">Order Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">Quantity</th>
                          <th className="text-right py-2">Price</th>
                          <th className="text-right py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 dark:text-gray-300">
                        {order.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2">{item.name}</td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">₹{item.price}</td>
                            <td className="text-right py-2">₹{item.quantity * item.price}</td>
                          </tr>
                        ))}
                        <tr className="font-medium text-gray-800 dark:text-gray-200">
                          <td colSpan={3} className="text-right py-3">Total Amount:</td>
                          <td className="text-right py-3">₹{order.totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setEditingOrder(order);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                  >
                    Edit Order
                  </button>
                  <button 
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Bulk Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">New Bulk Order</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={newOrder.organizationName}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, organizationName: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      value={newOrder.contactPerson}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newOrder.email}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={newOrder.phone}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={newOrder.eventDate}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      value={newOrder.eventTime}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, eventTime: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Number of People *
                    </label>
                    <input
                      type="number"
                      value={newOrder.numberOfPeople}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, numberOfPeople: parseInt(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      value={newOrder.deliveryAddress}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      rows={3}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2">Item</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Quantity</th>
                        <th className="text-right py-2">Total</th>
                        <th className="text-right py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newOrder.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2">{item.name}</td>
                          <td className="text-right py-2">₹{item.price}</td>
                          <td className="text-right py-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...newOrder.items];
                                newItems[index].quantity = parseInt(e.target.value);
                                setNewOrder(prev => ({
                                  ...prev,
                                  items: newItems,
                                  totalAmount: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                                }));
                              }}
                              className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded text-right"
                              min="1"
                            />
                          </td>
                          <td className="text-right py-2">₹{item.price * item.quantity}</td>
                          <td className="text-right py-2">
                            <button
                              onClick={() => {
                                const newItems = newOrder.items.filter((_, i) => i !== index);
                                setNewOrder(prev => ({
                                  ...prev,
                                  items: newItems,
                                  totalAmount: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                                }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <select
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2"
                    onChange={(e) => {
                      const selectedItem = menuItems.find(item => item.id === e.target.value);
                      if (selectedItem) {
                        setNewOrder(prev => ({
                          ...prev,
                          items: [...prev.items, { name: selectedItem.name, price: selectedItem.price, quantity: 1 }],
                          totalAmount: prev.totalAmount + selectedItem.price
                        }));
                      }
                    }}
                    value=""
                  >
                    <option value="">Add item...</option>
                    {menuItems.map(item => (
                      <option key={item.id} value={item.id}>{item.name} - ₹{item.price}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={newOrder.additionalNotes}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    rows={3}
                    placeholder="Any special requirements or instructions..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  Total Amount: ₹{newOrder.totalAmount}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrder}
                    disabled={
                      !newOrder.organizationName || !newOrder.contactPerson || !newOrder.email ||
                      !newOrder.phone || !newOrder.eventDate || !newOrder.eventTime ||
                      !newOrder.numberOfPeople || !newOrder.items.length
                    }
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Bulk Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}