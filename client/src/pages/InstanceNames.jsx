import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { InstancesButton } from '../components/InstancesButton';
import { Constants } from './Constants';
import { TokenButton } from '../components/TokenButton';
import { Navbar } from '../components/Navbar';

export const InstanceNames = () => {
  const [tableName, setTableName] = useState('');
  const [numArguments, setNumArguments] = useState(0);
  const [argumentNames, setArgumentNames] = useState([]);
  const [argumentTypes, setArgumentTypes] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState('');
  const [fileList, setFileList] = useState([]);
  const [tableContents, setTableContents] = useState(null);
  const { pathParam } = useParams();
  const userEmail = localStorage.getItem('email');
  const instanceName = pathParam;
  const [token, setToken] = useState('');
  const [schema, setSchema] = useState(null);
  const [action, setAction] = useState(null);
  const [originalFormData, setOriginalFormData] = useState({});
  const [updatedFormData, setUpdatedFormData] = useState({});
   const [id, setId] = useState('');
   const [newDataTypes, setNewDataTypes] = useState({});

  const fetchSchema = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${selectedInstance}/schema`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
       const data = await response.json();
       setSchema(data);
      } else {
        console.error('Failed to fetch file list');
      }
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  }, [instanceName, userEmail, selectedInstance]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);




  const fetchFileList = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setFileList(data.files);
      } else {
        console.error('Failed to fetch file list');
      }
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  }, [instanceName, userEmail]);

  useEffect(() => {
    fetchFileList();
  }, [fetchFileList]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = {
      name: tableName,
      keys: argumentNames.map((name, index) => ({ name, type: argumentTypes[index] })),
      entries: [],
    };
    try {
      const authHeader = `Bearer ${token}`;
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${tableName}.db`, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Table created successfully');
        // Clear form inputs after successful submission
        setToken(data.token);
        setTableName('');
        setNumArguments(0);
        setArgumentNames([]);
        setArgumentTypes([]);
        // Update file list
        fetchFileList();
      } else {
        console.error('Failed to create table');
      }
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const handleInstanceSelect = async (instance) => {
    const token = localStorage.getItem('token');
    setSchema('')
    setSelectedInstance(instance);
    try {
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${instance} `, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        setToken(token);
        setTableContents(data);
        setSchema(null)
        console.log(data)
      } else {
        console.error(`Failed to fetch table contents for ${instance}`);
      }
    } catch (error) {
      console.error(`Error fetching table contents for ${instance}:`, error);
    }
  };

  const addNewInstance = async (instance) => {
    const token = localStorage.getItem('token');
    setSelectedInstance(instance);
    try {
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${instance}/schema`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        setToken(token);
        setSchema(data); // Store the fetched schema in state
      } else {
        console.error(`Failed to fetch schema for ${instance}`);
      }
    } catch (error) {
      console.error(`Error fetching schema for ${instance}:`, error);
    }
  };

  // Update handleInputChange function to handle changes for both forms separately
const handleInputChange = (e, formType) => {
  const { name, value } = e.target;
  // Determine which form data to update based on formType
  const formDataToUpdate = formType === 'original' ? originalFormData : updatedFormData;
  const setFormDataFunction = formType === 'original' ? setOriginalFormData : setUpdatedFormData;
   // Find the field object from schema based on the input name
   const field = schema.find(field => field.name === name);
   // Parse value based on field type
   let parsedValue;
   if (field.type === 'boolean') {
     parsedValue = value == 'true'
   } else if (field.type === 'number') {
     parsedValue = parseInt(value);
   } else {
     parsedValue = value;
   }


  // Update the corresponding form data
  setFormDataFunction({
    ...formDataToUpdate,
    [name]: parsedValue,
  });
};

 
  const deleteTableEntry = async (e) => {    
    e.preventDefault();
    const token = localStorage.getItem('token');
    const idValue = id;
    try {
      const authHeader = `Bearer ${token}`;
        const requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        }
      };
  
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${selectedInstance}/${idValue}`, requestOptions);
  
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }  
      // Optionally, handle success response here
      console.log('Entry deleted successfully');
      setSchema('');
      setTableContents(null);
      setUpdatedFormData({})
        // Update file list
        fetchFileList();
    } catch (error) {
      console.error('Error deleting entry:', error);
      // Optionally, handle error here (e.g., show a notification to the user)
    }
  };
  
  
  
  
  

  const addTableEntry = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const authHeader = `Bearer ${token}`;
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${selectedInstance}`, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Entry added successfully');
        // Clear form inputs after successful submission
        setToken(data.token);
        setSchema(null);
        setTableContents(null);
        setUpdatedFormData({}); // Clear updatedFormData
        // Update file list
        fetchFileList();
      } else {
        console.error('Failed to create table', updatedFormData);
      }
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const editTableEntry = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const idValue = id;
    // Create the request body based on updatedFormData
    let requestBody = {};
    for (const [key, value] of Object.entries(updatedFormData)) {
      requestBody[key] = value;
    }
  
    try {
      const authHeader = `Bearer ${token}`;
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${selectedInstance}/${idValue}`, {
        method: 'PUT',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Entry updated successfully');
        // Clear form inputs after successful submission
        setToken(data.token);
        setSchema('');
        setUpdatedFormData({}); // Clear updatedFormData
        setOriginalFormData({}); // Clear originalFormData
        // Update file list
        fetchFileList();
      } else {
        console.error('Failed to update entry');
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };
  


  const editColumnEntry = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');   
    try {
      // Fetch schema only when needed
      await fetchSchema();
      const oldKeyValue = Object.values(originalFormData).toString();
      const newKeyValue = Object.values(updatedFormData).toString();     
    
      const authHeader = `Bearer ${token}`;
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${selectedInstance}`, {
        method: 'PATCH',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: [JSON.stringify({oldKey: oldKeyValue, newKey: newKeyValue})],
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Entry added successfully');
        // Clear form inputs after successful submission
        setToken(data.token);
        setSchema('');
        setUpdatedFormData({}); // Clear updatedFormData
        setOriginalFormData({}); // Clear originalFormData
        // Update file list
        fetchFileList();
      } else {
        console.error('Failed to create table');
      }
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };
  




  const handleAddEntry = () => {
    setAction('add');
    if (!selectedInstance) {
      alert('Please select an instance before adding an entry.');
      return;
    }
    // Fetch schema if not already fetched
    if (!schema) {
      handleInstanceSelect(selectedInstance);
      addNewInstance(selectedInstance);
    }
  };

  const handleDeleteEntry = () => {
    setAction('delete');
    if (!selectedInstance) {
      alert('Please select an instance before adding an entry.');
      return;
    }
    // Fetch schema if not already fetched
    if (!schema) {
      handleInstanceSelect(selectedInstance);
      addNewInstance(selectedInstance);
    }
  };

  const handleEditEntry = () => {
    setAction('edit');
    if (!selectedInstance) {
      alert('Please select an instance before adding an entry.');
      return;
    }
    // Fetch schema if not already fetched
    if (!schema) {
      handleInstanceSelect(selectedInstance);
      addNewInstance(selectedInstance);
    }
  };

  const handleColumnEditEntry = () => {
    setAction('edit-column');
    if (!selectedInstance) {
      alert('Please select an instance before adding an entry.');
      return;
    }
    // Fetch schema if not already fetched
    if (!schema) {
      handleInstanceSelect(selectedInstance);
      addNewInstance(selectedInstance);
    }
  };

  const handleSchemaEditEntry = () => {
    setAction('edit-schema');
    if (!selectedInstance) {
      alert('Please select an instance before adding an entry.');
      return;
    }
    // Fetch schema if not already fetched
    if (!schema) {
      handleInstanceSelect(selectedInstance);
      addNewInstance(selectedInstance);
    }
  };

  const deleteTable = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const authHeader = `Bearer ${token}`;
      const requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        }
      };
  
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${selectedInstance}`, requestOptions);
  
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }  
      // Optionally, handle success response here
      console.log('Entry deleted successfully');
      setSchema('');
        // Update file list
        fetchFileList();
    } catch (error) {
      console.error('Error deleting entry:', error);
      // Optionally, handle error here (e.g., show a notification to the user)
    }
  }


  const editDataType = async (e) => {
    e.preventDefault();

  try {
    const formData = new FormData(e.target);
    
    schema.forEach((field) => {
      newDataTypes[field.name] = formData.get(field.name);
    });
    setNewDataTypes(newDataTypes);
   
    const updatedSchema = schema.map((field) => {
      return {
        name: field.name,
        type: newDataTypes[field.name] || field.type
      };
    });
    const reqBody = { schema: [ ...updatedSchema ]}
    console.log(reqBody)
    const authHeader = `Bearer ${token}`;
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${selectedInstance}/schema`, {
        method: 'PUT',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: [JSON.stringify(reqBody)],
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Entry added successfully');
        // Clear form inputs after successful submission
        setToken(data.token);
        setSchema('');
        setUpdatedFormData({}); // Clear updatedFormData
        setOriginalFormData({}); // Clear originalFormData
        // Update file list
        fetchFileList();
      } else {
        console.error('Failed to create table');
      }
    } catch (error) {
      console.error('Error creating table:', error);
    }

    
  };
  

  return (
    <>
    <Navbar />
      <TokenButton />
      <InstancesButton />
      <form onSubmit={handleSubmit}>
        <label className='instance-names'>
          Table Name:
          <input type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} required />
        </label>
        <label className='instance-names'>
          Number of Arguments:
          <input type="number" value={numArguments} onChange={(e) => setNumArguments(parseInt(e.target.value))} min={0} />
        </label>
        {Array.from({ length: numArguments }, (_, index) => (
          <div key={index}>
            <label>
              Argument Name {index + 1}:
              <input
                type="text"
                value={argumentNames[index] || ''}
                onChange={(e) => {
                  const newArgumentNames = [...argumentNames];
                  newArgumentNames[index] = e.target.value;
                  setArgumentNames(newArgumentNames);
                }}
                required
              />
            </label>
            <label>
              Argument Type:
              <select
                value={argumentTypes[index] || ''}
                onChange={(e) => {
                  const newArgumentTypes = [...argumentTypes];
                  newArgumentTypes[index] = e.target.value;
                  setArgumentTypes(newArgumentTypes);
                }}
                required
              >
                <option value="">Select Type</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
            </label>
          </div>
        ))}
        <button type="submit">Create Table</button>
      </form>
      

      <div>
        <h3 className='instance-names'>Instance Selector</h3>
        <select value={selectedInstance} onChange={(e) => handleInstanceSelect(e.target.value)}>
          <option value="default">Select Instance</option>
          {fileList.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>
      <button type="button" onClick={handleAddEntry}>
        Add Entry
      </button>
      <button type='button' onClick={handleDeleteEntry}>
        Delete Entry
      </button>
      <button type='button' onClick={handleEditEntry}>
        Edit Entry
      </button>
      <button onClick={deleteTable} type="submit">Delete Table</button>
      <button onClick={handleColumnEditEntry}>Edit Entry Column</button>
      <button onClick={handleSchemaEditEntry}>Edit Column Data Type</button>
      {action === 'add' && schema && (
        <form onSubmit={addTableEntry}>
          {schema.map((field) => (
            <div key={field.name}>
              <label>
                {field.name}:
                {field.type === 'boolean' ? (
                  <select
                    name={field.name}
                    value={updatedFormData[field.name] || ''}
                    onChange={handleInputChange}
                    required
                  > 
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={updatedFormData[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.type}
                  />
                )}
              </label>
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
      {action === 'delete' && schema && (
        <form onSubmit={deleteTableEntry}>
           <label>id: 
   <input 
              type='number' 
              value={id} 
              onChange={(e) => setId(e.target.value)} // Update ID state
              required 
      />
    </label>
          <button type="submit">Submit</button>
        </form>
      )}
  {action === 'edit' && schema && (
  <form onSubmit={editTableEntry}>
   {/* Original values form */}
   <label>id: 
   <input 
              type='number' 
              value={id} 
              onChange={(e) => setId(e.target.value)} // Update ID state
              required 
      />
    </label>
    {/* Updated values form */}
    {schema.map((field) => (
      <div key={field.name}>
        <label>
          {field.name} (Updated):
          {field.type === 'boolean' ? (
            <select
              name={field.name}
              value={updatedFormData[field.name] || ''}
              onChange={(e) => handleInputChange(e, 'updated')}
              required
            >
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={updatedFormData[field.name] || ''}
              onChange={(e) => handleInputChange(e, 'updated')}
              placeholder={`${field.type} updated value`}
            />
          )}
        </label>
      </div>
    ))}
    <button type="submit">Submit</button>
  </form>
)}
{action === 'edit-column' && schema && (
  <form onSubmit={editColumnEntry}>
    {/* Original values form */}
    {schema.length > 0 && (
      <div key={schema[0].name}>
        <label>
          Current column name:
            <input
              name={schema[0].name}
              value={originalFormData[schema[0].name] || ''}
              onChange={(e) => handleInputChange(e, 'original')}
              placeholder={`Enter current column name`}
            />
          
        </label>
      </div>
    )}    
  </form>
)}

{action === 'edit-column' && schema && (
  
  <form onSubmit={editColumnEntry}>
    {/* Original values form */}
    {schema.length > 0 && (
      <div key={schema[0].name}>
        <label>
          Updated column name:
            <input
              name={schema[0].name}
              value={updatedFormData[schema[0].name] || ''}
              onChange={(e) => handleInputChange(e, 'updated')}
              placeholder={`Enter updated column name`}
            />
          
        </label>
      </div>
    )}    
    <button type='submit'>Submit</button>
  </form>
)}
{action === 'edit-schema' && schema && (
  <form onSubmit={editDataType}>
    {schema.map((field) => (
      <div key={field.name}>
        <label>
          {field.name} (Updated)
           
            <select name={field.name}>
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
            </select>
          
        </label>
      </div>
    ))}
    <button type="submit">Submit</button>
  </form>
 
)}     

  {tableContents && (
  <div>
    <h3 className='instance-names'>Table Contents for {selectedInstance}</h3>
    {tableContents && (
      <div className="fetched-data-table">
        <h2 className='instance-names'>Data for selected table:</h2>
        <table>
          <thead>
            <tr>
              {/* Render id column header */}
              <th id='table-id'>id</th>
              {/* Render table headers */}
              {tableContents.length >0 &&
                Object.keys(tableContents[0]).map((key) => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {/* Render table rows */}
            {tableContents.map((row, rowIndex) => (
              <tr key={rowIndex}>                      
              <td>{rowIndex + 1}</td>{/* id column */}
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

    </>
  );
};