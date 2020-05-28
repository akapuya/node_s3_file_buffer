
const assert = require('assert');
const expect = require('chai').expect;
const uploaderMock = require('./S3UploaderMock').uploaderMock;
const randJson = require('../examples/jsons').getRandJson;
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const bufferModule = require('../index');

describe('append test', async () => {
    it('Basic functionality test', async () => {
        let buffer = new bufferModule.JsonBufferStreamer(new uploaderMock(), 'test/data', null, 0);
        let r;
        buffer.open('test_ns', 'ns1', 100000, 60);
        for (i = 0;i<100;i++) {
            r = await buffer.append('test_ns', 'ns1',  randJson());
        }
        expect(r).to.equal(true);
        await buffer.close('test_ns', 'ns1');
        await buffer.shutDown();
        delete  buffer;
    });
    it('Size limit flush', async () => {
        let uploader = new uploaderMock();
        let buffer = new bufferModule.JsonBufferStreamer(uploader, 'test/data', null, 0);
        let r;
        buffer.open('test_ns', 'ns2', 4000, 0); // 1K size limit, no time limit
        for (i = 0;i<5;i++) {
            r = await buffer.append('test_ns', 'ns2',  randJson());
        }
        await buffer.close('test_ns', 'ns2');
        expect (uploader.getFiles().length).to.eq(2);
        await buffer.shutDown();
        delete  buffer;
    });
    it('time limit flush', async () => {
        let uploader = new uploaderMock();
        let buffer = new bufferModule.JsonBufferStreamer(uploader, 'test/data', null, 5);
        let r;
        buffer.open('test_ns', 'ns3', 4000000, 5); // 1K size limit, no time limit
        for (i = 0;i<10;i++) {
            r = await buffer.append('test_ns', 'ns3',  randJson());
        }
        await sleep(6000);
        expect (uploader.getFiles().length).to.eq(1);
        await buffer.close('test_ns', 'ns3');
        await buffer.shutDown();
        delete  buffer;
    }).timeout(20000);
    it('docs content correct', async () => {
        const docs = [];
        let uploader = new uploaderMock(true);
        let buffer = new bufferModule.JsonBufferStreamer(uploader, 'test/data', null, 0);
        buffer.open('test_ns', 'ns4', 4000000, 0); // 1K size limit, no time limit
        for (i = 0;i<100;i++) {
            const j = randJson()
            docs.push(j);
            await buffer.append('test_ns', 'ns4', j);
        }
        await buffer.close('test_ns', 'ns4');
        let file = uploader.getFiles()[0];
        let f = fs.readFileSync(file.file_name + '_save',"utf8");
        let docsJson = JSON.stringify(docs);
        expect(docsJson).to.eq(f);
        await buffer.shutDown();
        delete buffer;
    })
    it('temporary uploader failure', async () => {
        let uploader = new uploaderMock();
        uploader.forceFail(true);
        let buffer = new bufferModule.JsonBufferStreamer(uploader, 'test/data', null, 2);
        let r;
        buffer.open('test_ns', 'ns5', 2000, 0);
        for (i = 0;i<10;i++) {
            r = await buffer.append('test_ns', 'ns5',  randJson());
        }
        await buffer.close('test_ns', 'ns5');
        expect(uploader.getFiles().length).to.eq(0);
        uploader.forceFail(false);
        await sleep(4000);
        expect(uploader.getFiles().length).to.not.eq(0);
        await buffer.shutDown();
        delete  buffer;
    }).timeout(20000);

});