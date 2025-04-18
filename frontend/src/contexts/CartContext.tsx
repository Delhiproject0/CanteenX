import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCartStore, CartItem as ZustandCartItem } from "@/stores/cartStore";

export interface CartItem {
  id: number;
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  canteenId: number;
  canteenName: string;
  image: string;
  customizations?: string[];
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const { 
    cartItems: zustandCartItems,
    addItem: zustandAddItem,
    removeItem: zustandRemoveItem,
    updateItemQuantity: zustandUpdateQuantity,
    clearCart: zustandClearCart,
    getTotalAmount: zustandGetTotalAmount
  } = useCartStore();

  // Improved conversion function from Zustand format to Context format
  const convertZustandToContextItem = useCallback((zustandItem: ZustandCartItem): CartItem => {
    return {
      id: Number(zustandItem.id),
      itemId: Number(zustandItem.id),
      name: zustandItem.name,
      price: zustandItem.price,
      quantity: zustandItem.quantity,
      canteenId: Number(zustandItem.canteenId),
      canteenName: zustandItem.canteenName,
      image: zustandItem.customizations?.notes || "",
      customizations: zustandItem.customizations?.additions
    };
  }, []);

  // Improved conversion function from Context format to Zustand format
  const convertContextToZustandItem = useCallback((contextItem: CartItem): ZustandCartItem => {
    return {
      id: contextItem.id.toString(),
      name: contextItem.name,
      price: contextItem.price,
      quantity: contextItem.quantity,
      canteenId: contextItem.canteenId.toString(),
      canteenName: contextItem.canteenName,
      customizations: {
        additions: contextItem.customizations || [],
        notes: contextItem.image
      }
    };
  }, []);

  // Make sure the effect runs properly to sync cart items
  useEffect(() => {
    try {
      const contextItems = zustandCartItems.map(convertZustandToContextItem);
      setItems(contextItems);
      console.log("Cart updated:", contextItems.length, "items");
    } catch (error) {
      console.error("Error converting cart items:", error);
    }
  }, [zustandCartItems, convertZustandToContextItem]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = useCallback((newItem: CartItem) => {
    const hasItemsFromOtherCanteen = items.some(item => 
      item.canteenId !== newItem.canteenId && items.length > 0
    );
    
    if (hasItemsFromOtherCanteen) {
      toast({
        title: "Cannot add items from multiple canteens",
        description: "Please complete your current order or clear your cart first.",
        variant: "destructive",
      });
      return;
    }

    const zustandItem = convertContextToZustandItem(newItem);
    zustandAddItem(zustandItem);
    
    toast({
      title: "Item added to cart",
      description: `${newItem.name} added to your order`,
    });
  }, [items, toast, zustandAddItem, convertContextToZustandItem]);

  const removeItem = useCallback((id: number) => {
    const itemToRemove = items.find(item => item.id === id);
    if (itemToRemove) {
      zustandRemoveItem(id.toString());
      
      toast({
        title: "Item removed",
        description: `${itemToRemove.name} removed from your order`,
      });
    }
  }, [items, toast, zustandRemoveItem]);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    
    zustandUpdateQuantity(id.toString(), quantity);
  }, [removeItem, zustandUpdateQuantity]);

  const clearCart = useCallback(() => {
    zustandClearCart();
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  }, [toast, zustandClearCart]);

  const checkout = useCallback(() => {
    toast({
      title: "Order placed successfully",
      description: `Your order of ${totalItems} items has been placed`,
    });
    zustandClearCart();
  }, [totalItems, toast, zustandClearCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
