import React from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import * as R from 'ramda';
import { Card, Loader, Heading, Label, Paragraph, Table } from '@8base/boost'
import styled from '@emotion/styled'

import * as sharedGraphQL from 'shared/graphql';

const ClientInfoSpacer = styled.div`
  padding-top: 2rem;
  padding-right: 2rem;
`;

// for some reason useParams hook doesn't work
// https://github.com/ReactTraining/react-router/issues/6944
export const Client = withRouter(({ match }) => {
  const { loading, error, data } = useQuery(sharedGraphQL.CLIENT_QUERY, {
    variables: { id: match.params.id },
  })

  const fields = [
    { hidden: 'firstName', label: 'First Name' },
    { hidden: 'lastName', label: 'Last Name'},
    { hidden: 'email', label: 'Email' },
    { hidden: 'phone', label: 'Phone' },
    { hidden: 'birthday', label: 'Birthday' },
  ]

  if (loading) return (
    <Card stretch>
      <Loader stretch />
    </Card>
  )

  if (error) return (
    <Card stretch>
      <Card.Body>
        {error.message}
      </Card.Body>
    </Card>
  )

  console.log('DATA', data)
  console.log(R.pathOr([], ['orders', 'items'], data.client))

  return (
    <Card stretch>
      <Card.Header>
        <Heading type='h4'>Client ID: {match.params.id}</Heading>
      </Card.Header>
      <Card.Body>
        <Heading type='h4'>Client Info:</Heading>
        {fields.map(field => (
          <ClientInfoSpacer>
            <Label kind='secondary' text={field.label} />
            <Paragraph>{data.client[field.hidden]}</Paragraph>
          </ClientInfoSpacer>
        ))}
      </Card.Body>
      <Card.Footer>
        <Heading type='h4'>Client Orders:</Heading>
        <ClientInfoSpacer>
          <Table>
            <Table.Header columns="repeat(4, 1fr) 60px">
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>DeliveryDt</Table.HeaderCell>
              <Table.HeaderCell>Comment</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Header>
            <Table.Body data={ R.pathOr([], ['orders', 'items'], data.client) }>
              {
                (order) => (
                  <Table.BodyRow columns="repeat(4, 1fr) 60px" key={order.id}>
                    {console.log('ORDER', order)}
                    <Table.BodyCell>{ R.pathOr('Unititled', ['address'], order) }</Table.BodyCell>
                    <Table.BodyCell>{ R.pathOr('Unititled', ['deliveryDt'], order) }</Table.BodyCell>
                    <Table.BodyCell>{ R.pathOr('Unititled', ['comment'], order) }</Table.BodyCell>
                    <Table.BodyCell>{ R.pathOr('Unititled', ['status'], order) }</Table.BodyCell>
                  </Table.BodyRow>
                )
              }
            </Table.Body>
          </Table>
        </ClientInfoSpacer>
      </Card.Footer>
    </Card>
  )
});
