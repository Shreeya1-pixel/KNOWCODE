// KNOWCODE Sample File - Demonstrates various code patterns for testing

// Variable declarations
const userName = "John Doe";
let userAge = 25;
var userEmail = "john@example.com";

// Function definitions
function calculateSum(a, b) {
    return a + b;
}

const multiply = (x, y) => {
    return x * y;
};

async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// Class definition
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }

    getDisplayName() {
        return `${this.name} (${this.email})`;
    }

    async updateProfile(updates) {
        try {
            const response = await fetch(`/api/users/${this.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
}

// Control flow examples
function processUserData(users) {
    const processedUsers = [];
    
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        
        if (user.age >= 18) {
            if (user.isActive) {
                processedUsers.push({
                    ...user,
                    status: 'active_adult'
                });
            } else {
                processedUsers.push({
                    ...user,
                    status: 'inactive_adult'
                });
            }
        } else {
            processedUsers.push({
                ...user,
                status: 'minor'
            });
        }
    }
    
    return processedUsers;
}

// Promise chain example
function getUserPosts(userId) {
    return fetch(`/api/users/${userId}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        })
        .then(posts => {
            return posts.filter(post => post.isPublished);
        })
        .catch(error => {
            console.error('Error getting user posts:', error);
            return [];
        });
}

// Array methods
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evenNumbers = numbers.filter(num => num % 2 === 0);
const doubledNumbers = numbers.map(num => num * 2);
const sum = numbers.reduce((acc, num) => acc + num, 0);

// Object destructuring and spread
const user = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    preferences: {
        theme: 'dark',
        notifications: true
    }
};

const { name, email, preferences: { theme } } = user;
const userCopy = { ...user, lastLogin: new Date() };

// Template literals
const greeting = `Hello, ${name}! Welcome back.`;
const multilineString = `
    This is a multiline
    string using template
    literals in JavaScript.
`;

// Export statements
export { User, calculateSum, multiply, fetchUserData };
export default processUserData; 