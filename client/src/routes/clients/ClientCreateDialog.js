import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, ModalContext, InputField } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const CLIENT_CREATE_DIALOG_ID = 'CLIENT_CREATE_DIALOG_ID';

class ClientCreateDialog extends React.Component {
  static contextType = ModalContext;

  componentDidUpdate() {
    console.log(this.props)
  }

  onSubmit = async (data) => {
    await this.props.clientCreate({ variables: { data }});

    this.context.closeModal(CLIENT_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(CLIENT_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={ handleSubmit }>
      <Dialog.Header title="New Client" onClose={ this.onClose } />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          {/* <Grid.Box>
            <Query query={ sharedGraphQL.USERS_LIST_QUERY }>
              {
                ({ data, loading }) => (
                  <Field
                    name="user"
                    label="User"
                    placeholder="Select a user"
                    component={ SelectField }
                    loading={ loading }
                    options={ loading ? [] : (data.usersList.items || []).map((user) => ({ value: user.id, label: `${user.firstName} ${user.lastName}` })) }
                  />
                )
              }
            </Query>
          </Grid.Box> */}
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

  render() {
    return (
      <Dialog id={ CLIENT_CREATE_DIALOG_ID } size="sm">
        <Form type="CREATE" tableSchemaName="Clients" onSubmit={ this.onSubmit }>
          { this.renderFormContent }
        </Form>
      </Dialog>
    );
  }
}

ClientCreateDialog = graphql(sharedGraphQL.CLIENT_CREATE_MUTATION, {
  name: 'clientCreate',
  options: {
    refetchQueries: ['ClientsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Client successfuly created'
    },
  },
})(ClientCreateDialog);

ClientCreateDialog.id = CLIENT_CREATE_DIALOG_ID;

export { ClientCreateDialog };
