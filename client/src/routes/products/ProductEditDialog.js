import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, ModalContext, InputField } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';
import { FileInputField } from 'shared/components';

const PRODUCT_EDIT_DIALOG_ID = 'PRODUCT_EDIT_DIALOG_ID';

class ProductEditDialog extends React.Component {
  static contextType = ModalContext;

  onCreateSubmit = id => async data => {
    await this.props.productUpdate({ variables: { data: { ...data, id } } });

    this.context.closeModal(PRODUCT_EDIT_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(PRODUCT_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="Edit Product" onClose={this.onClose} />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Field name="name" label="Name" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="price" label="Price" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="description" label="Description" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="picture" label="Picture" component={FileInputField} />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" loading={submitting}>
          Save Changes
        </Button>
      </Dialog.Footer>
    </form>
  );

  renderForm = ({ args }) => {
    return (
      <Form
        type="UPDATE"
        tableSchemaName="Products"
        onSubmit={this.onCreateSubmit(args.initialValues.id)}
        initialValues={args.initialValues}
      >
        {this.renderFormContent}
      </Form>
    );
  };

  render() {
    return (
      <Dialog id={PRODUCT_EDIT_DIALOG_ID} size="sm">
        {this.renderForm}
      </Dialog>
    );
  }
}

ProductEditDialog = graphql(sharedGraphQL.PRODUCT_UPDATE_MUTATION, {
  name: 'productUpdate',
  options: {
    refetchQueries: ['ProductsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Product successfuly update',
    },
  },
})(ProductEditDialog);

ProductEditDialog.id = PRODUCT_EDIT_DIALOG_ID;

export { ProductEditDialog };
