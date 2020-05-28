const fs = require('fs');
const uuid = require('uuid');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class JsonBufferStreamer {

    buffers = {};

    uploads = [];

    uploader;

    shuttingDown = false;

    path = 'data'

    schedulerInterval;

    onUpload; // call back function when uploading a file

    constructor(uploader, filesPath, onUpload = null, schedulerIntervalSec = 5) {
        this.uploader = uploader;
        this.path = filesPath;
        this.onUpload = onUpload;
        this.schedulerInterval = schedulerIntervalSec * 1000;
        if (this.schedulerInterval !== 0) {
            this.scheduler();
        }
    }

    async open(domain, namespace, sizeLimit = 100000, timeLimit = 60) {
        if (this.shuttingDown) throw new Error('Shutting down, not accepting requests');
        const identifier = domain + '.' + namespace;
        if (!this.buffers[identifier]) {
            const fuid = uuid.v1();
            const fname = this.path + '/' + fuid + '.data';
            this.buffers[identifier] = {
                identifier: identifier,
                domain: domain,
                namespace: namespace,
                fuid: fuid,
                file_name: fname,
                path: this.path,
                size_limit: sizeLimit, // bytes
                time_limit: timeLimit, // seconds
                rec_count: 0,
                created: new Date(),
                size: 0
            };
            fs.appendFileSync(fname, '[', {flag: 'as'});
        }
    }

    async append(domain, namespace, json) {
        if (this.shuttingDown) throw new Error('Shutting down, not accepting requests');
        const identifier = domain + '.' + namespace;
        const buffer = this.buffers[identifier]
        const fName = buffer.file_name;
        let separator = '';
        if (buffer.rec_count !== 0) {
            separator = ',';
        }
        const js = JSON.stringify(json);
        fs.appendFileSync(fName, separator + js, {flag: 'as'});
        buffer.rec_count++;
        buffer.size += js.length;
        if (buffer.size >= buffer.size_limit) {
            await this.close(domain, namespace);
            if (!this.shuttingDown) await this.open(buffer.domain, buffer.namespace, buffer.size_limit, buffer.time_limit);
        }
        return true;
    }

// Flush all buffers that passed their time_limit
    async scheduledFlush() {
        for (let k in this.buffers) {
            const buffer = this.buffers[k];
            if (buffer.rec_count !== 0 && buffer.time_limit >0 && new Date(buffer.created.getTime() + 1000 * buffer.time_limit) <= new Date()) {
                await this.close(buffer.domain, buffer.namespace);
                if (!this.shuttingDown) await this.open(buffer.domain, buffer.namespace, buffer.size_limit, buffer.time_limit);
            }
        }
        await this.upload();
    }

    async close(domain, namespace) {
        const identifier = domain + '.' + namespace;
        if (this.buffers[identifier]) {
            const buffer = this.buffers[identifier];
            fs.appendFileSync(buffer.file_name, ']', {flag: 'as'});
            this.uploads.push(buffer);
            delete (this.buffers[identifier]);
            await this.upload();
        }
        return true;
    }

    async upload() {
        if (!this.uploader) throw new Error('No Uploader specified');
        const limit = this.uploads.length * 2; // try twice
        let tried = 0;
        while (this.uploads.length) {
            const buffer = this.uploads.shift();
            if (!buffer) break;
            try {
                await this.uploadBuffer(buffer);
                fs.unlinkSync(buffer.file_name);
            } catch (err) {
                console.log(err);
                this.uploads.push(buffer);
            }
            if (tried > limit) {
                console.log('failed uploading files');
                break;
            }
            tried++;
        }
    }

    async uploadBuffer(buffer) {
        const r = await this.uploader.upload(buffer);
        if (r) {
            if (this.onUpload) {
                this.onUpload(r);
            }
        }
        else {
            throw new Error('upload failed for namespace ' + buffer.identifier + ' file ' + buffer.file_name);
        }
    }

    async flush() {
        for (let k in this.buffers) {
            const buffer = this.buffers[k];
            if (buffer.rec_count > 0) {
                await this.close(buffer.domain, buffer.namespace)
                if (!this.shuttingDown) await this.open(buffer.domain, buffer.namespace, buffer.size_limit, buffer.time_limit);
            }
        }
        await this.upload();
    }

    async shutDown() {
        this.shuttingDown = true;
        await this.flush();
    }

    async scheduler() {
        await sleep(this.schedulerInterval);
        while(true && !this.shuttingDown) {
            try {
                console.log('scheduled flush waking');
                await this.scheduledFlush();
                console.log('scheduled flush completed');
            } catch (err) {
                console.log(err);
            }
            await sleep(this.schedulerInterval);
        }
    }
}
