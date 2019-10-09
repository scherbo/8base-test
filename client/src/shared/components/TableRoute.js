import React from 'react';
import { Card, Loader, Heading, NoData } from '@8base/boost';

export const TableRoute = ({ loading, error, data, routeName, children }) => {
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

  if (!data) {
    return (
      <Card stretch>
        <Card.Header>
          <Heading type="h4">{routeName} not found</Heading>
        </Card.Header>
        <Card.Body stretch>
          <NoData />
        </Card.Body>
      </Card>
    );
  }

  return children;
};
