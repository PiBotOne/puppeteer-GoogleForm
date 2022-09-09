const puppeteer = require('puppeteer');

/**
 * Check for excel file goes here
    * const file = process.argv[2]
    * 
    * if no file
        * console.error('Please select excel file to read')
        * process.exit(1)
 */

(async () => {
    /**
     * Configure puppeteer properties if necessary
        * We can switch ofF headless mode for ease of debugging
     */
    const puppeteerProperties = {
        headless : true
    };

    /**
     * Load Excel and File Reader
     */
    const excelReader = require("./libs/readExcel.js");
    const excelReaderInstance = new excelReader('./skuRecord.xlsx');
    await excelReaderInstance.getJsonfromFile().then(async (data) => {
        /**
         * Launch browser with puppeteer
            * It will be possible to run multiple page instances (multiple forms at once?)
        */
        const browser = await puppeteer.launch(puppeteerProperties);

        /**
         * Add URL webpage here
            * If login to portal needs to be automated as well (considering session timeouts/cookie clear/etc) add login page url here
         */
        // await page.goto('https://www.loginUrl.com');

        /**
         * The code below should work on login page
            * Fill out the username and password by grabbing proper selector
            * Wait till navigated to next page
         */
        // await page.type('#usernameInput', 'BJBlazkowicz')
        // await page.type('#passwordInput', '#Password#')
    
        // await Promise.all([
        //   page.waitForNavigation(), // The promise resolves after navigation has finished
        //   page.click('#loginButton') // Clicking the link will indirectly cause a navigation
        // ]);

        console.log(data);

        data.forEach(async (value, index) => {
            /**
             * Create tab/page instance
            */
            const page = await browser.newPage();
    
            /**
             * Add URL webpage here
                * If login to portal needs to be automated as well (considering session timeouts/cookie clear/etc) add login page url here
             */
            await page.goto('https://docs.google.com/forms/d/1HhFqnAGUXfyNBTaf1-Th9Bg_sIgOQ8wnXsgEn9VVkd4/viewform?edit_requested=true&fbzx=-2911377340662628813');
    
            /**
             * Filling up the name field
             */
            const [nameInput] = await page.$x('//div[contains(@role, "listitem") and contains(., "Name")]//input');
            if(nameInput) {
                await nameInput.click({clickCount:3});
                await nameInput.type(value.Name);
                await page.screenshot({path: 'debugScreenNameInput.png'});
            }
    
            /**
             * Attempting to update radio button selection
             */
            // const selectedOption = 0;
            // const [targetRadioInput] = await page.$x('//div[contains(@role, "listitem") and contains(., "Field 1")]//div//div[2]//div[1]//div//div//div[' + selectedOption + ']');
            // if(targetRadioInput) {
            //     await targetRadioInput.hover();
            //     const radioInputClickArea = await targetRadioInput.$('label');
            //     await radioInputClickArea.click();
            //     await page.screenshot({path: 'debugScreenRadioInput.png'});
            // }
    
            await page.close();
    
            /**
             * Clicking Submit button
             */
            // const [submitButton] = await page.$x('//span[contains(., "Submit")]');
            // // await submitButton.click();
            // await Promise.all([
            //     page.waitForNavigation({waitUntil: 'networkidle2'}), // The promise resolves after navigation has finished
            //     submitButton.click() // Clicking the link will indirectly cause a navigation
            // ]);
    
            /**
             *  Grab that screen! Works great for debugging.
             */
            // await page.screenshot({path: 'debugScreen.png'});
        });

    }).catch((err) => {
        console.log(err);
    });
    // const xlsx = require('xlsx');
    // const fs = require('fs');

    /**
     * Read Excel file for form records
     */
    // fs.readFile('./skuRecord.xlsx', async (err, data) => {
    //     if(err) {
    //         console.log(err);
    //         return null;
    //     }
    //     const workbook = await xlsx.read(data, {
    //         type: 'array'
    //     });
    //     const firstSheetName = workbook.SheetNames[0];
    //     const worksheet = workbook.Sheets[firstSheetName];
    //     const jsonData = xlsx.utils.sheet_to_json(worksheet, {raw: true});

    //     jsonData.forEach(async (value, index) => {
    //     });
    // });

    /**
     *  Output logging goes here
     */
    // var createExcel = require("./libs/createExcel.js");
    // var spreadSheet = new createExcel('skuRecord', []);
    // spreadSheet.writeExcel();

    await browser.close();
})();