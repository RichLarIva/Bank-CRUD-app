import sql from 'msnodesqlv8';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// Build connection string dynamically
let connectionString = `server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=${process.env.DB_TRUSTED_CONNECTION};Driver=${process.env.DB_DRIVER}`;

if (process.env.DB_USER && process.env.DB_PASSWORD) {
    connectionString += `;Uid=${process.env.DB_USER};Pwd=${process.env.DB_PASSWORD}`;
}


app.use(cors());

app.use(express.urlencoded({extended: false}));
// Middleware to parse JSON requests
app.use(express.json());

// Get all users
app.get('/users', (req, res) => {
    const query = "SELECT * FROM users";
    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: 'Database error' });
        } 
        res.status(200).json(rows);
    });
});

app.get('/bankaccounts', (req, res) => {
    let { user, account_number, min_balance } = req.query; // Get query parameters

    let query = "SELECT * FROM bank_account WHERE 1=1"; // Always true condition
    let params = [];

    if (user) {
        query += " AND fk_user_id = ?";
        params.push(parseInt(user, 10)); // Ensure user ID is a number
    }
    if (account_number) {
        query += " AND account_number = ?";
        params.push(account_number);
    }
    if (min_balance) {
        query += " AND balance >= ?";
        params.push(parseFloat(min_balance)); // Ensure balance is a number
    }

    sql.query(connectionString, query, params, (err, rows) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(rows);
    });
});




// Get all transactions
app.get('/transactions', (req, res) => {
    const query = "SELECT * FROM transactions";
    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(rows);
    });
});

// Get transactions for a specific user
app.get('/transactions/:accountNumber', (req, res) => {
    const { accountNumber } = req.params;
    const query = `SELECT * FROM transactions WHERE from_account_number = ? OR to_account_number = ?`;
    sql.query(connectionString, query, [accountNumber, accountNumber], (err, rows) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(rows);
    });
});

app.post('/user', (req, res) => {
    const { social_security_number, full_name } = req.body;

    if (!social_security_number || !full_name) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const query = `INSERT INTO users (social_security_number, full_name) VALUES (?, ?)`;
    sql.query(connectionString, query, [social_security_number, full_name], (err) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.redirect('/success.html'); // Redirects after form submission
    });
});


// Make a transaction
app.post('/transaction', (req, res) => {
    const { from_account_number, to_account_number, amount, message } = req.body;
    const query = `EXEC spMakeTransaction @fromAccountNumber = ?, @toAccountNumber = ?, @amount = ?, @message = ?`;
    sql.query(connectionString, query, [from_account_number, to_account_number, amount, message], (err) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: 'Transaction failed' });
        }
        res.status(200).json({ message: 'Transaction completed successfully' });
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on port: http://localhost:${port}`);
});
