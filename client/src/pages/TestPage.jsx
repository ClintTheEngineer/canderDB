import { useState, useEffect, useCallback } from 'react';
//import { useParams  } from 'react-router-dom';

export const TestPage = () => {
  const [objectName, setObjectName] = useState('');
  const [numberOfKeys, setNumberOfKeys] = useState(0);
  const [keyNames, setKeyNames] = useState([]);
  const [keyTypes, setKeyTypes] = useState([]);
  const [entries, setEntries] = useState([]);
  const [savedObjects, setSavedObjects] = useState([]);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState(-1);
  const [selectedObjectData, setSelectedObjectData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  //const { pathParam } = useParams();
  const instanceName = 'people';
  const userEmail = localStorage.getItem('email');

  

  const fetchObjects = useCallback(() => {
    fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}`)
      .then(response => response.json())
      .then(data => setSavedObjects(data))
      .catch(error => console.error('Error fetching instances:', error));
  }, [userEmail, setSavedObjects, instanceName]);

  useEffect(() => {
    // Fetch saved objects from the server when the component mounts
    fetchObjects();
  }, [fetchObjects]);
  
  useEffect(() => {
    const savedObjectsJSON = localStorage.getItem('savedObjects');
    if (savedObjectsJSON) {
      setSavedObjects(JSON.parse(savedObjectsJSON));
    }
  }, []);

  const fetchObjectData = useCallback(() => {
    try {
      
      const tableName = objectName; // Table name is the same as object name
      const response = fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}/${tableName}.db`);
      if (response.ok) {
        const data = response.json();
        setSelectedObjectData(data);
      } else {
        throw new Error('Failed to fetch object data.');
      }
    } catch (error) {
      console.error('Error fetching object data:', error.message);
    }
  }, [instanceName, objectName, userEmail]);

  useEffect(() => {
    if (selectedObjectIndex !== -1) {
      setObjectName(savedObjects[selectedObjectIndex].name);
      setKeyNames(savedObjects[selectedObjectIndex].keys.map(key => key.name));
      setKeyTypes(savedObjects[selectedObjectIndex].keys.map(key => key.type));
      // Fetch entries for the selected object
      fetchEntries(savedObjects[selectedObjectIndex].id);
      // Fetch selected object's data
      fetchObjectData(savedObjects[selectedObjectIndex].name);
    }
  }, [selectedObjectIndex, savedObjects, fetchObjectData]);

  

  
  const fetchEntries = async (objectId) => {
    try {
      const response = await fetch(`http://localhost:3333/instances/:userEmail/${objectId}/entries`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
      } else {
        throw new Error('Failed to fetch entries.');
      }
    } catch (error) {
      console.error('Error fetching entries:', error.message);
    }
  };


  const handleAddEntry = () => {
    const entry = {};
    let isValid = true;
    for (let i = 0; i < keyNames.length; i++) {
      const inputValue = prompt(`Enter value for ${keyNames[i]}:`);
      if (keyTypes[i] === 'string' && typeof inputValue !== 'string') {
        isValid = false;
        break;
      } else if (keyTypes[i] === 'number' && isNaN(parseInt(inputValue))) {
        isValid = false;
        break;
      } else if (keyTypes[i] === 'boolean' && inputValue !== 'true' && inputValue !== 'false') {
        isValid = false;
        break;
      }
      entry[keyNames[i]] = keyTypes[i] === 'boolean' ? inputValue === 'true' : inputValue;
    }
    if (!isValid) {
      setErrorMessage('Invalid input type for one or more values.');
      return;
    }
    const updatedEntries = [...entries, entry];
    setEntries(updatedEntries);
    if (selectedObjectIndex !== -1) {
      const updatedSavedObjects = [...savedObjects];
      updatedSavedObjects[selectedObjectIndex].entries = updatedEntries;
      setSavedObjects(updatedSavedObjects);
      localStorage.setItem('savedObjects', JSON.stringify(updatedSavedObjects));
      console.log(updatedSavedObjects)
    }
    setErrorMessage('');
  };


  const handleCreateObject = async () => {
    const newObject = {
      name: objectName,
      keys: keyNames.map((keyName, index) => ({ name: keyName, type: keyTypes[index] })),
      entries: entries
    };

    // Send POST request to server
    try {
       // Replace with user's email
      //const instanceName = objectName; // Replace with instance name
      const newTableName = objectName; // Replace with new table name
      const response = await fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}/${newTableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObject)
      });
      if (response.ok) {
        console.log('Object created successfully.');
      } else {
        throw new Error('Failed to create object.');
      }
    } catch (error) {
      console.error('Error creating object:', error.message);
    }
  };

  const handleKeyNameChange = (index, event) => {
    const updatedKeyNames = [...keyNames];
    updatedKeyNames[index] = event.target.value;
    setKeyNames(updatedKeyNames);
  };

  const handleRemoveKey = index => {
    const updatedKeyNames = [...keyNames];
    updatedKeyNames.splice(index, 1);
    setKeyNames(updatedKeyNames);
  };

  const handleKeyTypeChange = (index, event) => {
    const updatedKeyTypes = [...keyTypes];
    updatedKeyTypes[index] = event.target.value;
    setKeyTypes(updatedKeyTypes);
  };

  return (
    <div>
      <label>Name of Object:</label>
      <input type="text" value={objectName} onChange={e => setObjectName(e.target.value)} />
      <br />
      <label>Number of Keys:</label>
      <input type="number" value={numberOfKeys} onChange={e => setNumberOfKeys(parseInt(e.target.value))} />
      <br />
      {Array.from({ length: numberOfKeys }, (_, index) => (
        <div key={index}>
          <label>Name of Key {index + 1}:</label>
          <input type="text" value={keyNames[index] || ''} onChange={e => handleKeyNameChange(index, e)} />
          <select value={keyTypes[index] || ''} onChange={e => handleKeyTypeChange(index, e)}>
            <option value="">Select Type</option>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </select>
          <button onClick={() => handleRemoveKey(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddEntry}>Add Entry</button>
      <button onClick={handleCreateObject}>Create Object</button>
      <br />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <label>View Saved Object:</label>
      <select onChange={(e) => setSelectedObjectIndex(parseInt(e.target.value))}>
        <option value={-1}>Select</option>
        {savedObjects.map((object, index) => (
          <option key={index} value={index}>{object.name}</option>
        ))}
      </select>
      {selectedObjectIndex !== -1 && (
        <div>
          <h3>Entries:</h3>
          <ul>
            {entries.map((entry, index) => (
              <li key={index}>{JSON.stringify(entry)}</li>
            ))}
          </ul>
        </div>
      )}
       {selectedObjectData && (
        <div>
          <h3>Selected Object Data:</h3>
          <pre>{JSON.stringify(selectedObjectData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

  


