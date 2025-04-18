
/**
 * Query to fetch orders for a user
 */
export const GET_USER_ORDERS = `
  query GetUserOrders($userId: Int!) {
    getUserOrders(userId: $userId) {
      id
      userId
      canteenId
      totalAmount
      status
      orderTime
      confirmedTime
      preparingTime
      readyTime
      deliveryTime
      cancelledTime
      pickupTime
      paymentMethod
      paymentStatus
      customerNote
      cancellationReason
      discount
      phone
      isPreOrder
      items {
        id
        itemId
        quantity
        customizations
        note
      }
    }
  }
`;

export const GET_ALL_ORDERS = `
  query GetAllOrders($userId: Int!) {
    getAllOrders(userId: $userId) {
      user_id
      canteen_id
      subtotal
      tax_amount
      total_amount
      status
      priority
      tax_rate
      payment_status
      payment_method
      payment_id
      cancellation_reason
      cancellation_notes
      pickup_time
      created_at
      updated_at
      items {
        menu_item_id
        menu_item_name
        canteen_id
        canteen_name
        quantity
        unit_price
        total_price
        size {
          name
          price_adjustment
        }
        extras {
          name
          price
        }
        preparation_time
        is_prepared
        special_instructions
        notes
      }
    }
  }
`;

// Get active orders for a user
export const GET_ACTIVE_ORDERS = `
  query GetActiveOrders($userId: Int!) {
    getActiveOrders(userId: $userId) {
      user_id
      canteen_id
      subtotal
      tax_amount
      total_amount
      status
      priority
      tax_rate
      payment_status
      payment_method
      payment_id
      pickup_time
      created_at
      updated_at
      items {
        menu_item_id
        menu_item_name
        canteen_id
        canteen_name
        quantity
        unit_price
        total_price
        size {
          name
          price_adjustment
        }
        extras {
          name
          price
        }
        preparation_time
        is_prepared
        special_instructions
      }
    }
  }
`;

/**
 * Query to fetch orders for a canteen
 */
export const GET_CANTEEN_ORDERS = `
  query GetCanteenOrders($canteenId: Int!) {
    getCanteenOrders(canteenId: $canteenId) {
      id
      userId
      canteenId
      totalAmount
      status
      orderTime
      confirmedTime
      preparingTime
      readyTime
      deliveryTime
      cancelledTime
      pickupTime
      paymentMethod
      paymentStatus
      customerNote
      cancellationReason
      discount
      phone
      isPreOrder
      items {
        id
        itemId
        quantity
        customizations
        note
      }
    }
  }
`;

/**
 * Query to fetch a specific order by ID
 */
export const GET_ORDER_BY_ID = `
  query GetOrderById($orderId: Int!) {
    getOrderById(orderId: $orderId) {
      id
      userId
      canteenId
      totalAmount
      status
      orderTime
      confirmedTime
      preparingTime
      readyTime
      deliveryTime
      cancelledTime
      pickupTime
      paymentMethod
      paymentStatus
      customerNote
      cancellationReason
      discount
      phone
      isPreOrder
      items {
        id
        itemId
        quantity
        customizations
        note
      }
    }
  }
`;

/**
 * Query to fetch orders by status
 */
export const GET_ORDERS_BY_STATUS = `
  query GetOrdersByStatus($status: String!) {
    getOrdersByStatus(status: $status) {
      id
      userId
      canteenId
      totalAmount
      status
      orderTime
      confirmedTime
      preparingTime
      readyTime
      deliveryTime
      cancelledTime
      pickupTime
      paymentMethod
      paymentStatus
      customerNote
      cancellationReason
      discount
      phone
      isPreOrder
      items {
        id
        itemId
        quantity
        customizations
        note
              }
    }
  }
`;