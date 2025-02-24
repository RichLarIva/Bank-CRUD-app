IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'bankdatabase')
BEGIN
	CREATE DATABASE [bankdatabase];
	PRINT 'EXECUTED';
END;
GO
USE bankdatabase
GO

IF NOT EXISTS (
        SELECT 1
        FROM sys.tables
        WHERE name = 'users'
            AND type = 'U'
        )
BEGIN
    CREATE TABLE users (
        id INT PRIMARY KEY IDENTITY(1, 1),
		social_security_number VARCHAR(13) UNIQUE NOT NULL,
		full_name VARCHAR(100) NOT NULL
        )
	ALTER TABLE users
		ADD CONSTRAINT ck_social_security_number CHECK(DATALENGTH(social_security_number) = 13)
END;
GO


IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'bank_account' AND type = 'U')
BEGIN
	CREATE TABLE bank_account(
		id INT PRIMARY KEY IDENTITY(1, 1),
		account_number INT UNIQUE NOT NULL,
		balance MONEY NOT NULL,
		account_name VARCHAR(255) NOT NULL,
		fk_user_id INT FOREIGN KEY(fk_user_id)
		REFERENCES users(id)
		ON DELETE CASCADE
	)
END;
GO



IF NOT EXISTS (
        SELECT 1
        FROM sys.tables
        WHERE name = 'transactions'
            AND type = 'U'
        )
BEGIN
    CREATE TABLE transactions (
        id INT PRIMARY KEY IDENTITY(1, 1),
        from_account_number INT NOT NULL,
        to_account_number INT NOT NULL,
        amount MONEY NOT NULL,
        message NVARCHAR(MAX), -- Added column for message or OCR data
        transaction_date DATETIME DEFAULT GETDATE()
        )
END;
GO

CREATE OR ALTER PROCEDURE spMakeTransaction
    @fromAccountNumber INT,
    @toAccountNumber INT,
    @amount MONEY,
    @message NVARCHAR(MAX) = NULL -- Added parameter for message or OCR data
AS
BEGIN
    DECLARE @fromBalance MONEY;
    DECLARE @toBalance MONEY;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Get the current balances of the accounts
        SELECT @fromBalance = balance FROM bank_account WHERE account_number = @fromAccountNumber;
        SELECT @toBalance = balance FROM bank_account WHERE account_number = @toAccountNumber;

        -- Check if the from account has enough balance for the transaction
        IF @fromBalance >= @amount
        BEGIN
            -- Update the balances
            UPDATE bank_account SET balance = @fromBalance - @amount WHERE account_number = @fromAccountNumber;
            UPDATE bank_account SET balance = @toBalance + @amount WHERE account_number = @toAccountNumber;

            -- Record the transaction
            INSERT INTO transactions (from_account_number, to_account_number, amount, message) 
            VALUES (@fromAccountNumber, @toAccountNumber, @amount, @message);

            COMMIT TRANSACTION;
        END
        ELSE
        BEGIN
            -- Rollback the transaction if there's not enough balance
            ROLLBACK TRANSACTION;
            RAISERROR('Insufficient balance in the from account.', 16, 1);
        END
    END TRY
    BEGIN CATCH
        -- Rollback the transaction if any error occurs
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Raise the error
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;
        
        SELECT @ErrorMessage = ERROR_MESSAGE(),
               @ErrorSeverity = ERROR_SEVERITY(),
               @ErrorState = ERROR_STATE();
        
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

USE bankdatabase
GO

-- Example of retrieving transactions involving a specific account number
DECLARE @accountNumber INT = 2070487202; -- Replace with the account number you want to query

-- Query transactions where the specified account number is either the sender or receiver
SELECT *
FROM transactions
WHERE from_account_number = @accountNumber OR to_account_number = @accountNumber;

USE bankdatabase
GO


SELECT * FROM users;

SELECT * FROM bank_account;

SELECT * FROM transactions;

-- Example of transferring money between two accounts
DECLARE @fromAccountID INT = 2070487202; -- ID of the account from which money will be transferred
DECLARE @toAccountID INT = 429955726; -- ID of the account to which money will be transferred
DECLARE @amount MONEY = 200.23; -- Amount of money to transfer
DECLARE @message NVARCHAR(MAX) = N'045369905364';

-- Execute the procedure to make the transaction
EXEC spMakeTransaction @fromAccountID, @toAccountID, @amount, @message;

SELECT * FROM bank_account;

SELECT * FROM transactions;

