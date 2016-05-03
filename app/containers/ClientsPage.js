import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Clients from '../components';
import * as Actions from '../actions';

function mapStateToProps(state) {
  return {
    clients: state.clients
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);
