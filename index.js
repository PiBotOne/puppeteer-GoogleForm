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
    // const excelReader = require("./libs/readExcel.js");
    // const excelReaderInstance = new excelReader('./skuRecord.xlsx');
    // await excelReaderInstance.getJsonfromFile().then(async (data) => {}).catch((data) => {});
    const data = require("./data/newData.js");                              // Using json data from local file
    if(data.length) {                                                       // If data exists proceed with loading browser
        let logger = [];

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

        /**
         * Iterate data and process form for each entry
         */
        // data.forEach(async (value, index) => {
        for(let i = 0; i < data.length; i++) {
            /**
             * Create tab/page instance
             */
            const page = await browser.newPage();
            let error = null;

            /**
             * Add URL webpage here
                * Address to the form page should go here
                * In case login is automated we can emulate the navigation to required form here instead of adding form page url
            */
            // await page.goto('https://docs.google.com/forms/d/1HhFqnAGUXfyNBTaf1-Th9Bg_sIgOQ8wnXsgEn9VVkd4/viewform?edit_requested=true&fbzx=-2911377340662628813');
            switch(data[i].type) {
                case "Google":
                    await page.goto(
                        'https://docs.google.com/forms/d/e/1FAIpQLScxceaEO1uhazL5R1vQprQvCrjSR5V9LebLWzk53-xfBe_TAw/viewform?usp=sf_link',
                        'domcontentloaded'
                    ).catch(exception => {
                        error = exception.message;
                    });
                    break;
                case "Amazon":
                    await page.goto(
                        'https://docs.google.com/forms/d/e/1FAIpQLSdHyEt2dDl91R6tkgLc3H_JSUxQlkTKvNVoZw82iAucNEwP1A/viewform?usp=sf_link',
                        'domcontentloaded'
                    ).catch(exception => {
                        error = exception.message;
                    });
                    break;
                default:
                    break;
            }

            if(error !== null) {
                let screenShotError = null;
                let errorType = 'redirection';
                await page.screenshot({ type: 'jpeg', path: 'output/' + errorType + '_' + data[i].id + '.jpeg', fullPage: true }).catch(exception => {
                    screenShotError = exception.message;
                });
                
                logger.push({
                    id:         data[i].id,
                    type:       errorType,
                    error:      error,
                    screenshot: screenShotError
                });
                await page.close();
                continue;
            }

            let manipulationErrors = [];

            /**
             * Form manipulation code after this is native only to the specific google form used here
             * The form manipulaiton code needs to be updated based on the form being edited
             */
            /**
             * Filling up the name field
             */
            const nameInputXPath = '/html/body/div/div[2]/form/div[2]/div/div[2]/div[1]/div/div/div[2]/div/div[1]/div/div[1]/input';
            await page
                .waitForXPath(nameInputXPath)
                .then(async () => {
                    const [nameInput] = await page.$x(nameInputXPath).catch(exception => {
                        manipulationErrors.push(exception.message);
                    });
                    if(nameInput) {
                        await nameInput.click({clickCount :  3}).catch(exception => {
                            manipulationErrors.push(exception.message);
                        });
                        await nameInput.type(data[i].name).catch(exception => {
                            manipulationErrors.push(exception.message);
                        });
                    }
                });

            /**
             * Updating radio button selection
             */

            const field1SelectedOption = data[i].field_1;
            if(field1SelectedOption) {
                const field1SelectedOptionXPath = '/html/body/div/div[2]/form/div[2]/div/div[2]/div[2]/div/div/div[2]/div[1]/div/span/div/div[' + field1SelectedOption + ']/label/div/div[2]/div/span';
                await page
                    .waitForXPath(field1SelectedOptionXPath)
                    .then(async () => {
                        const [targetRadioInput] = await page.$x(field1SelectedOptionXPath).catch(exception => {
                            manipulationErrors.push(exception.message);
                        });
                        await targetRadioInput.hover().catch(exception => {
                            manipulationErrors.push(exception.message);
                        });
                        await targetRadioInput.click().catch(exception => {
                            manipulationErrors.push(exception.message);
                        });
                    });
            }
            if(field1SelectedOption) {
            }

            /**
             * Updating check box selection
             */
            const field2NumberOfSelections = data[i].field_2;
            if(field2NumberOfSelections) {
                for(let j = 1; j <= field2NumberOfSelections; j++) {
                    const targetCheckInputXPath = '/html/body/div[1]/div[2]/form/div[2]/div/div[2]/div[3]/div/div/div[2]/div[1]/div[' + j + ']/label/div/div[2]/div/span'
                    await page
                        .waitForXPath(targetCheckInputXPath)
                        .then(async () => {
                            const [targetCheckInput] = await page.$x(targetCheckInputXPath).catch(exception => {
                                manipulationErrors.push(exception.message);
                            });
                            if(targetCheckInput) {
                                await targetCheckInput.hover().catch(exception => {
                                    manipulationErrors.push(exception.message);
                                });
                                await targetCheckInput.click().catch(exception => {
                                    manipulationErrors.push(exception.message);
                                });
                            }
                        });
                }
            }

            /**
             * Updating dropdown selection                                      // Needs work
             */
            // const field3SelectedOption = data[i].field_3;
            // if(field3SelectedOption) {
            //     const [targetDropdown] = await page.$x('/html/body/div[1]/div[3]/form/div[2]/div/div[2]/div[4]/div/div/div[2]/div/div[1]/div[2]');
            //     await targetDropdown.hover();
            //     await targetDropdown.click();
            //     const [targetDropdownInput] = await page.$x('/html/body/div[1]/div[3]/form/div[2]/div/div[2]/div[4]/div/div/div[2]/div/div[1]/div[1]/div[' + (field3SelectedOption + 2) + ']/span');
            //     await targetDropdownInput.click();
            //     await delay(2000);
            //     await page.screenshot({path: 'debugScreenDropdownInput_' + i + '.png'});
            // }

            /**
             *  Grab the form screenshot
             */
            // await page.screenshot({ type: 'jpeg', path: 'form_' + i + '.jpeg', fullPage: true });

            /**
             * Clicking Submit button
             */
            const submitButtonXPath = '/html/body/div/div[2]/form/div[2]/div/div[3]/div[1]/div[1]/div/span/span';
            const [submitButton] = await page.$x(submitButtonXPath).catch(exception => {
                manipulationErrors.push(exception.message);
            });
            await Promise.all([
                await submitButton.click().catch(exception => {
                    manipulationErrors.push(exception.message);
                }), // Clicking the link will indirectly cause a navigation
                page.waitForNavigation({waitUntil: 'networkidle2'}).catch(exception => {
                    error = exception.message;
                }) // The promise resolves after navigation has finished
            ]);

            if(manipulationErrors.length) {
                let screenShotError = null;
                let errorType = 'manipulation';
                await page.screenshot({ type: 'jpeg', path: 'output/' + errorType + '_' + data[i].id + '.jpeg', fullPage: true }).catch(exception => {
                    screenShotError = exception.message;
                });
                
                logger.push({
                    id:         data[i].id,
                    type:       errorType,
                    error:      manipulationErrors,
                    screenshot: screenShotError
                });
            }

            if(error !== null) {
                let screenShotError = null;
                let errorType = 'redirection';
                await page.screenshot({ type: 'jpeg', path: 'output/' + errorType + '_' + data[i].id + '.jpeg', fullPage: true }).catch(exception => {
                    screenShotError = exception.message;
                });
                
                logger.push({
                    id:         data[i].id,
                    type:       errorType,
                    error:      error,
                    screenshot: screenShotError
                });
            }

            /**
             *  Grab that screen after success! Works great for debugging.
             */
            // await page.screenshot({ type: 'jpeg', path: 'success_' + i + '.jpeg', fullPage: true });

            /**
             * Remove tab/page instance
             */
            await page.close();
        }

        /**
         * Delay method 
         */
        function delay(time) {
            return new Promise(function(resolve) { 
                setTimeout(resolve, time)
            });
        }
        
        // });

        /**
         * Remove browser instance
         */
        await browser.close();

        /**
         *  Output logging goes here
         */
        if(logger.length) {
            var createExcel = require("./libs/createExcel.js");
            var spreadSheet = new createExcel('output/skuUpdationLog', [], logger);
            spreadSheet.writeExcel();
        }
    }
})();