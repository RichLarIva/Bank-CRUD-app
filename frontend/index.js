async function createTransaction() {
    // Get the values from the input fields
    const fromAccount = document.getElementById('fromAccount').value;
    const toAccount = document.getElementById('toAccount').value;
    const amount = document.getElementById('amount').value;
    const message = document.getElementById('message').value;

    // Clear any previous response message
    document.getElementById('responseMessage').textContent = '';

    // Check if all required fields are filled
    if (!fromAccount || !toAccount || !amount) {
        document.getElementById('responseMessage').textContent = 'Please fill in all required fields.';
        return;
    }

    const transactionData = {
        from_account_number: fromAccount,
        to_account_number: toAccount,
        amount: parseFloat(amount),
        message: message || null
    };

    try {
        // Send POST request to the backend API
        const response = await fetch('http://localhost:6829/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });

        // Check if the response is successful
        if (response.ok) {
            const data = await response.json();
            document.getElementById('responseMessage').textContent = data.message;
            document.getElementById('responseMessage').className = 'success';
        } else {
            const error = await response.json();
            document.getElementById('responseMessage').textContent = error.error || 'An error occurred.';
            document.getElementById('responseMessage').className = 'error';
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent = 'Failed to make transaction. Please try again.';
        document.getElementById('responseMessage').className = 'error';
    }
}