import { CreateInstanceButton } from "../components/CreateInstanceButton";
import { useState, useEffect, useCallback } from 'react';
import LogoutButton from "../components/SignoutButton";

export const Instances = () => {
  // State to manage the list of instances
  const [instances, setInstances] = useState([]);
  // State to manage the visibility of the input field
  const [showInput, setShowInput] = useState(false);
  // State to store the value of the input field
  const [instanceName, setInstanceName] = useState('');
  // State to store the index of the instance being edited
  const [editingIndex, setEditingIndex] = useState(null);
  // State to store the value of the edited instance name
  const [editedInstanceName, setEditedInstanceName] = useState('');
  // State to manage the visibility of the delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // State to store the index of the instance being deleted
  const [deletingIndex, setDeletingIndex] = useState(null);
  // State to store the value entered in the delete confirmation input field
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const userEmail = localStorage.getItem('email');
  console.log(userEmail)

  // Function to fetch instance list from server
  const fetchInstances = useCallback(() => {
    fetch(`http://localhost:3333/instances/${userEmail}`)
      .then(response => response.json())
      .then(data => setInstances(data))
      .catch(error => console.error('Error fetching instances:', error));
  }, [userEmail, setInstances]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]); // Empty dependency array ensures the effect runs only once after initial render

  // Function to handle adding a new instance
  const addInstance = () => {
    if (instanceName.trim() !== '') {
      fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}`, {
        method: 'POST',
        headers: {
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
      fetch(`http://localhost:3333/instances/${userEmail}/${instances[index].name}`, {
        method: 'PUT',
        headers: {
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
      fetch(`http://localhost:3333/instances/${userEmail}/${instanceToDelete.name}`, {
        method: 'DELETE',
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
