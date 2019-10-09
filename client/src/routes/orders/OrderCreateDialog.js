import React from 'react';
import { Form, Field, FieldArray } from '@8base/forms';
import {
  Dialog,
  Grid,
  Button,
  SelectField,
  ModalContext,
  InputField,
  DateInputField,
  DateInput,
  Icon,
} from '@8base/boost';
import { Query, graphql } from 'react-apollo';
import { css } from '@emotion/core';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const ORDER_CREATE_DIALOG_ID = 'ORDER_CREATE_DIALOG_ID';

class OrderCreateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = async data => {
    await this.props.orderCreate({ variables: { data } });

    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="New Order" onClose={this.onClose} />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Query query={sharedGraphQL.CLIENTS_LIST_QUERY}>
              {({ data, loading }) => (
                <Field
                  name="client"
                  label="Client"
                  placeholder="Select a client"
                  component={SelectField}
                  loading={loading}
                  options={
                    loading
                      ? []
                      : (data.clientsList.items || []).map(client => ({
                          value: client.id,
                          label: `${client.firstName} ${client.lastName}`,
                        }))
                  }
                  stretch
                />
              )}
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Query query={sharedGraphQL.PRODUCTS_LIST_QUERY}>
              {({ data, loading }) => (
                <FieldArray name="orderItems">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <Grid.Layout
                          inline
                          gap="xs"
                          columns="minmax(200px, 1fr) 75px auto"
                          key={name}
                          css={css`
                            &:not(:last-child) {
                              margin-bottom: 8px;
                            }
                          `}
                        >
                          <Grid.Box>
                            <Field
                              name={`${name}.product`}
                              label="Order Items"
                              placeholder="Select a product"
                              component={SelectField}
                              loading={loading}
                              options={
                                loading
                                  ? []
                                  : (data.productsList.items || []).map(product => ({
                                      value: product.id,
                                      label: product.name,
                                    }))
                              }
                            />
                          </Grid.Box>
                          <Grid.Box>
                            <Field name={`${name}.quantity`} label="Quantity" component={InputField} />
                          </Grid.Box>
                          <Grid.Box alignSelf="end">
                            <Button type="button" size="sm" color="danger" squared onClick={() => fields.remove(index)}>
                              <Icon name="Trashcan" />
                            </Button>
                          </Grid.Box>
                        </Grid.Layout>
                      ))}
                      <Button type="button" size="sm" onClick={() => fields.push({})}>
                        Add
                      </Button>
                    </>
                  )}
                </FieldArray>
              )}
            </Query>
          </Grid.Box>
          <Grid.Box>
            <Field name="address" label="Address" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="deliveryDt" label="Delivery Date" withTime component={DateInputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="comment" label="Comment" component={InputField} />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" loading={submitting}>
          Create Order
        </Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={ORDER_CREATE_DIALOG_ID} size="sm">
        <Form type="CREATE" tableSchemaName="Orders" onSubmit={this.onSubmit}>
          {this.renderFormContent}
        </Form>
      </Dialog>
    );
  }
}

OrderCreateDialog = graphql(sharedGraphQL.ORDER_CREATE_MUTATION, {
  name: 'orderCreate',
  options: {
    refetchQueries: ['OrdersList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Order successfuly created',
    },
  },
})(OrderCreateDialog);

OrderCreateDialog.id = ORDER_CREATE_DIALOG_ID;

export { OrderCreateDialog };
