const AWS = require('aws-sdk');
AWS.config.logger = console;
const s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'us-east-2'});
const fs = require('fs');

module.exports = class S3Uploader {

    bucket;

    constructor(bucket) {
        this.bucket = bucket;
    }

    async upload({file_name, domain, namespace}) {
        try {
            if (!this.bucket) throw new Error('Bucket not assigned, use init function for s3Uploader');
            const data = fs.createReadStream(file_name);
            const params = {Bucket: this.bucket, Key: domain + '/' + namespace + '/' + new Date().toISOString().split(':').join('-'), Body: data};
            const r = await s3.putObject(params).promise();
            return r;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}