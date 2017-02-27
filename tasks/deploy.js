const gulp = require('gulp');
const AWS = require('aws-sdk');
const recursiveReadDir = require('recursive-readdir');
const defer = require('promise-defer');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const { paths } = require('./config');
const s3 = new AWS.S3();
const s3Params = { Bucket: 'petergoes.nl' };

gulp.task('deploy', deploy);

function deploy(cb) {
	const localFileListDefer = defer();
	const remoteFileListDefer = defer();
	
	recursiveReadDir(paths.dist.root, function (err, files) {
		if (err) { localFileListDefer.reject(err); return; }
		const relativeFiles = files.map(file => path.relative('./dist', file))
		localFileListDefer.resolve(relativeFiles)
	});

	s3.listObjects(s3Params, function(err, data) {
		if (err) { remoteFileListDefer.reject(err); return; }
		const files = data.Contents.map(fileObj => fileObj.Key);
		remoteFileListDefer.resolve(files);
	});

	Promise.all([localFileListDefer.promise, remoteFileListDefer.promise])
		.then(([localFiles, remoteFiles]) => {
			process.stdout.write('Deleting remote files:  ')
			return deleteRemoteFiles(remoteFiles)
				.then(() => process.stdout.write('Done\n'))
				.then(() => process.stdout.write('Local files uploaded:   '))
				.then(() => pushNewFiles(localFiles))
				.then(() => process.stdout.write('Done\n'));
		})
		.then(() => cb());
}

function deleteRemoteFiles(remoteFiles) {
	const deleteDefer = defer();
	const objects = remoteFiles.map(file => ({ Key: file }));
	const s3DeleteParams = {
		Delete: {
			Objects: objects,
			Quiet: false
		}
	};

	if (objects.length === 0) {
		deleteDefer.resolve();
	} else {
		s3.deleteObjects(Object.assign({}, s3DeleteParams, s3Params), function(err, data) {
			err ? deleteDefer.reject(err) : deleteDefer.resolve(data);
		})
	}

	return deleteDefer.promise;
}

function pushNewFiles(localFiles) {
	const putPromises = localFiles.map(file => {
		const putDefer = defer();
		const fileBuffer = fs.readFileSync(path.resolve(paths.dist.root, file));
		const s3PutParams = {
			ACL: 'public-read',
			Key: file,
			Body: fileBuffer,
			ContentType: mime.lookup(file),
			ContentEncoding: 'gzip'
		};

		s3.putObject(Object.assign({}, s3PutParams, s3Params), function (err, data) {
			err ? putDefer.reject(err) : putDefer.resolve(data);
		});

		return putDefer.promise;
	})

	return Promise.all(putPromises);
}
