import React, { Component } from 'react';

export default class Client extends Component {

  render() {
    const { id, name, sex, id_number, phone, address, created_at, updated_at,
      deleteClient, editClient, isEditing, cancelEdit, updateClient } = this.props;

    const onDelete = () => {
      deleteClient(id);
    }

    const onEdit = () => {
      editClient(id);
    }

    const onCancelEdit = () => {
      cancelEdit(id)
    }

    let nameInput = null;
    let sexInput = null;
    let idNumberInput = null;
    let phoneInput = null;
    let addressInput = null;

    const onSaveClient = () => {
      updateClient( 
        id,
        nameInput.value.trim(),   
        sexInput.checked,
        idNumberInput.value.trim(),
        phoneInput.value.trim(),
        addressInput.value.trim());
    }

    let clientRow = null;

    const formatDate = (date) => {
      return (new Date(Date.parse(date))).toLocaleDateString();
    }

    if (isEditing) {
      clientRow = (
        <tr>
          <td>{id}</td>
          <td><input type="text" ref={ n => nameInput = n }
                     defaultValue={name} /></td>  
          <td><input type="checkbox" ref={ n => sexInput = n }
                     defaultChecked={sex} /></td>
          <td><input type="text" ref={ n => idNumberInput = n }
                     defaultValue={id_number} /></td>
          <td><input type="text" ref={ n => phoneInput = n }
                     defaultValue={phone} /></td>
          <td><input type="text" ref={ n => addressInput = n }
                     defaultValue={address} /></td>
          <td>{formatDate(created_at)}</td>
          <td>{formatDate(updated_at)}</td>     
          <td>
            <div className="btn-group btn-group-xs">
              <button className="btn btn-warning" 
                      onClick={onCancelEdit}>Cancel</button>
              <button className="btn btn-primary" 
                      onClick={onSaveClient}>Save</button>
            </div>
          </td>
        </tr>
      );
    } else {
      clientRow = (
        <tr>
          <td>{id}</td>
          <td>{name}</td>
          <td>{ sex ? 'male' : 'female' }</td>
          <td>{id_number}</td>
          <td>{phone}</td>
          <td>{address}</td>
          <td>{formatDate(created_at)}</td>
          <td>{formatDate(updated_at)}</td>         
          <td>
            <div className="btn-group btn-group-xs">
              <button className="btn btn-warning" onClick={onEdit}>Edit</button>
              <button className="btn btn-danger" onClick={onDelete}>Delete</button>
            </div>
          </td>
        </tr>
      );
    }

    return clientRow;
  }

}
