const assert = require('assert');
const expect = require('chai').expect;
const uploader = require('./s3UploaderMock');
const bufferModule = require('../index');

describe('append test', async () => {
    it('should return true', async () => {
        const buffer = new bufferModule.JsonBufferStreamer(uploader, 'test/data');
        let r;
        buffer.open('test_ns', 'ns1', 100000, 60);
        for (i = 0;i<100;i++) {
            r = await buffer.append('test_ns', 'ns1',  {id: 123, data: 'data'})
        }
        expect(r).to.equal(true);
    });

});