/*

this query is for updating the price of an item by the vendor :
*/

export const UPDATE_PRICE = `

mutation UpdateMenuItemPrice($itemId:Int!, $price: Float! , $userEmail :String!){
  updateMenuItemPrice(
    itemId: $itemId, 
    price: $price,
    userEmail: $userEmail
  ) {
    success
    message
  }
}

`



/**
 
this query is to update the availability of an item 
 */

export const UPDATE_AVAILABILITY = 
`
mutation UpdateAvailability($itemId:Int! , $isAvailable :Boolean!,$userEmail :String!){
  updateMenuItemAvailability(itemId: $itemId, isAvailable: $isAvailable, userEmail: $userEmail) {
    success
    message
  }
}
`

export const CREATE_MENU_ITEM = `

mutation CreateMenuItem(
  $userEmail: String!,
  $name: String!,
  $price: Float!,
  $canteenId: Int!,
  $description: String,
  $imageUrl: String,
  $category: String,
  $isVegetarian: Boolean,
  $isFeatured: Boolean
) {
  createMenuItem(
    userEmail: $userEmail,
    name: $name,
    price: $price,
    canteenId: $canteenId,
    description: $description,
    imageUrl: $imageUrl,
    category: $category,
    isVegetarian: $isVegetarian,
    isFeatured: $isFeatured
  ) {
    success
    message
  }
}


`

export const DELETE_MENU_ITEM = `
mutation DeleteMenuItem($itemId: Int!, $userEmail: String!) {
  deleteMenuItem(itemId: $itemId, userEmail: $userEmail) {
    success
    message
  }
}
`

export const TOGGLE_FEATURED_STATUS = `
mutation ToggleFeaturedStatus($itemId: Int!, $userEmail: String!) {
  toggleFeaturedStatus(itemId: $itemId, userEmail: $userEmail) {
    success
    message
  }
}
`

export const UPDATE_PREPARATION_TIME = `
mutation UpdatePreparationTime($itemId: Int!, $preparationTime: Int!, $userEmail: String!) {
  updatePreparationTime(itemId: $itemId, preparationTime: $preparationTime, userEmail: $userEmail) {
    success
    message
  }
}
`

export const UPDATE_CUSTOMIZATION_OPTIONS = `
mutation UpdateCustomizationOptions($itemId: Int!, $customizationOptions: String!, $userEmail: String!) {
  updateCustomizationOptions(itemId: $itemId, customizationOptions: $customizationOptions, userEmail: $userEmail) {
    success
    message
  }
}
`

export const UPDATE_SIZE_VARIATIONS = `
mutation UpdateSizeVariations($itemId: Int!, $sizeVariations: String!, $userEmail: String!) {
  updateSizeVariations(itemId: $itemId, sizeVariations: $sizeVariations, userEmail: $userEmail) {
    success
    message
  }
}
`


