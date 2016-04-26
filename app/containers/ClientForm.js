import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ClientForm from '../components/clients/ClientForm';
import * as Actions from '../actions';

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(null, mapDispatchToProps)(ClientForm);