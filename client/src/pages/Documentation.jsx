import { Navbar } from "../components/Navbar";


export const Documentation = () => {
    
  return (
    <>
    <Navbar />
    <div className="documentation-container">
      <h1 className="documentation-title">CanderDB Documentation</h1>
      <div className="documentation-section">
        <h2 className="section-title">Introduction</h2>
        <p>
          Welcome to the official documentation for CanderDB: a file-based NoSQL database with a schema enforcement mechanism.
          CanderDB provides a flexible and scalable data storage solution for your applications. Please be advised that CanderDB is currently in early beta and should be used for testing purposes only. CanderDB is NOT currently suitable for production.
        </p>
      </div>

      <div className="documentation-section">
        <h2 className="section-title">Getting Started</h2>
        <p>
          To get started with CanderDB, you need to first sign up and create an account at CanderDB. After doing this, you will find your token in your dashboard. Keep this secret, as it is crucial to accessing your data. In your user dashboard, you will have the ability to create instances - and within instances you can create multiple tables. Instances are meant to group related tables, even if they don&rsquo;t directly interact with each other. After creating a table, you can perform limited CRUD functions with the provided Graphical User Interface.
          Setting up CanderDB in your project is as simple as setting up a db.js file as follows:
        </p>
        <pre>
          <code>
            {`db.js
            
            
            require('dotenv').config();
const https = require('https');

const dbConfig = {
    hostname: process.env.HOST_NAME,
    headers: {
        'Authorization': \`\${process.env.ACCESS_TOKEN}\`,
        'Content-Type': 'application/json'
    }
};

// Utility function to make HTTP requests
const makeRequest = (method, path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: dbConfig.hostname,
            path,
            method,
            headers: dbConfig.headers
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(JSON.parse(body));
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

function fetchTableContent(instanceName, tableName) {
    const options = {
        hostname: dbConfig.hostname,
        path: \`/instances/\${instanceName}/\${tableName}\`,
        method: 'GET',
        headers: dbConfig.headers
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(\`Failed to fetch table content: \${data}\`));
                }
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.end();
    });
}

function addUser(instanceName, tableName, newUser) {
    const options = {
        hostname: dbConfig.hostname,
        path: \`/instances/\${instanceName}/\${tableName}\`,
        method: 'POST',
        headers: dbConfig.headers
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(\`Failed to add user: \${data}\`));
                }
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.write(JSON.stringify(newUser));
        req.end();
    });
}

// Function to check if email exists
const checkEmailExists = async (email) => {
    try {
        const users = await makeRequest('GET', '/instances/links/ice_users.db');
        return users.some(user => user.email === email);
    } catch (error) {
        console.error('Error checking if email exists:', error);
        throw error;
    }
};


async function fetchUserByEmail(instanceName, tableName, email) {
    const users = await fetchTableContent(instanceName, tableName);
    return users.find(user => user.email === email);
}

module.exports = {
    fetchTableContent,
    addUser,
    fetchUserByEmail,
    makeRequest, 
    checkEmailExists
};

    
`}
          </code>
        </pre>
<p>Also in the db.js file, be sure to include a function to originate the request to the server:</p>

        <p>
          Once installed, you can start using CanderDB in your applications.
        </p>
      </div>

      <div className="documentation-section">
        <h2 className="section-title">Usage</h2>
        <p>
          Below is a basic example of how to connect to CanderDB and perform a simple query:
        </p>
        <pre>
          <code>
            {`
              const express = require('express');
              const app = express();
              const cors = require('cors');
              require('dotenv').config();
              const CanderDB = require('./db');
              app.use(cors());
              app.use(express.json());
              
              
              
              app.get('/cars', (req, res) => {
                CanderDB.connect('GET', null, res);
              });
              
              app.post('/cars', (req, res) => {
                const requestBody = req.body;
                CanderDB.connect('POST', requestBody, res);
              });
              
              app.put('/cars', (req, res) => {
                const requestBody = req.body;
                CanderDB.connect('PUT', requestBody, res);
              });
             
              const port = process.env.PORT || 3000;
              app.listen(port, () => {
                console.log(\`Server is listening on port \${port}\`);
              });  

            `}
          </code>
        </pre>
      </div>
      <h3 className="section-title">Perform queries using a REST client</h3>
      <pre>
        <code>
            {`
            POST requests
            Assuming that you have a table called grades.db and wanted to add an entry, you would simply enter the appropriate keys and values:
            {
                "subject": "french",
                "letter_grade": "A-"
            }


            This theoretical table will then be updated to look like this:
            {
                "name": "school",
                "keys": [
                  {
                    "name": "subject",
                    "type": "string"
                  },
                  {
                    "name": "letter_grade",
                    "type": "string"
                  }
                ],
                "entries": [                  
                {
                    "subject": "french",
                    "letter_grade": "A-"
                  }
                ]
              }
            It is important to remember that the data types required for a given value is enforced when sending POST requests. Eg., if a number is entered where a string is required, an error will be returned, and the entry will be rejected.

            PATCH requests:
            {"oldKey": "letter_grade", "newKey": "letter_grades"}

            Patch requests just require inputting an existing key value and the desired replacement.

            PUT requests:
            PUT requests can be used to alter the structure of the table - i.e., changing the name of columns, adding or removing columns, or changing the data type required for a given column. It is important to remember however, that changing existing columns does not retroactively alter entries made prior to that change, and the developer will need to manage their data accoringly.

            {
                "schema": [
                   {
                    "name": "subject",
                    "type": "string"
                  },
                  {
                    "name": "letter_grade",
                    "type": " number"
                  }
                ]
              }

PATHS: 

GET: '/instances/user@email.com/instance-name/filename.db'
GET: '/instances/user@email.com/instance-name/filename.db/:id'
POST: '/instances/user@email.com/instance-name/filename.db'
PUT: '/instances/user@email.com/instance-name/filename.db'
PUT: '/instances/user@email.com/instance-name/filename.db/:id'
PATCH: '/instances/user@email.com/instance-name/filename.db/schema'
DELETE(entire instance): '/instances/user@email.com/instance-name'
DELETE(table):'/instances/user@email.com/instance-name/filename.db'
DELETE(row): '/instances/user@email.com/instance-name/filename.db'(with request body that includes user entry)

*Bearer tokens are required to send requests to the server. 
HOST_NAME = yourusername.cander-db.com

            
            `}
        </code>
      </pre>




    </div>
    </>
  );
}

