const fs       = require('fs');
const path     = require('path');
const chokidar = require('chokidar');

var homedir   = process.argv[2];                                       //Parameter 1
var overwrite = process.argv[3];                                       //Parameter 2
var errs = 0;

if (homedir == undefined) {
  console.log('USAGE : node andfswatch.js source_directory {-f}');
  console.log('OPTION: -f force overwrite of Documents directory');
  process.exit(1);
}

var docsdir = '/storage/emulated/0/Documents/'+path.basename(homedir); //Shoud be standard on all Android devices

if (! fs.existsSync(homedir)) {                                        //Check watched directory exists
  console.log('Directory '+homedir+' does NOT exist.');
  process.exit(1);
} else {
  if (! fs.lstatSync(homedir).isDirectory()) {
    console.log(homedir+' NOT a directory.');
    process.exit(1);
  }
}

if (fs.existsSync(docsdir) && overwrite != undefined && overwrite == '-f') { fsremove(docsdir, 'init'); }  //Clear down  Documents directory
if (! fs.existsSync(docsdir)) {                                                                            //Copy Documents directory
    fscopy(homedir, docsdir, 'init');
} else {
    console.log(docsdir+' exists, specify -f option to overwrite.');
    process.exit(2);
}

var docswatcher = chokidar.watch(docsdir, {ignored: /^\./, ignoreInitial: true, persistent: true});       //Setup watcher
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
console.log('WATCHED : ' + docsdir + ' : Destination=' + homedir);

function fsremove(path, opt) {                                                                           //unlink, unlinkdir
  var msg = path.replace(docsdir,homedir);
  if (opt != undefined && opt == 'init') { msg = path; }
  try {
      fs.rmSync(path, { awaitWriteFinish: true, recursive: true, force: true });
      console.log('REMOVED : '+msg);
  } catch(error) {
      console.log('FAILED REMOVE : '+msg); 
  }
}

function fscopy(path, dest, opt) {                                                                       //add, addDir, change
  var msg = path.replace(docsdir,homedir);
  if (opt != undefined && opt == 'init') { msg = dest; }
  try {
      fs.cpSync(path, dest, { awaitWriteFinish: true, recursive: true });
      console.log('UPDATED : '+msg);
  } catch(error) {
      console.log('FAILED COPY : '+msg); 
  }
}


