/**
 * GraphQL queries related to shopping cart
 */

/**
 * Query to fetch all items in a user's cart
 */
export const getCartItems = `
  query getCartByUserId($userId: Int!) {
    getCartByUserId(userId: $userId) {
    id
    userId
    createdAt
    updatedAt
    pickupDate
    pickupTime
    items {
      id
      cartId
      menuItemId
      quantity
      selectedSize
      selectedExtras
      specialInstructions
      location
      }
    }
  }
`;




