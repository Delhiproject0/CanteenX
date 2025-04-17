'use client';

import { useState } from 'react';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  active: boolean;
  minOrderValue?: number;
  maxUses?: number;
  currentUses: number;
  promoCode?: string;
  applicableItems: Array<{
    id: string;
    name: string;
  }>;
}

interface NewPromotion extends Omit<Promotion, 'id' | 'currentUses'> {}

export default function PromotionsManagement() {
  // Static menu items for demo
  const staticMenuItems = [
    { id: '1', name: 'Chicken Biryani' },
    { id: '2', name: 'Veg Thali' },
    { id: '3', name: 'Masala Dosa' },
    { id: '4', name: 'Cold Coffee' },
    { id: '5', name: 'French Fries' },
    { id: '6', name: 'Sandwich' },
  ];

  // Static promotions data
  const staticPromotions: Promotion[] = [
    {
      id: '1',
      name: 'Early Bird Special',
      description: 'Get 20% off on all breakfast items between 8 AM - 10 AM',
      type: 'percentage',
      value: 20,
      startDate: '2025-04-01',
      endDate: '2025-05-31',
      active: true,
      minOrderValue: 200,
      maxUses: 100,
      currentUses: 45,
      applicableItems: [
        { id: '3', name: 'Masala Dosa' },
      ]
    },
    {
      id: '2',
      name: 'Lunch Combo Deal',
      description: 'Flat ₹50 off on orders above ₹300 during lunch hours',
      type: 'fixed',
      value: 50,
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      active: true,
      minOrderValue: 300,
      currentUses: 78,
      promoCode: 'LUNCH50',
      applicableItems: []
    },
    {
      id: '3',
      name: 'Student Special',
      description: '15% off for students on all menu items',
      type: 'percentage',
      value: 15,
      startDate: '2025-04-01',
      endDate: '2025-12-31',
      active: true,
      promoCode: 'STUDENT15',
      currentUses: 156,
      applicableItems: []
    },
    {
      id: '4',
      name: 'Weekend Special',
      description: 'Get ₹100 off on orders above ₹500 during weekends',
      type: 'fixed',
      value: 100,
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      active: true,
      minOrderValue: 500,
      maxUses: 200,
      currentUses: 89,
      promoCode: 'WEEKEND100',
      applicableItems: []
    },
    {
      id: '5',
      name: 'Snacks Hour',
      description: '25% off on all snacks between 3 PM - 5 PM',
      type: 'percentage',
      value: 25,
      startDate: '2025-04-01',
      endDate: '2025-05-15',
      active: false,
      applicableItems: [
        { id: '5', name: 'French Fries' },
        { id: '6', name: 'Sandwich' }
      ]
    }
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>(staticPromotions);
  const [menuItems] = useState(staticMenuItems);
  
  const [newPromotion, setNewPromotion] = useState<NewPromotion>({
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true,
    minOrderValue: 0,
    maxUses: undefined,
    promoCode: '',
    applicableItems: []
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (showEditModal && editingPromotion) {
      setEditingPromotion(prev => {
        if (!prev) return prev;
        if (type === 'checkbox') {
          return { ...prev, [name]: (e.target as HTMLInputElement).checked };
        }
        if (type === 'number') {
          return { ...prev, [name]: Number(value) };
        }
        return { ...prev, [name]: value };
      });
    } else {
      setNewPromotion(prev => {
        if (type === 'checkbox') {
          return { ...prev, [name]: (e.target as HTMLInputElement).checked };
        }
        if (type === 'number') {
          return { ...prev, [name]: Number(value) };
        }
        return { ...prev, [name]: value };
      });
    }
  };

  const handleItemSelection = (itemId: string, itemName: string) => {
    const target = showEditModal && editingPromotion ? editingPromotion : newPromotion;
    const setTarget = showEditModal ? setEditingPromotion : setNewPromotion;
    
    if (target.applicableItems.some(item => item.id === itemId)) {
      setTarget(prev => ({
        ...prev!,
        applicableItems: prev!.applicableItems.filter(item => item.id !== itemId)
      }));
    } else {
      setTarget(prev => ({
        ...prev!,
        applicableItems: [...prev!.applicableItems, { id: itemId, name: itemName }]
      }));
    }
  };

  const handleAddPromotion = () => {
    const newPromo: Promotion = {
      ...newPromotion,
      id: (promotions.length + 1).toString(),
      currentUses: 0
    };
    
    setPromotions(prev => [...prev, newPromo]);
    setShowAddModal(false);
    setNewPromotion({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
      minOrderValue: 0,
      maxUses: undefined,
      promoCode: '',
      applicableItems: []
    });
  };

  const handleEditSave = () => {
    if (!editingPromotion) return;
    
    setPromotions(prev => 
      prev.map(promo => 
        promo.id === editingPromotion.id ? editingPromotion : promo
      )
    );
    setShowEditModal(false);
    setEditingPromotion(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(prev => prev.filter(promo => promo.id !== id));
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Promotions Management</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your canteen's promotional offers and discounts</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setPromotions(staticPromotions)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              Refresh
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
            >
              + Add New Promotion
            </button>
          </div>
        </div>

        {promotions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No promotions found. Add some promotions to attract more customers!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => (
              <div 
                key={promo.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{promo.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {promo.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    promo.active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Discount:</span>{' '}
                    {promo.type === 'percentage' ? `${promo.value}% off` : `₹${promo.value} off`}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Valid:</span>{' '}
                    {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                  </p>
                  {promo.minOrderValue > 0 && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Min. Order:</span> ₹{promo.minOrderValue}
                    </p>
                  )}
                  {promo.maxUses && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Usage:</span> {promo.currentUses}/{promo.maxUses}
                    </p>
                  )}
                  {promo.promoCode && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Code:</span> {promo.promoCode}
                    </p>
                  )}
                </div>

                {promo.applicableItems.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Applicable Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {promo.applicableItems.map((item) => (
                        <span 
                          key={item.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => {
                      setEditingPromotion(promo);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(promo.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Promotion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Promotion</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newPromotion.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount Type *
                  </label>
                  <select
                    name="type"
                    value={newPromotion.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="percentage">Percentage Off</option>
                    <option value="fixed">Fixed Amount Off</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {newPromotion.type === 'percentage' ? 'Percentage Off *' : 'Amount Off (₹) *'}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={newPromotion.value}
                    onChange={handleInputChange}
                    min="0"
                    max={newPromotion.type === 'percentage' ? "100" : undefined}
                    step={newPromotion.type === 'percentage' ? "1" : "0.01"}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum Order Value (₹)
                  </label>
                  <input
                    type="number"
                    name="minOrderValue"
                    value={newPromotion.minOrderValue}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={newPromotion.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={newPromotion.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Uses
                  </label>
                  <input
                    type="number"
                    name="maxUses"
                    value={newPromotion.maxUses}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    name="promoCode"
                    value={newPromotion.promoCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white uppercase"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newPromotion.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the promotion details..."
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Applicable Items
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <label key={item.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newPromotion.applicableItems.some(i => i.id === item.id)}
                          onChange={() => handleItemSelection(item.id, item.name)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave empty to apply to all items
                </p>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={newPromotion.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPromotion}
                disabled={!newPromotion.name || !newPromotion.value || !newPromotion.startDate || !newPromotion.endDate}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}