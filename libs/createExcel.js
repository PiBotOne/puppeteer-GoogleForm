class createExcel {
    constructor(fileNameTemplate, properties, data) {
        this.fileNameTemplate = fileNameTemplate;
        this.properties = properties;
        this.data = data;

        var excel = require('excel4node');
        this.workbook = new excel.Workbook();

        this.style = this.workbook.createStyle({
            font: {
                color: '#000000',
                size: 12
            }
        });
    }
    getOption() {
        var min = 1;
        var max = 5;
        return Math.floor(
            Math.random() * (max - min) + min
        );
    }
    writeExcel() {
        let data = this.data;
        var worksheet = this.workbook.addWorksheet('Sheet 1');

        worksheet.cell(1, 1).string('id').style(this.style);
        worksheet.cell(1, 2).string('type').style(this.style);
        worksheet.cell(1, 3).string('error').style(this.style);
        worksheet.cell(1, 4).string('screenshot').style(this.style);

        for (let i = 0; i < data.length; i++) {
            let rowNumber = i + 2;
            worksheet.cell(rowNumber, 1).string(data[i].id).style(this.style);

            worksheet.cell(rowNumber, 2).string(data[i].type).style(this.style);

            if(typeof(data[i].error) === 'object') {
                data[i].error = data[i].error.join(",\n");
            }

            worksheet.cell(rowNumber, 3).string(data[i].error).style(this.style);

            let screenshotPath = '../output/';
            let screenshotFileName = data[i].type + '_' + data[i].id + '.jpeg';
            console.log(screenshotFileName);
            const fs = require("fs");
            if (fs.existsSync(screenshotPath + screenshotFileName)) {
                worksheet.cell(rowNumber, 4).link(screenshotFileName).style(this.style);
            } else {
                worksheet.cell(rowNumber, 4).string('N/A').style(this.style);
            }
            
        }

        // timestamp in milliseconds
        let timestamp = Date.now();
        this.workbook.write('./' + this.fileNameTemplate + '_' + timestamp + '.xlsx');
    }
};


module.exports = createExcel;
