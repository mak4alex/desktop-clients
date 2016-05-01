import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

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
clientSchema.plugin(autoIncrement.plugin, { model: 'Client', field: 'id' });

const Client = db.model('Client', clientSchema);


export const REQ_GET_CLIENTS = 'REQ_GET_CLIENTS';
export const reqGetClients = () => {
  return {
    type: REQ_GET_CLIENTS
  };
};

export const RES_GET_CLIENTS_SUC = 'RES_GET_CLIENTS_SUC';
export const resGetClientsSuc = (data) => {
  return {
    type: RES_GET_CLIENTS_SUC,
    clients: data.clients.map(c => { c.isEditing = false; return c; }),
    meta: data.meta
  };
};

export const RES_GET_CLIENTS_ERR = 'RES_GET_CLIENTS_ERR';
export const resGetClientsErr = () => {
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

export const ADD_CLIENT = 'ADD_CLIENT';
export function addClient(name, sex, id_number, phone, address) {
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
export const reqUpdateClient = () => {
  return {
    type: REQ_UPDATE_CLIENT
  };
};

export const RES_UPDATE_CLIENT_SUC = 'RES_UPDATE_CLIENT_SUC';
export const resUpdateClientSuc = (client) => {
  client.isEditing = false;
  return {
    type: RES_UPDATE_CLIENT_SUC,
    client
  };
};

export const RES_UPDATE_CLIENT_ERR = 'RES_UPDATE_CLIENT_ERR';
export const resUpdateClientErr = (error) => {
  return {
    type: RES_UPDATE_CLIENT_ERR,
    errorMessage: error
  };
};

export const UPDATE_CLIENT = 'UPDATE_CLIENT';
export function updateClient(id, name, sex, id_number, phone, address) {
  return (dispatch) => {
    dispatch(reqUpdateClient());

    return Client.findOne({ id }, (err, client) => {
      if (err) {
        return dispatch(resUpdateClientErr(err.message));
      }
      client.name = name;
      client.sex = sex;
      client.id_number = id_number;
      client.phone = phone;
      client.address = address;
      client.updated_at = Date.now();
      client.save((err1) => {
        if (err1) {
          dispatch(resUpdateClientErr(err1.message));
        } else {
          dispatch(resUpdateClientSuc(client.toObject()));
        }
      });
    });
  };
}

export const REQ_DELETE_CLIENT = 'REQ_DELETE_CLIENT';
export const reqDeleteClient = () => {
  return {
    type: REQ_DELETE_CLIENT
  };
};

export const RES_DELETE_CLIENT_SUC = 'RES_DELETE_CLIENT_SUC';
export const resDeleteClientSuc = (id) => {
  return {
    type: RES_DELETE_CLIENT_SUC,
    id
  };
};

export const RES_DELETE_CLIENT_ERR = 'RES_DELETE_CLIENT_ERR';
export const resDeleteClientErr = () => {
  return {
    type: RES_DELETE_CLIENT_ERR
  };
};

export const DELETE_CLIENT = 'DELETE_CLIENT';
export function deleteClient(id) {
  return (dispatch) => {
    dispatch(reqDeleteClient());

    return Client.remove({ id }, (err) => {
      if (err) {
        dispatch(resDeleteClientErr());
      } else {
        dispatch(resDeleteClientSuc(id));
      }
    });
  };
}

export const CLOSE_ERROR_MESSAGE = 'CLOSE_ERROR_MESSAGE';
export const closeErrorMessage = () => {
  return {
    type: CLOSE_ERROR_MESSAGE
  };
};
