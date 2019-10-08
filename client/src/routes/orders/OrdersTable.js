import React from 'react';
import { compose } from 'recompose';
import * as R from 'ramda';
import { Table, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import * as sharedGraphQL from 'shared/graphql';

import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';

const formatDatePiece = piece => (piece < 10 ? `0${piece}` : piece);

const formatDate = dateStr => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `
    ${formatDatePiece(day)}/${formatDatePiece(month)}/${year},
    ${formatDatePiece(hours)}:${formatDatePiece(minutes)}
  `;
};

const calculateOrderPrice = orderItems =>
  orderItems.reduce((acc, cur) => {
    return acc + cur.product.price * cur.quantity;
  }, 0);

let OrdersTable = ({ orders, openModal, closeModal }) => {
  return (
    <Table>
      <Table.Header columns="repeat(5, 1fr) 60px">
        <Table.HeaderCell>Client</Table.HeaderCell>
        <Table.HeaderCell>Address</Table.HeaderCell>
        <Table.HeaderCell>DeliveryDt</Table.HeaderCell>
        <Table.HeaderCell>Price</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell />
      </Table.Header>

      <Table.Body
        loading={orders.loading}
        data={R.pathOr([], ['ordersList', 'items'], orders)}
        action="Create Order"
        onActionClick={() => openModal(OrderCreateDialog.id)}
      >
        {order => (
          <Table.BodyRow columns="repeat(5, 1fr) 60px" key={order.id}>
            <Table.BodyCell>{R.pathOr('Unititled', ['client', 'firstName'], order)}</Table.BodyCell>
            <Table.BodyCell>{R.pathOr('Unititled', ['address'], order)}</Table.BodyCell>
            <Table.BodyCell>{formatDate(R.pathOr('Unititled', ['deliveryDt'], order))}</Table.BodyCell>
            <Table.BodyCell>
              {calculateOrderPrice(R.pathOr('Unititled', ['orderItems', 'items'], order))}
            </Table.BodyCell>
            <Table.BodyCell>{R.pathOr('Unititled', ['status'], order)}</Table.BodyCell>
            <Table.BodyCell>
              <Dropdown defaultOpen={false}>
                <Dropdown.Head>
                  <Icon name="More" color="LIGHT_GRAY2" />
                </Dropdown.Head>
                <Dropdown.Body pin="right">
                  {({ closeDropdown }) => (
                    <Menu>
                      <Menu.Item>
                        <Link to={`/client/${order.id}`}>Open</Link>
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          openModal(OrderDeleteDialog.id, { id: order.id });
                          closeDropdown();
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  )}
                </Dropdown.Body>
              </Dropdown>
            </Table.BodyCell>
          </Table.BodyRow>
        )}
      </Table.Body>
    </Table>
  );
};

OrdersTable = compose(
  withModal,
  graphql(sharedGraphQL.ORDERS_LIST_QUERY, { name: 'orders' })
)(OrdersTable);

export { OrdersTable };
