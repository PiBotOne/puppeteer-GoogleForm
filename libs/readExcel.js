class readExcel {
    constructor(file) {
        this.file = file;

        this.xlsx = require('xlsx');
        this.fs = require('fs');
    }
    async getJsonfromFile() {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.fs.readFile(self.file, async (err, data) => {
                if(err) {
                    return reject(err);
                }

                const workbook = self.xlsx.read(data, {
                    type: 'array'
                });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = self.xlsx.utils.sheet_to_json(worksheet, {raw: true});
                return resolve(jsonData);
            });
        });
    }
};

module.exports = readExcel;
