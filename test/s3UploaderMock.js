const fs = require('fs');

exports.uploaderMock = class {

    fail = false;
    files = [];
    saveFiles = false;

    constructor(saveFiles) {
        this.saveFiles = saveFiles;
    }
    forceFail(fail) {
        this.fail = fail;
    }

    async upload({file_name, domain, namespace}) {
        if (this.saveFiles) fs.copyFileSync(file_name, file_name + '_save');
        if (!this.fail) this.files.push({file_name: file_name, domain: domain, namespace: namespace});
        return !this.fail;
    }

    getFiles () {
        return this.files;
    }

}