const config = require('./config');

class Scraper {
    constructor(options = {}) {
        this.config = {
            ...config.defaultSettings,
            ...options
        };
    }

    // Add your scraping methods here
    async init() {
        // Initialize your scraper
        console.log('Scraper initialized with config:', this.config);
    }

    async scrape() {
        // Implement your scraping logic here
        throw new Error('Scrape method must be implemented');
    }

    async close() {
        // Cleanup method
        console.log('Scraper closed');
    }
}

module.exports = Scraper;
