exportsuploaderMock = class {

    fail = false;

    forceFail(fail) {
        this.fail = fail;
    }

    async uploader({file_name, domain, namespace}) {
        return !fail;
    }

}