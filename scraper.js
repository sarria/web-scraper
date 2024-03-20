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

    // Extracting images with duplication check
    const images = await page.evaluate(() => {
        const uniqueUrls = new Set();
        return Array.from(document.images)
            .filter((img) => {
                // Ignore images encoded in data URLs
                return !img.src.startsWith('data:');
            })
            .map((img) => ({
                url: img.src,
                link: img.closest('a') ? img.closest('a').href : '',
            }))
            // Filter out duplicate images based on the 'url' property
            .filter((image) => {
                const isDuplicate = uniqueUrls.has(image.url);
                uniqueUrls.add(image.url);
                return !isDuplicate;
            });
    });


    // Attempt to find a logo by common class names or IDs (this might need customization)
    const logos = await page.evaluate(() => {
        const logoImg = document.querySelector('img.logo, img[alt*="logo"], #logo img');
        return logoImg ? [{ url: logoImg.src }] : [];
    });    

    await browser.close();

    return {
        metadata,
        // include other scraped data here
        images,
        logos,
    };
}

// Check if a URL was provided as a command-line argument
if(process.argv.length < 3) {
    console.log("Usage: node scraper.js <URL>");
    process.exit(1);
}


// Example usage
// scrapeWebsite('https://priorityplumbing.ca/drain-sewer/').then(console.log).catch(console.error);

const targetUrl = process.argv[2]; // Take the URL from the command line
scrapeWebsite(targetUrl)
    .then(console.log) // Output the result
    .catch(console.error); // Or output the error
