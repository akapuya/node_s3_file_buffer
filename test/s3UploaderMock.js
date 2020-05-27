exportsuploaderMock = class {

    fail = false;
    files = [];

    forceFail(fail) {
        this.fail = fail;
    }

    async uploader({file_name, domain, namespace}) {
        if (!this.fail) this.files.push({file_name: file_name, domain: domain, namespace: namespace});
        return !fail;
    }

    getFiles () {
        return this.files;
    }

}