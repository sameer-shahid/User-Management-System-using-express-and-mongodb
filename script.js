let currentPage = 1;
const limit = 10;
let totalPages = 1;

// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// Fetch Users
async function fetchUsers(page = 1, searchQuery = '') {
    try {
        const response = await fetch(`${API_BASE_URL}/search?page=${page}&limit=${limit}&query=${searchQuery}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
}

// Add User
async function addUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding user:', error);
        return null;
    }
}

// Update User
async function updateUser(id, userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
}

// Delete User
async function deleteUser(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting user:', error);
        return null;
    }
}

// Render Users Table
function renderUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.email}</td>
            <td>${user.gender}</td>
            <td>
                <button class="action-btn edit-btn" onclick="handleEdit(${user.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="handleDelete(${user.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle Form Submit
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        gender: document.getElementById('gender').value
    };

    const result = await addUser(userData);
    if (result && result.status === 'success') {
        loadUsers();
        e.target.reset();
    }
});

// Handle Search
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage = 1;
        loadUsers(e.target.value);
    }, 500);
});

// Handle Pagination
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadUsers();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadUsers();
    }
});

// Handle Edit
async function handleEdit(id) {
    const firstName = prompt('Enter new first name:');
    const lastName = prompt('Enter new last name:');
    const email = prompt('Enter new email:');
    const gender = prompt('Enter new gender:');

    if (firstName && lastName && email && gender) {
        const result = await updateUser(id, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            gender: gender
        });
        
        if (result && result.status === 'success') {
            loadUsers();
        }
    }
}

// Handle Delete
async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const result = await deleteUser(id);
        if (result && result.status === 'success') {
            loadUsers();
        }
    }
}

// Initial Load
async function loadUsers(searchQuery = '') {
    const data = await fetchUsers(currentPage, searchQuery);
    if (data && data.status === 'success') {
        renderUsers(data.data);
        totalPages = Math.ceil(data.total / limit);
        document.getElementById('currentPage').textContent = `Page ${currentPage}`;
    }
}

// Load users when page loads
loadUsers(); 