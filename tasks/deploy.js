const gulp = require('gulp');
const promisify = require('bluebird').promisify;
const AWS = require('aws-sdk');
const recursiveReadDir = promisify(require('recursive-readdir'));
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const isGzip = require('is-gzip');
const { paths } = require('./config');
const s3 = new AWS.S3();
const s3Params = { Bucket: 'www.petergoes.nl' };

gulp.task('deploy', deploy);

async function deploy() {
	const localFilesPromise = getLocalFiles();
	const remoteFilesPromise = getRemoteFiles();

	const localFiles = await localFilesPromise;
	const remoteFiles = await remoteFilesPromise;

	await deleteRemoteFiles(remoteFiles);
	await pushNewFiles(localFiles);
}

async function getLocalFiles() {
	const files = await recursiveReadDir(paths.dist.root);
	return files.map(file => path.relative('./dist', file))
}

async function getRemoteFiles() {
	const data = await s3.listObjects(s3Params).promise();
	return data.Contents.map(fileObj => fileObj.Key);
}

async function deleteRemoteFiles(remoteFiles) {
	const objects = remoteFiles.map(file => ({ Key: file }));
	const s3DeleteParams = {
		Delete: {
			Objects: objects,
			Quiet: false
		}
	};

	if (objects.length) {
		return s3.deleteObjects(Object.assign({}, s3DeleteParams, s3Params)).promise();
	}
}

async function pushNewFiles(localFiles) {
	const putPromises = localFiles.map(async file => pushNewFile(file));
	return Promise.all(putPromises);
}

async function pushNewFile(file) {
	const fileBuffer = fs.readFileSync(path.resolve(paths.dist.root, file));
	const expiresParam = getExpiresValue(file);
	const encodingParam = (isGzip(fileBuffer)) ? { ContentEncoding: 'gzip' } : {};
	const s3PutParams = {
		ACL: 'public-read',
		Key: file,
		Body: fileBuffer,
		ContentType: mime.getType(file)
	};

	return s3.putObject(Object.assign(
		{},
		s3PutParams,
		s3Params,
		expiresParam,
		encodingParam
	)).promise();
}

function getExpiresValue(file) {
	const revManifest = require(`../${paths.dist.reved.manifest}`);
	const revedFiles = Object.values(revManifest);
	const expireNow = 0;
	const expireYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime() / 1000;
	const expires = { 
		Expires: (revedFiles.includes(file)) ? expireYearFromNow : expireNow
	};

	return expires;
}
