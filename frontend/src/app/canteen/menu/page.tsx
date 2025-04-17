'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  description?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  preparationTime?: number;
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showActionConfirmModal, setShowActionConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: '',
    available: true,
    description: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    preparationTime: 15
  });

  // Use a fixed canteen ID for now (in a real app, this would come from auth context)
  const canteenId = 1;

  const categories = ['Breakfast', 'Main Course', 'Snacks', 'Beverages', 'Desserts'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    setLoading(true);
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetMenuItems($canteenId: Int!) {
              getMenuItemsByCanteen(canteenId: $canteenId) {
                id
                name
                description
                price
                category
                isAvailable
                isVegetarian
                isVegan
                isGlutenFree
                preparationTime
                imageUrl
              }
            }
          `,
          variables: {
            canteenId: canteenId,
          },
        }),
      });

      const result = await response.json();
      console.log('Menu items response:', result);
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      // Transform the data to match our frontend structure
      const transformedItems = result.data.getMenuItemsByCanteen.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        category: item.category,
        available: item.isAvailable,
        description: item.description,
        isVegetarian: item.isVegetarian,
        isVegan: item.isVegan,
        isGlutenFree: item.isGlutenFree,
        preparationTime: item.preparationTime,
        imageUrl: item.imageUrl
      }));
      
      setMenuItems(transformedItems);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      if (showEditModal && editingItem) {
        setEditingItem(prev => ({ ...prev!, [name]: checked }));
      } else {
        setNewItem(prev => ({ ...prev, [name]: checked }));
      }
    } else if (name === 'price' || name === 'preparationTime') {
      const numValue = Number(value);
      if (showEditModal && editingItem) {
        setEditingItem(prev => ({ ...prev!, [name]: numValue }));
      } else {
        setNewItem(prev => ({ ...prev, [name]: numValue }));
      }
    } else {
      if (showEditModal && editingItem) {
        setEditingItem(prev => ({ ...prev!, [name]: value }));
      } else {
        setNewItem(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleAddItem = () => {
    showConfirmModal('Are you sure you want to add this menu item?', async () => {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation AddMenuItem($input: MenuItemInput!) {
                addMenuItem(input: $input) {
                  id
                  name
                  description
                  price
                  category
                  isAvailable
                  isVegetarian
                  isVegan
                  isGlutenFree
                  preparationTime
                  imageUrl
                }
              }
            `,
            variables: {
              input: {
                name: newItem.name,
                description: newItem.description || "",
                price: newItem.price,
                category: newItem.category,
                isAvailable: newItem.available,
                isVegetarian: newItem.isVegetarian,
                isVegan: newItem.isVegan,
                isGlutenFree: newItem.isGlutenFree,
                preparationTime: newItem.preparationTime,
                canteenId: canteenId
              }
            },
          }),
        });

        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        // Transform the returned item to match our frontend structure
        const createdItem = result.data.addMenuItem;
        const transformedItem = {
          id: createdItem.id.toString(),
          name: createdItem.name,
          price: createdItem.price,
          category: createdItem.category,
          available: createdItem.isAvailable,
          description: createdItem.description,
          isVegetarian: createdItem.isVegetarian,
          isVegan: createdItem.isVegan,
          isGlutenFree: createdItem.isGlutenFree,
          preparationTime: createdItem.preparationTime,
          imageUrl: createdItem.imageUrl
        };
        
        // Update the local state with the new item from the server
        setMenuItems(prev => [...prev, transformedItem]);
        
        setShowAddModal(false);
        setNewItem({
          name: '',
          price: 0,
          category: '',
          available: true,
          description: '',
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          preparationTime: 15
        });
      } catch (err) {
        console.error('Error adding menu item:', err);
        alert('Failed to add menu item. Please try again.');
      }
    });
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem({...item});
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!editingItem) return;
    
    showConfirmModal('Are you sure you want to save these changes?', async () => {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation UpdateMenuItem($id: Int!, $input: MenuItemInput!) {
                updateMenuItem(id: $id, input: $input) {
                  id
                  name
                  description
                  price
                  category
                  isAvailable
                  isVegetarian
                  isVegan
                  isGlutenFree
                  preparationTime
                  imageUrl
                }
              }
            `,
            variables: {
              id: parseInt(editingItem.id),
              input: {
                name: editingItem.name,
                description: editingItem.description || "",
                price: editingItem.price,
                category: editingItem.category,
                isAvailable: editingItem.available,
                isVegetarian: editingItem.isVegetarian,
                isVegan: editingItem.isVegan,
                isGlutenFree: editingItem.isGlutenFree,
                preparationTime: editingItem.preparationTime,
                canteenId: canteenId
              }
            },
          }),
        });

        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        // Transform the returned item to match our frontend structure
        const updatedItem = result.data.updateMenuItem;
        const transformedItem = {
          id: updatedItem.id.toString(),
          name: updatedItem.name,
          price: updatedItem.price,
          category: updatedItem.category,
          available: updatedItem.isAvailable,
          description: updatedItem.description,
          isVegetarian: updatedItem.isVegetarian,
          isVegan: updatedItem.isVegan,
          isGlutenFree: updatedItem.isGlutenFree,
          preparationTime: updatedItem.preparationTime,
          imageUrl: updatedItem.imageUrl
        };
        
        // Update the local state with the updated item from the server
        setMenuItems(prev => 
          prev.map(item => 
            item.id === editingItem.id ? transformedItem : item
          )
        );
        setShowEditModal(false);
        setEditingItem(null);
      } catch (err) {
        console.error('Error updating menu item:', err);
        alert('Failed to update menu item. Please try again.');
      }
    });
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    
    // Call the GraphQL mutation to delete the item
    (async () => {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation DeleteMenuItem($id: Int!) {
                deleteMenuItem(id: $id)
              }
            `,
            variables: {
              id: parseInt(itemToDelete),
            },
          }),
        });

        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        // If deletion was successful, update the local state
        if (result.data.deleteMenuItem) {
          setMenuItems(prev => prev.filter(item => item.id !== itemToDelete));
          setShowDeleteConfirmModal(false);
          setItemToDelete(null);
        } else {
          throw new Error('Failed to delete menu item');
        }
      } catch (err) {
        console.error('Error deleting menu item:', err);
        alert('Failed to delete menu item. Please try again.');
      }
    })();
  };

  const toggleAvailability = async (id: string) => {
    try {
      // Find the current item to get its current availability status
      const currentItem = menuItems.find(item => item.id === id);
      if (!currentItem) return;

      const newAvailability = !currentItem.available;
      
      showConfirmModal(
        `Are you sure you want to mark this item as ${newAvailability ? 'available' : 'unavailable'}?`,
        async () => {
          try {
            // Call the GraphQL mutation
            const response = await fetch('/api/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                query: `
                  mutation UpdateMenuItemAvailability($id: Int!, $isAvailable: Boolean!) {
                    updateMenuItemAvailability(id: $id, isAvailable: $isAvailable) {
                      id
                      isAvailable
                    }
                  }
                `,
                variables: {
                  id: parseInt(id),
                  isAvailable: newAvailability,
                },
              }),
            });

            const result = await response.json();
            
            if (result.errors) {
              throw new Error(result.errors[0].message);
            }
            
            // Update the local state
            setMenuItems(prev => 
              prev.map(item => 
                item.id === id ? { ...item, available: newAvailability } : item
              )
            );
          } catch (err) {
            console.error('Error updating menu item availability:', err);
            alert('Failed to update item availability. Please try again.');
          }
        }
      );
    } catch (err) {
      console.error('Error preparing to update menu item availability:', err);
    }
  };

  const showConfirmModal = (message: string, onConfirm: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => onConfirm);
    setShowActionConfirmModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-xl font-semibold">Loading menu items...</div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-xl font-semibold text-red-500">Error: {error}</div>
    </div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Menu Management</h1>
          <div className="flex space-x-4">
            <button 
              onClick={fetchMenuItems}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              Refresh
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
            >
              + Add New Item
            </button>
          </div>
        </div>

        {menuItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No menu items found. Add some items to get started!
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                      {item.isVegetarian && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">Veg</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.available 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Menu Item</h3>
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
                    value={newItem.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={newItem.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={newItem.preparationTime}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVegetarian"
                    name="isVegetarian"
                    checked={newItem.isVegetarian}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isVegetarian" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Vegetarian
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVegan"
                    name="isVegan"
                    checked={newItem.isVegan}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isVegan" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Vegan
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isGlutenFree"
                    name="isGlutenFree"
                    checked={newItem.isGlutenFree}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isGlutenFree" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Gluten Free
                  </label>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={newItem.available}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Available for Order
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
                onClick={handleAddItem}
                disabled={!newItem.name || !newItem.category || newItem.price === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Menu Item</h3>
              <button 
                onClick={() => setShowEditModal(false)}
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
                    value={editingItem.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editingItem.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={editingItem.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={editingItem.preparationTime || 15}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editingItem.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsVegetarian"
                    name="isVegetarian"
                    checked={editingItem.isVegetarian || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsVegetarian" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Vegetarian
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsVegan"
                    name="isVegan"
                    checked={editingItem.isVegan || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsVegan" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Vegan
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsGlutenFree"
                    name="isGlutenFree"
                    checked={editingItem.isGlutenFree || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="editIsGlutenFree" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Gluten Free
                  </label>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editAvailable"
                  name="available"
                  checked={editingItem.available}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="editAvailable" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Available for Order
                </label>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                disabled={!editingItem.name || !editingItem.category || editingItem.price === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete this menu item? This action cannot be undone.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Action</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {confirmMessage}
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowActionConfirmModal(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmAction();
                    setShowActionConfirmModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}