/**
 * GraphQL queries for complaint functionality
 */

/**
 * Query to get all complaints
 */
export const GET_ALL_COMPLAINTS = `
  query GetAllComplaints {
    getAllComplaints {
      id
      userId
      orderId
      complaintText
      heading
      complaintType
      status
      isEscalated
      responseText
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query to get a specific complaint by ID
 */
export const GET_COMPLAINT_BY_ID = `
  query GetComplaintById($complaintId: Int!) {
    getComplaintById(complaintId: $complaintId) {
      id
      userId
      orderId
      complaintText
      heading
      complaintType
      status
      isEscalated
      responseText
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query to get all complaints for a specific user
 * Note: This query doesn't exist in the backend yet but would be useful to add
 */
export const GET_USER_COMPLAINTS = `
  query GetUserComplaints($userId: Int!) {
    getUserComplaints(userId: $userId) {
      id
      userId
      orderId
      complaintText
      heading
      complaintType
      status
      isEscalated
      responseText
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query to get all complaints for a specific order
 * Note: This query doesn't exist in the backend yet but would be useful to add
 */
export const GET_ORDER_COMPLAINTS = `
  query GetOrderComplaints($orderId: Int!) {
    getOrderComplaints(orderId: $orderId) {
      id
      userId
      orderId
      complaintText
      heading
      complaintType
      status
      isEscalated
      responseText
      createdAt
      updatedAt
    }
  }
`;