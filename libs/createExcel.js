class createExcel {
    constructor(fileName, properties) {
        this.fileName = fileName;
        this.properties = properties;

        var excel = require('excel4node');
        this.workbook = new excel.Workbook();

        this.style = this.workbook.createStyle({
            font: {
                color: '#000000',
                size: 12
            }
        });

        this.str = require('@supercharge/strings');
    }
    getOption() {
        var min = 1;
        var max = 5;
        return Math.floor(
            Math.random() * (max - min) + min
        );
    }
    writeExcel() {
        var worksheet = this.workbook.addWorksheet('Sheet 1');

        let i = 1;

        worksheet.cell(i, 1).string('Name').style(this.style);
        worksheet.cell(i, 2).string('Field 1').style(this.style);
        worksheet.cell(i, 3).string('Field 2').style(this.style);
        worksheet.cell(i, 4).string('Field 3').style(this.style);
        worksheet.cell(i, 5).string('Field 4').style(this.style);
        worksheet.cell(i, 6).string('Field 5').style(this.style);

        for (i = 2; i <= 401; i++) {
            worksheet.cell(i, 1).string(this.str.random(50)).style(this.style);

            worksheet.cell(i, 2).number(this.getOption()).style(this.style);

            const selectedCount = this.getOption();
            let selectedOptions = new Array();
            for (let j = 0; j < selectedCount; j++) {
                const option = this.getOption();
                if (selectedOptions.indexOf(option) !== -1) {
                    continue;
                }
                selectedOptions.push(option);
            }
            selectedOptions = selectedOptions.join(', ');
            worksheet.cell(i, 3).string(selectedOptions).style(this.style);

            worksheet.cell(i, 4).number(this.getOption()).style(this.style);

            worksheet.cell(i, 5).number(this.getOption()).style(this.style);

            worksheet.cell(i, 6).number(this.getOption()).style(this.style);
        }

        this.workbook.write('./' + this.fileName + '.xlsx');
    }
};


module.exports = createExcel;
