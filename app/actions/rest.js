import $ from 'jquery';

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
  return function (dispatch) {
    dispatch(reqGetClients());

    return $.get({
        url: "http://primary-workspace-mak4alex.c9users.io/api/clients",
        data: { "page": page }
      })
      .done((data) => {
        dispatch(resGetClientsSuc(data));
      })
      .fail(() => {
        dispatch(resGetClientsErr());
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
  return function (dispatch) {
    dispatch(reqPostClient());

    return $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "https://primary-workspace-mak4alex.c9users.io/api/client",
      data: JSON.stringify({
        client: {
          name,
          sex,
          id_number,
          phone,
          address
        }       
      }),
      dataType: "json"
    })
    .done((data) => {
      dispatch(resPostClientSuc(data.client));
    })
    .fail((err) => {
      dispatch(resPostClientErr(err));
    });
  }
};


export const EDIT_CLIENT = 'EDIT_CLIENT';
export const editClient = (id) => {
  return {
    type: EDIT_CLIENT,
    id
  }
}

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
  }
}

export const RES_UPDATE_CLIENT_ERR = 'RES_UPDATE_CLIENT_ERR';
export const resUpdateClientErr = (error) => {
  return {
    type: RES_UPDATE_CLIENT_ERR,
    errorMessage: error
  }
}


export const UPDATE_CLIENT = 'UPDATE_CLIENT';
export function updateClient(id, name, sex, id_number, phone, address) {
  return function (dispatch) {
    dispatch(reqUpdateClient());

    return $.ajax({
      type: "PUT",
      contentType: "application/json",
      url: `https://primary-workspace-mak4alex.c9users.io/api/client/${id}`,
      data: JSON.stringify({
        client: {
          name,
          sex,
          id_number,
          phone,
          address
        }
      }),
      dataType: "json"
    })
    .done((data) => {
      dispatch(resUpdateClientSuc(data.client));
    })
    .fail((error) => {
      dispatch(resUpdateClientErr(error));
    });
  };
};


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
}

export const RES_DELETE_CLIENT_ERR = 'RES_DELETE_CLIENT_ERR';
export const resDeleteClientErr = () => {
  return {
    type: RES_DELETE_CLIENT_ERR
  };
}

export const DELETE_CLIENT = 'DELETE_CLIENT';
export function deleteClient(id) {
  return function (dispatch) {
    dispatch(reqDeleteClient());

    return $.ajax({
      type: "DELETE",
      url: `https://primary-workspace-mak4alex.c9users.io/api/client/${id}`})     
      .done(() => {
        dispatch(resDeleteClientSuc(id));
      })
      .fail(() => {
        dispatch(resDeleteClientErr());
      });
  };
}

export const CLOSE_ERROR_MESSAGE = 'CLOSE_ERROR_MESSAGE';
export const closeErrorMessage = () => {
  return {
    type: CLOSE_ERROR_MESSAGE
  };
}
