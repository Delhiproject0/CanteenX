export const GET_USER_BY_ID = `
  query getUserById($id: Int!) {
    getUserById(userId: $id) {
      id
      name
      email
      role
      profilePicture
      isVegetarian
      notifPrefs
  }
}
`;