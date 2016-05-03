import React, { Component } from 'react';
import ClientForm from './ClientForm';
import ClientList from './ClientList';
import ClientStat from './ClientStat';


export default class Clients extends Component {

  componentDidMount() {
    this.props.checkRestServer();
    setInterval(() => {
      this.props.checkRestServer();
    }, 10000);
  }

  render() {
    const label = this.props.clients.isServerOnline ?
      (<span className="label label-success">Online</span>) :
      (<span className="label label-default">Offline</span>);

    return (
      <div>
        <h1>Clients {label}
          <button onClick={this.props.syncDBs}
            className="btn pull-right btn-info btn-lg"
            disabled={!this.props.clients.isServerOnline}
          >
            Sync
          </button>
        </h1>
        <ClientForm {...this.props} />
        <ClientList {...this.props} />
        <ClientStat {...this.props} />
      </div>
    );
  }

}
