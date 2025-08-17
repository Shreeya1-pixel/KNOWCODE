// Sample code for testing KNOWCODE features
// Try selecting different parts and using KNOWCODE commands!

function calculateFibonacci(n) {
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

function processUserData(users) {
    return users
        .filter(user => user.status === 'active')
        .map(user => ({
            ...user,
            processed: true,
            score: user.age * 2 + user.experience
        }))
        .sort((a, b) => b.score - a.score);
}

class DataProcessor {
    constructor(data) {
        this.data = data;
        this.cache = new Map();
    }

    async processWithCache(key, processor) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        const result = await processor(this.data);
        this.cache.set(key, result);
        return result;
    }

    clearCache() {
        this.cache.clear();
    }
}

// Example usage
const users = [
    { name: 'Alice', age: 25, experience: 3, status: 'active' },
    { name: 'Bob', age: 30, experience: 5, status: 'inactive' },
    { name: 'Charlie', age: 28, experience: 4, status: 'active' }
];

const processor = new DataProcessor(users);
const result = processUserData(users);

console.log('Processed users:', result);
console.log('Fibonacci of 10:', calculateFibonacci(10)); 