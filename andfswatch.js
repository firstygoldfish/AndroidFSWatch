const fs = require('fs');
const path = require('path');
var chokidar = require('chokidar');

var homedir = process.argv[2];                                         //Parameter 1
var docsdir = '/storage/emulated/0/Documents/'+path.basename(homedir); //Shoud be standard on all Android devices
var errs = 0;

if (! fs.existsSync(homedir)) {
  console.log('SRC: '+homedir+' does NOT exist.');
  errs++;
} else {
  if (! fs.lstatSync(homedir).isDirectory()) {
    console.log('SRC: '+homedir+' NOT a directory.');
    errs++;
  }
}

if (! fs.existsSync(docsdir)) {
    fs.cp(homedir, docsdir, { recursive: true }, (err) => {
     if (err) { 
	console.log('DEST: FAILED to setup '+homedir+monidir); 
	throw err;
     }
    });
} else {
  if (! fs.lstatSync(homedir).isDirectory()) {
    console.log('DEST: '+homedir+' NOT a directory.');
    errs++;
  }
}

if (errs == 0) {
  console.log('Source : ' + docsdir + ' - Destination : ' + homedir);
  var docswatcher = chokidar.watch(docsdir, {ignored: /^\./, ignoreInitial: true, persistent: true});
  docswatcher
  .on('change', function(path) {
	fscopy(path, path.replace(docsdir,homedir));
  })
  .on('add', function(path) {
	fscopy(path, path.replace(docsdir,homedir));
  })
  .on('addDir', function(path) {
	fscopy(path, path.replace(docsdir,homedir));
  })
  .on('unlink', function(path) {
	fsremove(path.replace(docsdir,homedir));
  })
  .on('unlinkDir', function(path) {
	fsremove(path.replace(docsdir,homedir));
  })
  .on('error', function(error) {
	  console.error('Error happened', error);
  })
}

function fsremove(path) {                                           //unlink, unlinkdir
  fs.rm(path, { recursive: true, force: true }, (err) => {
  if (err) { 
	console.log('FAILED REMOVE : '+path.replace(docsdir,homedir)); 
  } else {
  	console.log('REMOVED : '+path.replace(docsdir,homedir));
  }
  });
}

function fscopy(path, dest) {                                       //add, addDir, change
  fs.cp(path, dest, { recursive: true }, (err) => {
  if (err) { 
	console.log('FAILED COPY : '+path.replace(docsdir,homedir)); 
  } else {
 	console.log('UPDATED : '+path.replace(docsdir,homedir));
  }
  });
}
