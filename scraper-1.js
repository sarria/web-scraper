const puppeteer = require('puppeteer');

async function scrapeWebsite(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});

    // Extracting metadata using page.evaluate()
    const metadata = await page.evaluate(() => {
        return {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content,
            keywords: document.querySelector('meta[name="keywords"]')?.content,
        };
    });

    // Other scraping operations should follow the same pattern
    // Ensure all DOM interactions are within page.evaluate()

    await browser.close();

    return {
        metadata,
        // include other scraped data here
    };
}

// Example usage
scrapeWebsite('https://priorityplumbing.ca').then(console.log).catch(console.error);
