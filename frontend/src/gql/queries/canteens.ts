// src/gql/queries/canteens.ts
import { gql } from '@apollo/client';

export const GET_CANTEEN_MERCHANT = gql`
  query GetCanteenMerchant($canteenId: ID!) {
    getCanteenMerchant(canteenId: $canteenId) {
      id
      name
    }
  }
`;