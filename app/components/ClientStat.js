import React, { Component } from 'react';


export default class ClientStat extends Component {

	render () {
		const { clients, fetchClients } = this.props;

		const totalPages = clients.meta.pagination.total_pages;
		const currentPage = clients.meta.pagination.page;

		return (
			<div className="text-center">
				<nav>
				  <ul className="pagination pagination-lg">
				  	{[...Array(totalPages)].map((x, i) =>
				  		<li key={i + 1} className={ currentPage === (i + 1) ? "active" : ""}>
				  			<a href="#" onClick={e => {
					         e.preventDefault();
					         fetchClients(i + 1);
					       }}>{i + 1}</a>
				  		</li>
					  )}
				  </ul>
				</nav>
			</div>
		);
	}

}
