import {
	REQ_GET_CLIENTS, RES_GET_CLIENTS_SUC, RES_GET_CLIENTS_ERR, EDIT_CLIENT,
	CANCEL_EDIT, REQ_DELETE_CLIENT, RES_DELETE_CLIENT_SUC,	RES_DELETE_CLIENT_ERR,
	REQ_POST_CLIENT, RES_POST_CLIENT_SUC, RES_POST_CLIENT_ERR,
	REQ_UPDATE_CLIENT, RES_UPDATE_CLIENT_SUC, RES_UPDATE_CLIENT_ERR,
	CLOSE_ERROR_MESSAGE } from '../actions';

let initialState = {
	entities: [],
	meta: {
		pagination: {
			total_pages: 0,
			page: 0
		}
	},
	errorMessage: {},
	isError: false,
	isFetching: false,
	isDeleting: false,
	isPosting: false,
	isUpdating: false
};

const clients = (state = initialState, action) => {
	console.log(state, action);
	

	switch(action.type) {
		case REQ_GET_CLIENTS:
			return Object.assign({}, state, {
				isFetching: true
			});
		case RES_GET_CLIENTS_SUC:
			return Object.assign({}, state, {
				entities: action.clients,
				meta: action.meta,
				isFetching: false
			});
		case RES_GET_CLIENTS_ERR:
			return Object.assign({}, state, {
				isError: true,
				isFetching: false
			})
		case REQ_POST_CLIENT:
			return Object.assign({}, state, {
				isPosting: true
			});
		case RES_POST_CLIENT_SUC:
			return Object.assign({}, state, {
				entities: [	action.client, ...state.entities ],
				isPosting: false
			});	
		case RES_POST_CLIENT_ERR:
			return Object.assign({}, state, {
				isError: true,
				isPosting: false,
				errorMessage: action.errorMessage
			});	
		case EDIT_CLIENT:
			return Object.assign({}, state, {
				entities: state.entities.map(client => {
					if( client.id === action.id ) {
						return Object.assign({}, client, {
							isEditing: true
						});
					}
					return client;
				})
			});
		case CANCEL_EDIT:
			return Object.assign({}, state, {
				entities: state.entities.map(client => {
				if( client.id === action.id ) {
					return Object.assign({}, client, {
						isEditing: false
						});
					}
					return client;
				})
			});
		case REQ_UPDATE_CLIENT:
			return Object.assign({}, state, {
				isUpdating: true
			});
		case RES_UPDATE_CLIENT_SUC:
			return Object.assign({}, state, {
				entities: state.entities.map(client => {
					if( client.id === action.client.id ) {
						return Object.assign({}, action.client);
					}
					return client;
				}),
				isUpdating: false
			});
		case RES_UPDATE_CLIENT_ERR:
			return Object.assign({}, state, {
				isError: true,
				isUpdating: false,
				errorMessage: action.errorMessage
			});				
		case REQ_DELETE_CLIENT:
			return Object.assign({}, state, {
				isDeleting: true
			});				
		case RES_DELETE_CLIENT_SUC:
			return Object.assign({}, state, {
				entities: state.entities.filter(i => i.id !== action.id),
				isDeleting: false
			});
		case RES_DELETE_CLIENT_ERR:
			return Object.assign({}, state, {
				isError: true,
				isDeleting: false
			});
		case CLOSE_ERROR_MESSAGE:
			return Object.assign({}, state, {
				isError: false,
				errorMessage: {}
			});
		default:
			return state;
	}

};

export default clients;
