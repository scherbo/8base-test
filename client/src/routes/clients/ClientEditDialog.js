import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, ModalContext, InputField } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const CLIENT_EDIT_DIALOG_ID = 'CLIENT_EDIT_DIALOG_ID';

class ClientEditDialog extends React.Component {
  static contextType = ModalContext;

  onCreateSubmit = id => async (data) => {
    await this.props.clientUpdate({ variables: { data: { ...data, id } }});

    this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="Edit Client" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Field
              name="firstName"
              label="First name"
              component={ InputField }
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="lastName"
              label="Last name"
              component={ InputField }
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="email"
              label="Email"
              component={ InputField }
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="phone"
              label="Phone"
              component={ InputField }
              mask="+7 (999) 999-99-99"
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="birthday"
              label="Birthday"
              component={ InputField }
              mask="9999-99-99"
            />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ this.onClose }>Cancel</Button>
        <Button color="primary" type="submit" loading={ submitting }>Create Client</Button>
      </Dialog.Footer>
    </form>
  );

  renderForm = ({ args }) => {
    return (
      <Form type="UPDATE" tableSchemaName="Clients" onSubmit={ this.onCreateSubmit(args.initialValues.id) } initialValues={args.initialValues}>
        { this.renderFormContent }
      </Form>
    )
  }

  render() {
    return (
      <Dialog id={ CLIENT_EDIT_DIALOG_ID } size="sm">
        { this.renderForm }
      </Dialog>
    );
  }
}

ClientEditDialog = graphql(sharedGraphQL.CLIENT_UPDATE_MUTATION, {
  name: 'clientUpdate',
  options: {
    refetchQueries: ['ClientsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Client successfuly update'
    },
  },
})(ClientEditDialog);

ClientEditDialog.id = CLIENT_EDIT_DIALOG_ID;

export { ClientEditDialog };
