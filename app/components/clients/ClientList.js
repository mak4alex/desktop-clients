import React, { Component, PropTypes } from 'react';
import Client from './Client';

class ClientList extends Component {

  componentDidMount() {
    const { fetchClients } = this.props;
    fetchClients();
  }

  render () {
    const { clients, deleteClient, editClient, cancelEdit, 
            updateClient, closeErrorMessage } = this.props;

    let errorMessage = (<span></span>);
    if (clients.isError) {
      errorMessage = (
        <div className="alert alert-danger">
          <button onClick={e=>{e.preventDefault(); closeErrorMessage()}} 
                  className="close">
            <span aria-hidden="true">&times;</span>
          </button>
          Error! {clients.errorMessage.responseText}
        </div>
      );
    }

    return (
      <div>       
        <span>{ clients.isFetching ? 'Data Fetching' : ''}</span>
        { errorMessage }
      

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>sex</th>
              <th>id number</th>
              <th>phone</th>
              <th>address</th>
              <th>created at</th>
              <th>updated at</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.entities.map(client =>
              <Client key={client.id} {...client}
                    deleteClient={deleteClient} editClient={editClient}
                    cancelEdit={cancelEdit} updateClient={updateClient} />
            )}
          </tbody>
        </table>
      </div>
    );

  }

}

ClientList.propTypes = {
  clients: PropTypes.shape({
    entities: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sex: PropTypes.bool.isRequired,
      phone: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired
    }).isRequired).isRequired,
    isFetching: PropTypes.bool.isRequired,
    isPosting: PropTypes.bool.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired
  }).isRequired
};

export default ClientList;
