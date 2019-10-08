import gql from 'graphql-tag';

export const CLIENTS_LIST_QUERY = gql`
  query ClientsList {
    clientsList {
      items {
        id
        firstName
        lastName
        email
        phone
        birthday
        orders {
          count
        }
      }
    }
  }
`;

export const CLIENT_QUERY = gql`
  query Client($id: ID!) {
    client(id: $id) {
      firstName
      lastName
      email
      phone
      birthday
      orders {
        items {
          id
          address
          deliveryDt
          comment
          status
        }
      }
    }
  }
`;

export const CLIENT_CREATE_MUTATION = gql`
  mutation ClientCreate($data: ClientCreateInput!) {
    clientCreate(data: $data) {
      id
    }
  }
`;

export const CLIENT_UPDATE_MUTATION = gql`
  mutation ClientUpdate($data: ClientUpdateInput!) {
    clientUpdate(data: $data) {
      id
    }
  }
`;

export const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete($id: ID!) {
    clientDelete(data: { id: $id }) {
      success
    }
  }
`;

export const ORDERS_LIST_QUERY = gql`
  query OrdersList {
    ordersList {
      items {
        id
        client {
          id
          firstName
        }
        address
        deliveryDt
        comment
        status
        orderItems {
          items {
            quantity
            product {
              name
              price
            }
          }
        }
      }
    }
  }
`;

export const ORDER_QUERY = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      address
      deliveryDt
      comment
      status
      client {
        id
        firstName
      }
      orderItems {
        items {
          id
          quantity
          product {
            id
            name
            price
          }
        }
      }
    }
  }
`;

export const ORDER_CREATE_MUTATION = gql`
  mutation OrderCreate($data: OrderCreateInput!) {
    orderCreate(data: $data) {
      id
    }
  }
`;

export const ORDER_DELETE_MUTATION = gql`
  mutation OrderDelete($id: ID!) {
    orderDelete(data: { id: $id }) {
      success
    }
  }
`;

export const PRODUCTS_LIST_QUERY = gql`
  query ProductsList {
    productsList {
      items {
        id
        name
        price
      }
    }
  }
`;
