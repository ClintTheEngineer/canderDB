import { useState, useEffect, useCallback } from 'react';
import { useParams  } from 'react-router-dom';
import { InstancesButton } from '../components/InstancesButton';

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

  
  const fetchFileList = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}`);
      if (response.ok) {
        const data = await response.json();
        setFileList(data.files);
      } else {
        console.error('Failed to fetch file list');
      }
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  }, [instanceName, userEmail]);

  useEffect(() => {
    // Fetch list of files from server
    fetchFileList();
  }, [fetchFileList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: tableName,
      keys: argumentNames.map((name, index) => ({ name, type: argumentTypes[index] })),
      entries: []
    };
    try {
      const response = await fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}/${tableName}.db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Table created successfully');
        // Clear form inputs after successful submission
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
    setSelectedInstance(instance);
    try {
      const response = await fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}/${instance}`);
      if (response.ok) {
        const data = await response.json();        
        setTableContents(data);
      } else {
        console.error(`Failed to fetch table contents for ${instance}`);
      }
    } catch (error) {
      console.error(`Error fetching table contents for ${instance}:`, error);
    }
  };

   

  return (
    
    <>
    <InstancesButton />
      <form onSubmit={handleSubmit}>
        <label>
          Table Name:
          <input type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} required />
        </label>
        <label>
          Number of Arguments:
          <input type="number" value={numArguments} onChange={(e) => setNumArguments(parseInt(e.target.value))} min={0} />
        </label>
        {Array.from({ length: numArguments }, (_, index) => (
          <div key={index}>
            <label>
              Argument Name {index + 1}:
              <input type="text" value={argumentNames[index] || ''} onChange={(e) => {
                const newArgumentNames = [...argumentNames];
                newArgumentNames[index] = e.target.value;
                setArgumentNames(newArgumentNames);
              }} required />
            </label>
            <label>
              Argument Type:
              <select value={argumentTypes[index] || ''} onChange={(e) => {
                const newArgumentTypes = [...argumentTypes];
                newArgumentTypes[index] = e.target.value;
                setArgumentTypes(newArgumentTypes);
              }} required>
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
        <h3>Instance Selector</h3>
        <select value={selectedInstance} onChange={(e) => handleInstanceSelect(e.target.value)}>
          <option value="default">Select Instance</option>
          {fileList.map(file => (
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
      </div>

      {tableContents && (
        <div>
          <h3>Table Contents for {selectedInstance}</h3>
          {tableContents && (
        <div className="fetched-data-table">
          <h2>Data for selected table:</h2>
          <table>
            <thead>
              <tr>
                {/* Render table headers */}
{tableContents.length > 0 && Object.keys(tableContents[0]).map(key => (
  <th key={key}>{key}</th>
))}
         </tr>
          </thead>
            <tbody>
              {/* Render table rows */}
              {tableContents.map((row, rowIndex) => (
                <tr key={rowIndex}>
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


