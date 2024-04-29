import { useState, useCallback, useEffect } from 'react';
import { Constants } from '../pages/Constants';

export const Table = () => {
  // State to keep track of the sorting order
  const [sortOrder, setSortOrder] = useState('asc');
  // State to keep track of the currently sorted column
  const [sortedColumn, setSortedColumn] = useState(null);
  // State to store the fetched data
  const [fetchedData, setFetchedData] = useState(null);
  const userEmail = localStorage.getItem('email');
  const instanceName = 'links';
  const [fileList, setFileList] = useState([]);
  const [token, setToken] = useState('');
token;
  const fetchFileList = useCallback(async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        setToken(token)
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

  // Function to handle sorting when a column header is clicked
  const handleSort = (column) => {
    // Toggle the sorting order if the same column header is clicked
    if (sortedColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a different column header is clicked, set sorting order to 'asc'
      setSortedColumn(column);
      setSortOrder('asc');
    }
  };

  // Function to fetch data for a specific table and display it in a div below the table
  const fetchDataForTable = async (tableName) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${Constants.SERVER_URL}/instances/${userEmail}/${instanceName}/${encodeURIComponent(tableName)}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        setToken(token)
        setFetchedData(data);
      } else {
        console.error(`Failed to fetch data for table ${tableName}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Sort the fileList based on the currently sorted column and sorting order
  const sortedFileList = sortedColumn
    ? fileList.slice().sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortedColumn] > b[sortedColumn] ? 1 : -1;
        } else {
          return a[sortedColumn] < b[sortedColumn] ? 1 : -1;
        }
      })
    : fileList;

    


  return (
    <>
    <h2>Tables</h2>
      <table>
        <thead>
          <tr>
            {/* Check if fileList has any elements before mapping through its keys */}
            {fileList.length > 0 &&
              Object.keys(fileList[0]).map((column) => (
                <th key={column} className='table-head' onClick={() => handleSort(column)}>
                  {column}
                  {/* Show arrow icon indicating sorting order */}
                  {sortedColumn === column && (
                    <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {/* Map through the sorted fileList to create table rows */}
          {sortedFileList.map((row, index) => (
            <tr key={index}>
              {/* Render each file name as a link */}
              <td>
                <a href="#" onClick={() => fetchDataForTable(row)}>
                  {row}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Display fetched data in a div below the table */}
      {fetchedData && (
        <div className="fetched-data-table">
          <h2>Data for selected table:</h2>
          <table>
            <thead>
              <tr>
                {/* Render table headers */}
{fetchedData.length > 0 && Object.keys(fetchedData[0]).map(key => (
  <th key={key}>{key}</th>
))}
         </tr>
          </thead>
            <tbody>
              {/* Render table rows */}
              {fetchedData.map((row, rowIndex) => (
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
    </>
  );
};
