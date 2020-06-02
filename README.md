# node_s3_file_buffer

About:
This is a simplified self contained version of Streaming data, Json in this case to S3.
Example of a full blown implementation with Kinesis, Lambda and S3 to stream data to S3, as described here:
https://aws.amazon.com/blogs/big-data/persist-streaming-data-to-amazon-s3-using-amazon-kinesis-firehose-and-aws-lambda/

API to locally buffer and upload JSON streams to S3 files
S3 Uploader is provided but other implementations can be created
Upload is based on size limit and time limit
Multiple streams can be created with domain and namespace hierarchy

to run with S3 uploader AWS credentials must be setup to be used by the AWS SDK:
check this for setting up the credentials: https://docs.aws.amazon.com/amazonswf/latest/awsrbflowguide/set-up-creds.html
set S3_UPLOADER_BUCKET env var name to specify which bucket files are written to.


the JsonBufferStreamer class requires the following parameters to instantiate:
uploader -  a class that implements the - async upload({file_name, domain, namespace}) signature
filesPath - location for the buffered filed, a directory
onUpload - optional - callbeack for file upload notifications
schedulerIntervalSec - if time based flush is required, this is used to indicate the time interval for the scheduler to 
implement the buffers flushing (based on the specific stream definitions). use 0 to prevent scheduled flush

API:
open(domain, namespace, sizeLimit = 100000, timeLimit = 60)  - opens a new stream with domain name, a namespace,
the size limit that once passed will trigger a file upload
the the timeLimit after which, if any data is in the stream it will be uploaded

append(domain, namespace, json) -  Appends a Json to an existing stream, the file created will have an array 
of Jsons.

close(domain, namespace) - finalizes a Json stream, triggers a final flush of the stream to be uploaded.

flush() - used to flush all the buffers by uploading them using the uploader

shutDown() - used to initiate service shutdown, all files will be flushed and uploaded, all incoming append requests 
will be refused.

NOTE - AWS failures may occur silently, typically due to misconfiguration of AWS credentials





