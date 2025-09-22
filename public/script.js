let token = null;
let username = null;
let userRole = 'User'; // Default role

async function login() {
    const usernameInput = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (!usernameInput || !password) {
        errorMessage.textContent = 'Please enter both username and password.';
        errorMessage.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password })
        });
        const data = await response.json();

        if (data.token) {
            token = data.token;
            username = usernameInput;
            userRole = 'User'; // Set default role on login
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            document.getElementById('user-info').textContent = `Logged in as: ${username} (Role: ${userRole})`;
            document.getElementById('welcome-banner').querySelector('h2').textContent = `Welcome, ${username}!`;
            showHome(); // Show Home content by default
        } else {
            errorMessage.textContent = 'Login failed: Invalid credentials.';
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        errorMessage.textContent = 'Error connecting to server.';
        errorMessage.classList.remove('hidden');
    }
}

function showHome() {
    const content = `
        <h2 class="text-xl font-semibold mb-4">Your Banking Dashboard</h2>
        <p class="text-gray-700">Welcome to your FinCorp banking dashboard, ${username}. Manage your accounts and financial activities securely.</p>
        <ul class="list-disc list-inside mt-4 text-gray-700">
            <li><strong>Account Balance:</strong> $5,432.10</li>
            <li><strong>Recent Transactions:</strong>
                <ul class="list-disc list-inside ml-4">
                    <li>Deposit: $1,000.00 (2025-09-20)</li>
                    <li>Withdrawal: $250.00 (2025-09-21)</li>
                    <li>Transfer: $500.00 to Savings (2025-09-22)</li>
                </ul>
            </li>
            <li><strong>Available Services:</strong> View statements, transfer funds, or contact support.</li>
        </ul>
    `;
    document.getElementById('content').innerHTML = content;
}

function showAbout() {
    const content = `
        <h2 class="text-xl font-semibold mb-4">About FinCorp</h2>
        <p class="text-gray-700">FinCorp is a trusted financial institution dedicated to providing secure and innovative banking solutions.</p>
        <ul class="list-disc list-inside mt-4 text-gray-700">
            <li><strong>Mission:</strong> Empowering customers with reliable financial services for a prosperous future.</li>
            <li><strong>Services:</strong> Personal banking, wealth management, and corporate finance.</li>
            <li><strong>Commitment:</strong> Ensuring the highest standards of security and customer satisfaction.</li>
        </ul>
        <p class="mt-4 text-gray-700">Contact our support team for personalized assistance.</p>
    `;
    document.getElementById('content').innerHTML = content;
}

async function showAdmin() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<p class="text-gray-500">Loading...</p>';

    try {
        const response = await fetch('/admin', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            userRole = 'Admin'; // Update role on successful admin access
            document.getElementById('user-info').textContent = `Logged in as: ${username} (Role: ${userRole})`;
            document.getElementById('welcome-banner').querySelector('h2').textContent = `Welcome, Admin!`;
            contentDiv.innerHTML = `
                <h2 class="text-xl font-semibold mb-4">FinCorp Admin Portal</h2>
                <p class="text-gray-700">Access to sensitive financial data is restricted to authorized administrators only.</p>
                <ul class="list-disc list-inside mt-4 text-gray-700">
                    <li><strong>Total Customer Accounts:</strong> 10,245</li>
                    <li><strong>Total Transaction Volume:</strong> $12,345,678.90 (September 2025)</li>
                    <li><strong>Critical Financial Data:</strong>
                        <ul class="list-disc list-inside ml-4">
                            <li>Customer Account Balances: Confidential</li>
                            <li>Recent Transactions (All Customers):
                                <ul class="list-disc list-inside ml-4">
                                    <li>Account #XXXX1234: Transfer $5,000 (2025-09-20)</li>
                                    <li>Account #XXXX5678: Deposit $10,000 (2025-09-21)</li>
                                    <li>Account #XXXX9012: Withdrawal $2,000 (2025-09-22)</li>
                                </ul>
                            </li>
                            <li>Pending Approvals: 15 high-value transactions</li>
                        </ul>
                    </li>
                </ul>
                <p class="mt-4 text-red-600 font-semibold">Warning: This data is highly confidential and for administrative use only.</p>
            `;
        } else {
            userRole = 'User';
            document.getElementById('user-info').textContent = `Logged in as: ${username} (Role: ${userRole})`;
            document.getElementById('welcome-banner').querySelector('h2').textContent = `Welcome, ${username}!`;
            contentDiv.innerHTML = `
                <h2 class="text-xl font-semibold mb-4 text-red-600">Access Denied</h2>
                <p class="text-gray-700">The Admin Portal is restricted to authorized administrators only. Please contact FinCorp support for assistance.</p>
            `;
        }
    } catch (error) {
        userRole = 'User';
        document.getElementById('user-info').textContent = `Logged in as: ${username} (Role: ${userRole})`;
        document.getElementById('welcome-banner').querySelector('h2').textContent = `Welcome, ${username}!`;
        contentDiv.innerHTML = `
            <h2 class="text-xl font-semibold mb-4 text-red-600">Error</h2>
            <p class="text-gray-700">Unable to connect to the server. Please try again or contact FinCorp support.</p>
        `;
    }
}
