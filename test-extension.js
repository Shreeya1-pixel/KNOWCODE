// KNOWCODE Extension Test File
// This file demonstrates how the extension works

// Test 1: Simple Function
function addNumbers(a, b) {
    return a + b;
}

// Test 2: Array Processing
function processArray(items) {
    return items
        .filter(item => item.active)
        .map(item => ({ ...item, processed: true }))
        .sort((a, b) => a.id - b.id);
}

// Test 3: Class Example
class Calculator {
    constructor() {
        this.history = [];
    }
    
    add(a, b) {
        const result = a + b;
        this.history.push({ operation: 'add', a, b, result });
        return result;
    }
    
    getHistory() {
        return this.history;
    }
}

// Test 4: Async Function
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

// Test 5: Complex Logic
function findDuplicates(array) {
    const seen = new Set();
    const duplicates = new Set();
    
    for (const item of array) {
        if (seen.has(item)) {
            duplicates.add(item);
        } else {
            seen.add(item);
        }
    }
    
    return Array.from(duplicates);
}

console.log('KNOWCODE Extension Test File Ready!');
console.log('Select any function above and press Cmd+Shift+5 to see it explained!');
