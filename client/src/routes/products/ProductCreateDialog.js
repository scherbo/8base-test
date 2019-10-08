import React from 'react';
import { Form, Field, Fi } from '@8base/forms';
import { Dialog, Grid, Button, ModalContext, InputField } from '@8base/boost';
// import { FileInput } from '@8base/file-input'
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';
import { FileInputField } from 'shared/components';

const PRODUCT_CREATE_DIALOG_ID = 'PRODUCT_CREATE_DIALOG_ID';

class ProductCreateDialog extends React.Component {
  static contextType = ModalContext;

  componentDidUpdate() {
    console.log(this.props);
  }

  onSubmit = async data => {
    await this.props.productCreate({ variables: { data } });

    this.context.closeModal(PRODUCT_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(PRODUCT_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="New Product" onClose={this.onClose} />
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
          Create Product
        </Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={PRODUCT_CREATE_DIALOG_ID} size="sm">
        <Form type="CREATE" tableSchemaName="Products" onSubmit={this.onSubmit}>
          {this.renderFormContent}
        </Form>
      </Dialog>
    );
  }
}

ProductCreateDialog = graphql(sharedGraphQL.PRODUCT_CREATE_MUTATION, {
  name: 'productCreate',
  options: {
    refetchQueries: ['ProductsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Product successfuly created',
    },
  },
})(ProductCreateDialog);

ProductCreateDialog.id = PRODUCT_CREATE_DIALOG_ID;

export { ProductCreateDialog };
