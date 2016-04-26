import React, { Component } from 'react';
import ClientForm from '../../containers/ClientForm';
import ClientList from '../../containers/ClientList';
import ClientStat from '../../containers/ClientStat';

export default class Clients extends Component {

	render () {
		return (
			<div>
				<h1>Clients			
					<button onClick={() => this.props.fetchClients()}
									className="btn brn-block btn-info">Refresh</button>	
				</h1>
				<ClientForm />
				<ClientList />
				<ClientStat />
			</div>
		);
	}

}
