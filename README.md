# Bank CRUD app 
A simple bank API that simulates the basic workings of a bank, allowing users to manage accounts, transactions, and users. Currently a side project I am working on.

---

## **Prerequisites**
Before running this project, ensure you have the following installed:

- **Node.js** (Latest LTS version recommended) → [Download](https://nodejs.org/)  
- **SQL Server** (MSSQL) → [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)  
- **ODBC Driver 17 for SQL Server** → [Download](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)  
- **Git** (for version control, optional) → [Download](https://git-scm.com/)  

---

## **1️⃣ Installation**
### **Clone the Repository**
```sh
git clone https://github.com/RichLarIva/Bank-CRUD-app
cd bank-crud-app
npm install
```

Set Up Environment Variables
1. Create a ```.env``` file in the project root:
```sh 
touch .env
```
2. Open ```.env``` and add the following:
```sh
    PORT=6829
    DB_SERVER=your_server_name
    DB_NAME=bankdatabase
    DB_TRUSTED_CONNECTION=Yes
    DB_DRIVER={ODBC Driver 17 for SQL Server}
```
If you use SQL authenticaion, add:
```sh
    DB_USER=your_username
    DB_PASSWORD=your_password
```

3. **IMPORTANT**: Do not commit ```.env```! Add it to ```.gitignore```

---

## **2️⃣ Running the project**
### **Start the server**
```sh
npm start
``` 
or, if using ```nodemon``` (Recommended for development):
```sh
nodemon app.mjs
``` 
The server will start at:
🔗 http://localhost:6829

---

## **3️⃣ API Endpoints**
### **Users**
| Method | Endpoint | Description |
| -------- | ------- | ------- |
| GET | ```/users``` | Fetch all users |
| POST | ```/user``` | Add a new user |
### **Bank Accounts**
| Method | Endpoint | Description |
| -------- | ------- | ------- |
| GET | ```/bankaccounts``` | Fetch all bank accounts |
| GET | ```/bankaccounts?user=123``` | Fetch accounts for user ```123``` |
| GET | ```/bankaccounts?min_balance=500``` | Accounts with balance ≥ 500 |
| GET | ```/bankaccounts?account_number=1351``` | Fetches the Bank account with the account number of ```1351``` |
### **Transactions**
| Method | Endpoint | Description |
| -------- | ------- | ------- |
| GET | ```/transactions``` | Fetch all transactions |
| GET | ```/transactions/:accountNumber``` | Fetch transactions for an account |
| POST | ```/transaction``` | Make a transaction |
---
## **4️⃣ Development & Debugging**
* To restart austomatically on code changes, use:
  ```sh
  nodemon app.mjs
  ```
* To check for syntax issues:
    ```sh
    npm run lint 
    ```
---
## **5️⃣ Troubleshooting**
### 1. ```nodemon.ps1 cannot be loaded because running scripts is disabled ```
* Run the following PowerShell (Admin):
```ps 
Set-ExecutionPolicy Unrestricted -Scope CurrentUser
```
### 2. ```ConnectionError: [Microsoft][ODBC Driver 17 for SQL Server]...```
* Ensure SQL Server is running and that the ODBC Driver 17 for SQL Server is installed.
* If using SQL authentication, ensure DB_USER and DB_PASSWORD are correctly set in .env.

### 3. ```.env``` Variables Not Loading
* Ensure you installed dotenv:
  ```sh
  npm install dotenv
  ```
* Make sure you restart the server after changing ```.env```.

--- 

## **6️⃣ Contributing**
Contributions are welcome! To contribute:
1. Fork the repo and create a new branch:
```sh
git checkout -b feature-new
```
2. Make changes and commit:
```sh
git commit -m "Added a new feature"
```
3. Push changes and create a **Pull Request.**
---

## **7️⃣ License**
📜 MIT License – Free to use and modify.

---
🚀 Happy Coding!