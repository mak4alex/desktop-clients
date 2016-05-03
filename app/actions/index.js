import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import $ from 'jquery';


mongoose.set('debug', true);
const db = mongoose.createConnection('mongodb://localhost/test');
autoIncrement.initialize(db);

const clientSchema = new Schema({
  name: String,
  sex: Boolean,
  id_number: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    unique: true
  },
  address: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});
clientSchema.plugin(autoIncrement.plugin, { model: 'Client', field: 'id', startAt: 1, });
const Client = db.model('Client', clientSchema);

const timerSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  updated_at: {
    type: Date,
    default: new Date('2016-01-01 00:00:00'),
  }
});
const Timer = db.model('Timer', timerSchema);
const timer = new Timer({ id: 1 });
timer.save();

let clientsToServer = null;


export const REQ_GET_CLIENTS = 'REQ_GET_CLIENTS';
const reqGetClients = () => {
  return {
    type: REQ_GET_CLIENTS
  };
};

export const RES_GET_CLIENTS_SUC = 'RES_GET_CLIENTS_SUC';
const resGetClientsSuc = (data) => {
  return {
    type: RES_GET_CLIENTS_SUC,
    clients: data.clients.map(c => { c.isEditing = false; return c; }),
    meta: data.meta
  };
};

export const RES_GET_CLIENTS_ERR = 'RES_GET_CLIENTS_ERR';
const resGetClientsErr = () => {
  return {
    type: RES_GET_CLIENTS_ERR
  };
};


export const FETCH_CLIENTS = 'FETCH_CLIENTS';
export function fetchClients(page = 1) {
  return (dispatch) => {
    dispatch(reqGetClients());
    const perPage = 10;
    const skipCount = perPage * (page - 1);
    return Client.find().limit(10).skip(skipCount).exec((err, clients) => {
      if (err) {
        dispatch(resGetClientsErr());
      } else {
        Client.count({}, (err1, count) => {
          const total_pages = Math.ceil(count / perPage);
          const data = {
            clients: clients.map(client => client.toObject()),
            meta: {
              pagination: {
                total_pages,
                page
              }
            }
          };
          dispatch(resGetClientsSuc(data));
        });
      }
    });
  };
}



export const REQ_POST_CLIENT = 'REQ_POST_CLIENT';
export const reqPostClient = () => {
  return {
    type: REQ_POST_CLIENT
  };
};


export const RES_POST_CLIENT_SUC = 'RES_POST_CLIENT_SUC';
export const resPostClientSuc = (client) => {
  client.isEditing = false;
  return {
    type: RES_POST_CLIENT_SUC,
    client
  };
};


export const RES_POST_CLIENT_ERR = 'RES_POST_CLIENT_ERR';
export const resPostClientErr = (err) => {
  return {
    type: RES_POST_CLIENT_ERR,
    errorMessage: err
  };
};

function addClientLocal(name, sex, id_number, phone, address) {
  return (dispatch) => {
    dispatch(reqPostClient());

    const client = new Client({ name, sex, id_number, phone, address });
    return client.save((err) => {
      if (err) {
        dispatch(resPostClientErr(err.message));
      } else {
        dispatch(resPostClientSuc(client.toObject()));
      }
    });
  };
}

function addClientServer(name, sex, id_number, phone, address) {
  return (dispatch) => {
    dispatch(reqPostClient());

    return $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'https://primary-workspace-mak4alex.c9users.io/api/client',
      data: JSON.stringify({
        client: {
          name, sex, id_number, phone, address
        }
      }),
      dataType: 'json'
    })
    .done((data) => {
      dispatch(resPostClientSuc(data.client));
    })
    .fail((err) => {
      dispatch(resPostClientErr(err));
    });
  };
}

export const ADD_CLIENT = 'ADD_CLIENT';
export function addClient(name, sex, id_number, phone, address) {
  return (dispatch, getState) => {
    if (getState().clients.isServerOnline) {
      addClientServer(name, sex, id_number, phone, address)(dispatch);
    } 
    addClientLocal(name, sex, id_number, phone, address)(dispatch);
  };
}


export const EDIT_CLIENT = 'EDIT_CLIENT';
export const editClient = (id) => {
  return {
    type: EDIT_CLIENT,
    id
  };
};

export const CANCEL_EDIT = 'CANCEL_EDIT';
export const cancelEdit = (id) => {
  return {
    type: CANCEL_EDIT,
    id
  };
};


export const REQ_UPDATE_CLIENT = 'REQ_UPDATE_CLIENT';
const reqUpdateClient = () => {
  return {
    type: REQ_UPDATE_CLIENT
  };
};

export const RES_UPDATE_CLIENT_SUC = 'RES_UPDATE_CLIENT_SUC';
const resUpdateClientSuc = (client) => {
  client.isEditing = false;
  return {
    type: RES_UPDATE_CLIENT_SUC,
    client
  };
};

export const RES_UPDATE_CLIENT_ERR = 'RES_UPDATE_CLIENT_ERR';
const resUpdateClientErr = (error) => {
  return {
    type: RES_UPDATE_CLIENT_ERR,
    errorMessage: error
  };
};

function updateClientLocal(name, sex, id_number, phone, address, updated_at) {
  return (dispatch) => {
    dispatch(reqUpdateClient());

    return Client.findOne({ id_number }, (err, updatedClient) => {
      if (err) {
        return dispatch(resUpdateClientErr(err.message));
      }

      if (!updated_at || new Date(updated_at) >= new Date(updatedClient.updated_at)) {
        updatedClient.name = name;
        updatedClient.sex = sex;
        updatedClient.phone = phone;
        updatedClient.address = address;
        updatedClient.updated_at = Date.now();
        updatedClient.save((err1) => {
          if (err1) {
            dispatch(resUpdateClientErr(err1.message));
          } else {
            dispatch(resUpdateClientSuc(updatedClient.toObject()));
          }
        });
      }      
    });
  };
}

function updateClientServer(name, sex, id_number, phone, address) {
  return (dispatch) => {
    dispatch(reqUpdateClient());

    return $.ajax({
      type: 'PUT',
      contentType: 'application/json',
      url: `https://primary-workspace-mak4alex.c9users.io/api/client/${id_number}`,
      data: JSON.stringify({
        client: {
          name, sex, id_number, phone, address
        }
      }),
      dataType: 'json'
    })
    .done((data) => {
      dispatch(resUpdateClientSuc(data.client));
    })
    .fail((error) => {
      dispatch(resUpdateClientErr(error));
    });
  };
}


export function updateClient(name, sex, id_number, phone, address) {
  return (dispatch, getState) => {
    if (getState().clients.isServerOnline) {
      updateClientServer(name, sex, id_number, phone, address)(dispatch, getState);
    } 
    updateClientLocal(name, sex, id_number, phone, address)(dispatch, getState);
  };
}


export const REQ_DELETE_CLIENT = 'REQ_DELETE_CLIENT';
const reqDeleteClient = () => {
  return {
    type: REQ_DELETE_CLIENT
  };
};

export const RES_DELETE_CLIENT_SUC = 'RES_DELETE_CLIENT_SUC';
const resDeleteClientSuc = (id) => {
  return {
    type: RES_DELETE_CLIENT_SUC,
    id
  };
};

export const RES_DELETE_CLIENT_ERR = 'RES_DELETE_CLIENT_ERR';
const resDeleteClientErr = () => {
  return {
    type: RES_DELETE_CLIENT_ERR,
  };
};

function deleteClientLocal(id_number) {
  return (dispatch) => {
    dispatch(reqDeleteClient());

    return Client.remove({ id_number }, (err) => {
      if (err) {
        dispatch(resDeleteClientErr());
      } else {
        dispatch(resDeleteClientSuc(id_number));
      }
    });
  };
}

function deleteClientServer(id_number) {
  return (dispatch) => {
    dispatch(reqDeleteClient());

    return $.ajax({
      type: 'DELETE',
      url: `https://primary-workspace-mak4alex.c9users.io/api/client/${id_number}`})     
      .done(() => {
        dispatch(resDeleteClientSuc(id_number));
      })
      .fail(() => {
        dispatch(resDeleteClientErr());
      });
  };
}

export const DELETE_CLIENT = 'DELETE_CLIENT';
export function deleteClient(idNumber) {
  return (dispatch, getState) => {
    if (getState().clients.isServerOnline) {
      deleteClientServer(idNumber)(dispatch);      
    }
    deleteClientLocal(idNumber)(dispatch);
  };
}

export const CLOSE_ERROR_MESSAGE = 'CLOSE_ERROR_MESSAGE';
export const closeErrorMessage = () => {
  return {
    type: CLOSE_ERROR_MESSAGE
  };
};


export const REST_SERVER_ONLINE = 'REST_SERVER_ONLINE';
const restServerOnline = () => {
  return {
    type: REST_SERVER_ONLINE,
  };
};

export const REST_SERVER_OFFLINE = 'REST_SERVER_OFFLINE';
const restServerOffline = () => {
  return {
    type: REST_SERVER_OFFLINE,
  };
};

export const SYNC_ERROR = 'SYNC_ERROR';

function mergeDBs(clients) {
  return (dispatch) => {
    console.log('merge', clients);
    clients.forEach((client) => {
      Client.count({ id_number: client.id_number }, (err, count) => {
        if (count === 0) {
          addClientLocal(client.name, client.sex, client.id_number,
            client.phone, client.address)(dispatch);
        } else {          
          updateClientLocal(client.name, client.sex, client.id_number,
            client.phone, client.address, client.updated_at)(dispatch);
        }
      });
    });

    setTimeout(()=> {
      Timer.findOne((err, timerToUpdate) => {
        timerToUpdate.updated_at = Date.now();
        timerToUpdate.save((err1) => {
          fetchClients()(dispatch);

          $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: 'https://primary-workspace-mak4alex.c9users.io/api/clients',
            data: JSON.stringify({
              clients: clientsToServer
            }),
            dataType: 'json'
          })
          .done((data) => {
            console.log('sync succ', data);
          })
          .fail((err2) => {
            console.log('sync err', err2);
          });
        });
      });
    }, 2000);
  };
}

export function syncDBs() {
  return (dispatch) => {
    Timer.findOne((err, t) => {
      const objTimer = t.toObject();
      const date = new Date(objTimer.updated_at).toISOString();

      Client.find().where('updated_at').gt(date).exec((err, clients) => {
        console.log('clients', clients);
        clientsToServer = clients.map(client => client.toObject());
      });

      $.get({
        url: 'http://primary-workspace-mak4alex.c9users.io/api/clients',
        data: {
          sync_at: date,
        },
      })
      .done(data => {
        mergeDBs(data.clients)(dispatch);
      })
      .fail(() => {

      });
    });
  };
}


export function checkRestServer() {
  return (dispatch, getState) => {
    $.ajax({
      url: 'https://primary-workspace-mak4alex.c9users.io/' })
      .done(() => {
        if (!getState().clients.isServerOnline) {
          syncDBs()(dispatch, getState);
        }
        dispatch(restServerOnline());
      })
      .fail(() => {
        dispatch(restServerOffline());
      });
  };
}
