import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ClientStat from '../components/clients/ClientStat';
import * as Actions from '../actions';

function mapStateToProps(state) {
	return {
		clients: state.clients
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientStat);
