const S3Uploader = require('../index').S3Uploader;
const JsonBufferStreamer = require('../index').JsonBufferStreamer;
const randJson = require('./jsons').getRandJson;
const bucket = process.env.S3_UPLOADER_BUCKET;

function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

async function test(json) {
        try {
                const s3Uploader = new S3Uploader(bucket);
                const buffer = new JsonBufferStreamer(s3Uploader, 'data', (uploadData) => {
                        console.log('file uploaded', uploadData);
                }, 10);
                let r;
                await buffer.open('domain1', 'test_ns', 1000, 10);
                await buffer.open('domain2', 'test_ns2', 1000, 10);
                await buffer.open('domain2', 'test_ns1', 10000, 10);
                for (i = 0; i < 10; i++) {
                        r = await buffer.append('domain1', 'test_ns', randJson())
                }
                for (i = 0; i < 50; i++) {
                        r = await buffer.append('domain2', 'test_ns2', randJson())
                }
                await buffer.close('domain1', 'test_ns');
                for (i = 0; i < 200; i++) {
                        r = await buffer.append('domain2', 'test_ns1', randJson())
                }
                await sleep(10000);
                await buffer.shutDown();
        }catch (err) {
                console.log(err);
        }
}

test();