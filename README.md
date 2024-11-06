# AndroidFSWatch
Filesystem Watcher for editing files in Termux for Android.

RUN

node andfswatch.js source_directory

Where source_directory is a project directory in the Termux filesystem.

The script copies the watched directory to InternalStorage/Documents so it can accessed from editors and other tools.
When changes are made or new files/directories created the change is copied back to the Termux filesystem directory.

This means in Termux you can have nodemon app.js running for example, edit the files from your chosen editor in Documents and when saved the changes will be flushed back to the Termux filesystem and picked up by nodemon.
