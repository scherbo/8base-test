import React from 'react';
import { Card, Heading } from '@8base/boost';

import { ProductsTable } from './ProductsTable';
import { ProductCreateDialog } from './ProductCreateDialog';
import { ProductEditDialog } from './ProductEditDialog';
import { ProductDeleteDialog } from './ProductDeleteDialog';

const Products = () => (
  <Card padding="md" stretch>
    <Card.Header>
      <Heading type="h4" text="Products" />
    </Card.Header>

    <ProductCreateDialog />
    <ProductEditDialog />
    <ProductDeleteDialog />

    <Card.Body padding="none" stretch scrollable>
      <ProductsTable />
    </Card.Body>
  </Card>
);

export { Products };
