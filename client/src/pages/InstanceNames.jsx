import { useState, useEffect, useCallback } from 'react';
import { useParams  } from 'react-router-dom';

export const InstanceNames = () => {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');
  const [newTableArgs, setNewTableArgs] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [newEntryData, setNewEntryData] = useState({});
  const { pathParam } = useParams();
  const userEmail = localStorage.getItem('email');
  const instanceName = pathParam;
  console.log(instanceName, userEmail)
  

  const fetchTables = useCallback(() => {
    try {
      const response = fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}`);
      setTables(response.data.tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  },[instanceName, userEmail]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleCreateTable = async () => {
    try {
      const response = await fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}/${newTableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          args: newTableArgs.split(',').map(arg => arg.trim()),
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to create table');
      }
  
      const data = await response.json();
      setTables([...tables, data.table]);
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };
  

  const handleDeleteTable = async (tableName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the table "${tableName}"?`);
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}/${tableName}`, {
          method: 'DELETE'
        });
        setTables(tables.filter(table => table.name !== tableName));
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };
  
  const handleAddEntry = async () => {
    try {
      await fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}/${selectedTable}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEntryData)
      });
      // Refresh the table after adding entry
      fetchTables();
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };
  handleAddEntry()
  const handleUpdateEntry = async (entryId, newData) => {
    try {
      await fetch(`http://localhost:3333/instances/${userEmail}/${instanceName}/${selectedTable}/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });
      // Refresh the table after updating entry
      fetchTables();
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };
  handleUpdateEntry()
  return (
    <div>
      <h2>Instance: {instanceName}</h2>
      <div>
        <h3>Create New Table</h3>
        <input type="text" placeholder="Table Name" value={newTableName} onChange={(e) => setNewTableName(e.target.value)} />
        <input type="text" placeholder="Table Arguments (comma separated)" value={newTableArgs} onChange={(e) => setNewTableArgs(e.target.value)} />
        <button onClick={handleCreateTable}>Create Table</button>
      </div>

      <div>
        <h3>Tables</h3>
        <ul>
          {tables.map(table => (
            <li key={table.name}>
              {table.name}
              <button onClick={() => handleDeleteTable(table.name)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Additional UI for adding entry and updating entry */}
      {/* You need to implement this part based on your requirements */}
    </div>
  );
};

