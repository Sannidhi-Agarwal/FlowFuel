// Scraper Configuration
module.exports = {
    // Default configuration settings
    defaultSettings: {
        requestDelay: 1000, // Delay between requests in milliseconds
        timeout: 30000,     // Request timeout in milliseconds
        retries: 3,         // Number of retry attempts for failed requests
    },
    
    // User agent settings
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    // Add your target URLs and specific configurations here
    targets: {
        // Example:
        // targetName: {
        //     url: 'https://example.com',
        //     selector: '.example-class',
        // }
    }
};
