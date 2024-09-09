const fs = require('fs');
const path = require('path');
var chokidar = require('chokidar');

var homedir = process.argv[2];                                         //Parameter 1
var overwrite = process.argv[3];                                       //Parameter 2
var errs = 0;

if (homedir == undefined) {
  console.log('USAGE : node andfswatch.js source_directory {-f}');
  console.log('OPTION: -f force overwrite of Documents directory');
  process.exit(1);
}

var docsdir = '/storage/emulated/0/Documents/'+path.basename(homedir); //Shoud be standard on all Android devices

if (! fs.existsSync(homedir)) {
  console.log('SRC: '+homedir+' does NOT exist.');
  errs++;
} else {
  if (! fs.lstatSync(homedir).isDirectory()) {
    console.log('SRC: '+homedir+' NOT a directory.');
    errs++;
  }
}

if (fs.existsSync(docsdir) && overwrite != undefined && overwrite == '-f') { fsremove(docsdir, '-init'); }
if (! fs.existsSync(docsdir)) {
  fscopy(homedir, docsdir, '-init');
} else {
  if (! fs.lstatSync(homedir).isDirectory()) {
    console.log('DEST: '+homedir+' NOT a directory.');
    errs++;
  } else {
    console.log('Destination Documents directory exists, specify -f option to overwrite.');
    errs++;
  }
}

if (errs == 0) {
  console.log('WATCHED : ' + docsdir + ' : Destination=' + homedir);
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

function fsremove(path, opt) {                                           //unlink, unlinkdir
var msg = path.replace(docsdir,homedir);
if (opt != undefined && opt == '-init') { msg = path; }
try {
    fs.rmSync(path, { awaitWriteFinish: true, recursive: true, force: true });
    console.log('REMOVED : '+msg);
} catch(error) {
    console.log('FAILED REMOVE : '+msg); 
}
}

function fscopy(path, dest, opt) {                                       //add, addDir, change
var msg = path.replace(docsdir,homedir);
if (opt != undefined && opt == '-init') { msg = dest; }
try {
    fs.cpSync(path, dest, { awaitWriteFinish: true, recursive: true });
    console.log('UPDATED : '+msg);
} catch(error) {
    console.log('FAILED COPY : '+msg); 
}
}


