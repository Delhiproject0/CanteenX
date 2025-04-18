export const GET_ALL_CANTEENS = `
  query GetAllCanteens {
    getAllCanteens {
                id
                name
                location
                email
                contactNumber
                breakfastStart
                breakfastEnd
                lunchStart
                lunchEnd
                dinnerStart
                dinnerEnd
                rating
                ratingCount
                description
                supportsVegetarian
                supportsNonVegetarian
                supportsThali
    }
  }
`;


export const GET_CANTEENS_BY_ID = `
  query GetCanteensById($id: Int!) {
    getCanteenById(canteenId: $id) {
                id
                name
                location
                email
                contactNumber
                breakfastStart
                breakfastEnd
                lunchStart
                lunchEnd
                dinnerStart
                dinnerEnd
                rating
                ratingCount
                description
                supportsVegetarian
                supportsNonVegetarian
                supportsThali
    }
  }
`;