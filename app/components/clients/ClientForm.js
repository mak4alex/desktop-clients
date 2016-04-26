import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';

class ClientForm extends Component {

	constructor(props) {
		super(props);
		this.validatorTypes = {
			name: Joi.string().alphanum().min(3).max(32).required().label('Name'),
			idNumber: Joi.string().regex(/ID\d{7}/).required()
				.options({language:{string:{regex:{base:'Must be like ID1234567.'}}}})
				.label('ID Number'),
			phone: Joi.string().regex(/\+\d{1,3}\(\d{1,2}\)\d{7}/).required()
				.options({language:{string:{regex:{base:'Must be like +123(12)1234567.'}}}})
				.label('Phone'),
			address: Joi.string().max(64).required().label('Address')
		};
		this.getValidatorData = this.getValidatorData.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onReset = this.onReset.bind(this);
	}

	onReset() {
		this.props.clearValidations();
	}

	getValidatorData() {
    return {
      name: ReactDOM.findDOMNode(this.refs.name).value,
      sex: ReactDOM.findDOMNode(this.refs.sex).checked,
      idNumber: ReactDOM.findDOMNode(this.refs.idNumber).value,
      phone: ReactDOM.findDOMNode(this.refs.phone).value,
      address: ReactDOM.findDOMNode(this.refs.address).value
    };
  }
  
  onSubmit (e) {
  	e.preventDefault();
  	this.props.validate((err) => {
			if (!err) {
				this.props.addClient(
					this.getValidatorData().name,
					this.getValidatorData().sex,
					this.getValidatorData().idNumber,
					this.getValidatorData().phone,
					this.getValidatorData().address );
			}
		});
  }

	render () {		
		return (
			<div>
				<form onSubmit={this.onSubmit} className="form-inline">
					<div className="form-group">
						<label htmlFor="name">Name:</label>
						<input type="text" ref="name" className="form-control" id="name"
									 onChange={this.props.handleValidation('name')} />
					</div>
					<div className="checkbox">
						<label htmlFor="sex">Sex:
							<input type="checkbox" ref="sex" id="sex" />
						</label>
					</div>
					<div className="form-group">
						<label htmlFor="idNumber">ID Nubmber:</label>
						<input type="text" ref="idNumber" id="idNumber" className="form-control"
									 onChange={this.props.handleValidation('idNumber')}/>
					</div>
					<div className="form-group">				
						<label htmlFor="phone">Phone:</label>
						<input type="text" ref="phone" id="phone" className="form-control"
									 onChange={this.props.handleValidation('phone')} />
					</div>
					<div className="form-group">	
						<label htmlFor="address">Address:</label>
						<input type="text" ref="address" id="address" className="form-control"
									 onChange={this.props.handleValidation('address')} />
					</div>
						<button type="submit" className="btn btn-primary">Add</button>
						<button type="reset" onClick={this.onReset} className="btn btn-warning">Reset</button>
				</form>
				<div class="alert alert-warning">
					<ul>
						{this.props.getValidationMessages().map( message =>
							<li>{message}</li>
						)}
					</ul>
				</div>
			</div>
		);
	}
}

export default validation(strategy)(ClientForm);
