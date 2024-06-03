import { CreateInstanceButton } from "../components/CreateInstanceButton";
import { useState, useEffect, useCallback } from 'react';
import LogoutButton from "../components/SignoutButton";
import { Constants } from "./Constants";
import { Navbar } from "../components/Navbar";

export const Instances = () => {
  const [instances, setInstances] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [instanceName, setInstanceName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedInstanceName, setEditedInstanceName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
 
  // Function to fetch instance list from server
  const fetchInstances = useCallback(() => {
    const token = localStorage.getItem('token'); 
    
    
    // Check if token is present
    if (token) {
      fetch(`https://${username}.${Constants.SERVER_URL.hostname}/api/instances`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the authorization header
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => setInstances(data))
        .catch(error => console.error('Error fetching instances:', error));
    } else {
      console.error('Token not found. Unable to fetch instances.');
    }
  }, [username, setInstances]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]); // Empty dependency array ensures the effect runs only once after initial render

  // Function to handle adding a new instance
  const addInstance = () => {
    if (instanceName.trim() !== '') {
      fetch(`https://${username}.${Constants.SERVER_URL.hostname}/api/instances/${instanceName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: instanceName }),
      })
      .then(response => {
        return response;
      })
      .then(data => {
        setInstances([...instances, data]);
        setInstanceName('');
        setShowInput(false);
      })
      .catch(error => console.error('Error creating instance:', error));
    }
  };
  
  // Function to handle editing an instance name
  const editInstance = (index) => {
    setEditingIndex(index);
    setEditedInstanceName(instances[index].name);
  };

  // Function to handle saving the edited instance name
  const saveEditedInstance = (index) => {
    if (editedInstanceName.trim() !== '') {
      const authHeader = `Bearer ${token}`;
      fetch(`https://${username}.${Constants.SERVER_URL.hostname}/api/instances/${instances[index].name}`, {
        method: 'PUT',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName: editedInstanceName }),
      })
      .then(response => response.json())
      .then(data => {
        const updatedInstances = [...instances];
        updatedInstances[index].name = data.name;
        setInstances(updatedInstances);
        setEditingIndex(null);
      })
      .catch(error => console.error('Error updating instance:', error));
    }
  };

  // Function to handle deleting an instance
  const deleteInstance = (index) => {
    setShowDeleteDialog(true);
    setDeletingIndex(index);
  };

  // Function to confirm instance deletion
  const confirmDeleteInstance = () => {
    const confirmedName = deleteConfirmation.trim();
    const instanceToDelete = instances[deletingIndex];

    if (confirmedName === instanceToDelete.name) {
      const authHeader = `Bearer ${token}`;
      fetch(`https://${username}.${Constants.SERVER_URL.hostname}/api/instances/${instanceToDelete.name}`, {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        }
      })
      .then(() => {
        const updatedInstances = [...instances];
        updatedInstances.splice(deletingIndex, 1);
        setInstances(updatedInstances);
        setShowDeleteDialog(false);
        setDeletingIndex(null);
        setDeleteConfirmation('');
      })
      .catch(error => console.error('Error deleting instance:', error));
    }
  };

  return (
    <>
    <Navbar />
    <CreateInstanceButton onClick={() => setShowInput(true)}/>
      <section>
        <h2>Instances</h2>
        <main>
          {/* Display list of instances */}
          {instances.map((instance, index) => (
            <div key={index}>
              <button onClick={() => deleteInstance(index)}>Delete</button>
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editedInstanceName}
                    onChange={(e) => setEditedInstanceName(e.target.value)}
                  />
                  <button onClick={() => saveEditedInstance(index)}>Save</button>
                </>
              ) : (
                <>
                  <a href={`/${instance.name}`}><span>{instance.name}</span></a>

                  <button onClick={() => editInstance(index)}>Edit</button>
                </>
              )}
            </div>
          ))}
          {/* Input field to add new instance */}
          {showInput && (
            <div>
              <input
                type="text"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                placeholder="Enter instance name"
              />
              <button onClick={addInstance}>Add Instance</button>
            </div>
          )}
        </main>
      </section>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="delete-dialog">
          <p>Are you sure you want to delete this instance?</p>
          <p>This action cannot be undone.</p>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Enter instance name to confirm"
          />
          <button onClick={confirmDeleteInstance}>Yes</button>
          <button onClick={() => setShowDeleteDialog(false)}>No</button>
        </div>
      )}
      <LogoutButton />
    </>
  );
};