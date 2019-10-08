import React from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import * as R from 'ramda';
import { Card, Loader, Heading, Label, Paragraph, Table } from '@8base/boost';

import * as sharedGraphQL from 'shared/graphql';
import { InfoSpacer } from 'shared/styled';

// for some reason useParams hook doesn't work
// https://github.com/ReactTraining/react-router/issues/6944
export const Order = withRouter(({ match }) => {
  const { loading, error, data } = useQuery(sharedGraphQL.ORDER_QUERY, {
    variables: { id: match.params.id },
  });

  const fields = [
    { path: ['client', 'firstName'], label: 'Client' },
    { path: ['address'], label: 'Address' },
    { path: ['deliveryDt'], label: 'Delivery Date' },
    { path: ['comment'], label: 'Comment' },
    { path: ['status'], label: 'Status' },
  ];

  if (loading)
    return (
      <Card stretch>
        <Loader stretch />
      </Card>
    );

  if (error)
    return (
      <Card stretch>
        <Card.Body>{error.message}</Card.Body>
      </Card>
    );

  return (
    <Card stretch>
      <Card.Header>
        <Heading type="h4">Order ID: {match.params.id}</Heading>
      </Card.Header>
      <Card.Body>
        <Heading type="h4">Order Info:</Heading>
        {fields.map(field => (
          <InfoSpacer>
            <Label kind="secondary" text={field.label} />
            <Paragraph>{R.pathOr([], field.path, data.order) || '-'}</Paragraph>
          </InfoSpacer>
        ))}
      </Card.Body>
      <Card.Footer>
        <Heading type="h4">Order Items:</Heading>
        <InfoSpacer>
          <Table>
            <Table.Header columns="repeat(4, 1fr) 60px">
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Product Name</Table.HeaderCell>
              <Table.HeaderCell>Product Price</Table.HeaderCell>
            </Table.Header>
            <Table.Body data={R.pathOr([], ['orderItems', 'items'], data.order)}>
              {orderItem => (
                <Table.BodyRow columns="repeat(4, 1fr) 60px" key={orderItem.id}>
                  {console.log('orderItem', orderItem)}
                  <Table.BodyCell>{R.pathOr('Unititled', ['quantity'], orderItem)}</Table.BodyCell>
                  <Table.BodyCell>{R.pathOr('Unititled', ['product', 'name'], orderItem)}</Table.BodyCell>
                  <Table.BodyCell>{R.pathOr('Unititled', ['product', 'price'], orderItem)}</Table.BodyCell>
                </Table.BodyRow>
              )}
            </Table.Body>
          </Table>
        </InfoSpacer>
      </Card.Footer>
    </Card>
  );
});
