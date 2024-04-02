import { CreateInstanceButton } from "../components/CreateInstanceButton";
import { useState } from 'react';
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

  // Function to handle adding a new instance
  const addInstance = () => {
    if (instanceName.trim() !== '') {
      setInstances([...instances, instanceName]);
      setInstanceName('');
      setShowInput(false);
    }
  };

  // Function to handle editing an instance name
  const editInstance = (index) => {
    setEditingIndex(index);
    setEditedInstanceName(instances[index]);
  };

  // Function to handle saving the edited instance name
  const saveEditedInstance = (index) => {
    if (editedInstanceName.trim() !== '') {
      const updatedInstances = [...instances];
      updatedInstances[index] = editedInstanceName;
      setInstances(updatedInstances);
      setEditingIndex(null);
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

    if (confirmedName === instanceToDelete) {
      const updatedInstances = [...instances];
      updatedInstances.splice(deletingIndex, 1);
      setInstances(updatedInstances);
    }

    setShowDeleteDialog(false);
    setDeletingIndex(null);
    setDeleteConfirmation('');
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
                  <span>{instance}</span>
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
