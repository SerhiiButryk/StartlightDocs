---
title: Unix tools for common dev tasks
description: Unix tools for common dev tasks
---

This guide highlights essential Unix utilities and debugger commands for everyday development workflows. Use it to quickly reference powerful command-line tricks and streamline common tasks.

## xargs

[man page](https://man7.org/linux/man-pages/man1/xargs.1.html)

```bash
# Find and archive PNG images
$ find Pictures/ -name "*.png" -type f -print0 | xargs -0 tar -cvzf png.tar

# Find and delete directories named Pictures
$ find Downloads -name "Pictures" -type d -print0 | xargs -0 /bin/rm -v -rf "{}"
```

## ps

[man page](https://man7.org/linux/man-pages/man1/ps.1.html)

```bash
# View all processes
$ ps axu
$ ps -A

# View all processes for a user
$ ps -u {USERNAME}

# View a process by PID
$ ps a -p {PID}

# Kill a process named some_name
$ ps aux | grep some_name | grep -v grep | awk '{print $2}' | xargs kill -9

# List all currently running processes
$ ps -ef

# List open file descriptors
$ ls -l /proc/pid/fd

# Show running JVM instances
$ ps -ef | grep java

# View a process using a custom output format
$ ps -L -o pid,tid,state,time,%cpu,%mem,start_time 10427
```

## openssl

[wiki page](https://wiki.openssl.org/index.php/Command_Line_Utilities)

[basic guide](https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs)

```bash
# Generate an RSA private key
$ openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out pkey.pem

# View the private key
$ openssl pkey -in pkey.pem -text

# Generate a public key from a private key
$ openssl rsa -pubout -in pkey.pem -outform PEM -out pubkey.pem

# View the public key
$ openssl rsa -pubin -in pubkey.pem -text

# View certificates (PEM or CRT file)
$ openssl x509 -in aaa_cert.pem -noout -text
$ openssl x509 -in ca.crt -noout -text

# Create a CA certificate from a private key
$ openssl req -new -x509 -sha256 -key pkey.pem -out ca.crt -days 3650

# Create a CSR for a certificate authority
$ openssl req -new -key client_private.key -out client_request.csr

# Issue a new certificate from a CSR
$ openssl x509 -req -in client_request.csr -CA ca.crt -CAkey ca_private.key -out client.crt -days 365 -sha256
```

## nm

[man page](https://linux.die.net/man/1/nm)

```bash
# Show symbols
# List symbols from an object or executable file
$ nm -g -C --defined-only *.o
$ nm a.out | c++filt -t | less
$ nm -a a.out | c++filt

# List symbols in a library file
$ nm -gDC lib_name.so | grep --color symbol_name
```

## Mac C/C++ Debugger

Tell LLDB where the source code is located. The debugger uses it for all matching references.

```bash
$ (lldb) settings set target.source-map /build/dir/path /my/local/source/path
```

List all shared libraries associated with the current target.

```bash
$ (lldb) image list
```

Find a specific shared library associated with the current target.

```bash
$ (lldb) image list libmylib.so
```

Check whether a shared library has debug symbols for a specific file.

1. Find the location of your LLVM toolchain.

:::tip
Example:
/home/serhii/Android/Sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/bin
:::

2. Find the location of the .so library you want to check.

Run the command and specify the file name you want to inspect.

:::tip
Example:
/home/serhii/Android/Sdk/ndk/23.1.7779620/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-dwarfdump /path/to/your/sharedlibrary/my.so | grep file_name_for_check.cpp
:::

Set breakpoints:

```bash
$ (lldb) breakpoint set -n function_name
$ (lldb) breakpoint set -f file_name.cpp -l line_number

$ (lldb) breakpoint list
```

Symbol lookup:

```bash
$ (lldb) image lookup -vn symbol
```

Dump all threads:

```bash
$ (lldb) bt all
```

Log thread frames:

```bash
$ (lldb) thread backtrace
```

Inspect simple variables:

```bash
$ (lldb) p
$ (lldb) po
```

## awk

[man page](https://man7.org/linux/man-pages/man1/awk.1p.html)

```bash
# Output only the first field from each line
$ cat test.txt | awk '{print $1}'
```

## curl

[man page](https://man7.org/linux/man-pages/man1/curl.1.html)

POST request:

```bash
$ curl -X POST --form "file=@1.txt" -v http://example.com
```

POST request with authorization:

```bash
$ curl -X POST -H "Authorization: Bearer <token>" http://example.com -v -d 'post_body'
```

Kerberos authentication:

```bash
$ curl -v -k --negotiate -u user_name:pass http://example.com
```

NTLM authentication:

```bash
$ curl -v -k --ntlm -u user_name:pass http://example.com
```

Download a file:

```bash
curl -o filename.txt https://reqbin.com/echo
```

Connect with proxy:

```bash
$ curl -x localhost:8888 -k http://example.com
```

## ADB (Android debugging tool)

CPU usage:

```bash
adb shell dumpsys cpuinfo
adb shell "top -n 1"
```

Activity stack:

```bash
adb shell dumpsys activity top | grep --color -A 4 "ACTIVITY"
```

APK locations:

Internal storage: /data/app/app.package.name-t2tip43AexOplAoWlN1KCQ==/base.apk

System storage: /data/data/app.package.name

External storage: /Android/data/app.package.name

Unlock bootloader:

Settings -> OEM unlocking -> ON

```bash
adb reboot bootloader
fastboot oem lock
fastboot oem unlock
fastboot reboot
```

Install APK in workspace:

```bash
adb shell pm list users
adb install -r --user 18 internal-debug-work.apk
```

CPU ABI check:

```bash
adb shell getprop ro.product.cpu.abi
```

Sign APK:

```bash
/Library/Android/sdk/build-tools/30.0.0/apksigner sign --ks /Desktop/key AppKinetics-App-debug.apk
```

Uninstall a package:

```bash
adb uninstall <package-name>
```

List packages:

```bash
adb shell pm list packages
```

Current activity:

```bash
adb shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp'
```

Grant permissions:

```bash
adb shell pm grant [package name] [permission name]
adb shell pm grant uk.co.richyhbm.monochromatic android.permission.WRITE_SECURE_SETTINGS
```

Text input:

```bash
adb shell input text
```

Force-stop app:

```bash
adb shell am force-stop <PACKAGE>
```

Current API version:

```bash
adb shell getprop | grep ro.build.version
```

Launch activity:

```bash
adb shell am start -n yourpackagename/.activityname
```

Device rotation:

```bash
adb shell content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:0
```

Reboot device:

```bash
adb reboot
```

Rotation:

```bash
adb shell content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:0
adb shell content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:1
adb shell content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:0
```

Key event:

```bash
adb shell input keyevent 82
```

Enable apps from unknown sources:

```bash
adb shell settings put global verifier_verify_adb_installs 0
```

Uninstall app from work profile:

List users:

```bash
adb shell pm list users
```

Find app:

```bash
adb shell pm list packages --user 10 | grep "rim"
```

Remove work profile:

Settings -> Accounts -> Remove work profile

App verification:

```bash
adb shell settings put global verifier_verify_adb_installs 0
```

## Find

[man page](https://man7.org/linux/man-pages/man1/find.1.html)

Case insensitive search

```bash
$ find . -iname "main*" -type f
```

Search by creation time

```bash
$ find . -type f -mmin -10  # Find files created less than 10 minutes ago

$ find . -type f -mmin +1 -mmin -10  # Find files created more than 1 minute and less than 10 minutes ago

$ find . -type f -mtime -10  # Find files created less than 1 day ago
```

Search files by size

```bash
$ find . -size +5G  # Find files larger than 5 GB
$ find . -size +5M  # Find files larger than 5 MB
$ find . -size +5k  # Find files larger than 5 KB
```

Search files only in the current directory

```bash
$ find . -name "*.jpg" -type f -maxdepth 1
```

Modify file permissions using find command

```bash
$ find sample_dir/ -exec chown name1:name2 {} +
$ find sample_dir/ -type d -exec chown 775 {} +
```

Delete files using find command

```bash
$ find . -name "*.jpg" -type f -exec rm {} +
```

Search for permissions

```bash
$ find . -perm 775
```

Search for files ending with .java or .kt extension

```bash
$ find . -type f \( -name "*.java" -o -name "*.kt" \)
```

Find a file named "needle" and stop searching once found

```bash
$ find / -name needle -print -quit
```

Find all files without permission 777

```bash
$ find / -type f ! -perm 777
```

Find all empty directories

```bash
$ find . -type d -empty
```

```bash
$ find /tmp -type d -empty
```

## GCC (C/C++ compiler)

[optimization](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)

[Static vs dynamic libraries](https://medium.com/@StueyGK/static-libraries-vs-dynamic-libraries-af78f0b5f1e4)

Help

```bash
$ g++ --help
```

Measure compilation time

```bash
$ /usr/bin/time g++ test.cpp -std=c++17
```

Warning options

```bash
-ansi -pedantic -Wall -Wextra -Weffc++
```

## Git

Git visual tool -> gitk

Git merge tool -> git mergetool

Git diff tool -> git difftool

[Install p4merger](https://www.deviantdev.com/journal/setup-p4merge-as-mergediff-tool)

[Install 2 p4merger](https://www.youtube.com/watch?v=NjQCrzX2_fE)

[Detach (move) subdirectory into separate a Git repository](https://stackoverflow.com/questions/359424/detach-move-subdirectory-into-separate-git-repository/17864475#17864475)

DELETE REMOTE BRANCH

```bash
git push origin --delete my_remote_branch
```

PATCH

```bash
git format-patch -1 9921ac0990fc1afc0eb871a15554840aa724f894 -o patches
```

SQUASH

```bash
git rebase -i HEAD~N
```

CONFIG GLOBAL VARIABLES

```bash
git config --global user.name ""
git config --global user.email ""
git config --list
```

GIT HELP

```bash
git help <verb>
```

GIT INITIALIZE EMPTY REPO

```bash
git init
```

TO STOP TRACK THE REPO JUST REMOVE .git DIRECTORY

```bash
rm -rf .git
```

ADD ALL CURRENTLY UNTRACHED OR CHANGED FILES TO STAGE AREA

```bash
git add -A
git add -A my_dir/ - add modifiesd and deleted files
git add --no-all my_dir/ - add only modified files
git add -u (updated) - not add untracked files
git add .
```

GREATE BRANCH

```bash
git branch <branch-name>
git checkout <branch-name>
```

REMOVE FILE FROM A STAGE AREA

```bash
git reset <file>
git reset
```

CLONE REPO

```bash
git clone <url> <where to clone>
```

VIEW REMOTE REPO INFO

```bash
git remote -v
```

VIEW LOCAL AND REMOTE BRANCHES

```bash
git branch -a
```

PUSH BRANCH TO REMOTE REPO

```bash
git push -u <remote-repo> <local-branch>
```

MERGE BRANCH INTO MASTER

```bash
git merge <branch-name>

git pull <remote-repo-name> <branch-name>
git push <remote-repo-name> <branch-name>
```

DELETE BRANCH LOCALY OR REMOTLY

```bash
git branch -d <branch-name>
git push origin --delete <branch-name>
```

SHOW FILES WHICH WAS MEANT TO COMMIT

```bash
git log --stat
```

CHERRY-PICK

```bash
git cherry-pick <hash>
```

RESET COMMIT

```bash
git reset --soft <hash>
git reset [mixed reset]
git reset --hard <hash>
```

GET RID OFF UNTRACKED FILES/DIRECTORIES

```bash
git clean -df
```

SHOW your commits in the order when you last reference them

```bash
git reflog
```

STASH
CRETATE STASH

```bash
git stash save "message"
git stash push -m "message"

git stash list

git stash apply <id>
git stash pop

git stash drop <id>
git stash clear
```

REVERT COMMIT WITHOUT CHANGING HISTORY

```bash
git revert [git-hash-commit]
```

Revert changes

```bash
git checkout — <file_name>
```

## Globbing 

[tutorial](https://www.javatpoint.com/linux-file-globbing)

 Special charactes:

 \* - matches any charactes
 
 ? - macthes one character
 
 [] - matches single or range of characters
 
 ! - not operator 

:::tip

Example of string patterns:

 1. office*
 2. *office*
 3. *.txt
 4. office?.*
 5. office[A2].* (matches officeA. + any extenction or office2. + any extenction strings)
 6. office[!2]* (does not matche office2 )
 7. [a-z].txt
 8. [0-9].txt
:::

## Gradle

1. Run test

```bash
./gradlew --console plain connectedAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.example.class#test_example
```

2. App build & install tasks

```bash
./gradlew installDebug

./gradlew assembleDebug 
./gradlew assembleRelease
```

With flags

```bash
./gradlew -PAPP_ABI=armeabi-v7a app:assembleDebug
```

3. Execute single build script

```bash
./gradlew -b /path/to/some_script.gradle someTask
```

4. Dependency Insight

```bash
./gradlew -q dependencyInsight --dependency artifactGroupName
```

5. Gradle dependencies check

```bash
./gradlew -q app:dependencies
./gradlew app:resolvableConfigurations
```

## Grep

[man page](https://man7.org/linux/man-pages/man1/grep.1.html)

Simple search in file

```bash
$ grep -inw "John Williams" note.txt
```

Search in current directory including all text files

```bash
$ grep -inw -C 2 "John Williams" ./*.txt
```

Search in curent directory and its subdirectories

```bash
$ grep -inwr -C 2 "John Williams" .
```

Show file names which contain a match

```bash
$ grep -ilwr -C 2 "John Williams" .
```

Show file names which contain a match with number of macthes

```bash
$ grep -icwr -C 2 "John Williams" .
```

Invert match show lines which DOEAN'T contain a match word

```bash
$ grep -ivwr "John Williams" .
```

Show lines 5 which contains a word 'git' in a history

```bash
history | grep -m 5 git

history | grep --max-count=5 git
```

Show only mathing word and don't print full line

```bash
grep -wiro -C 2  "Tom" .
```

Search for a word in .txt files

```bash
grep -iwro --include=\*.txt "Tom"
```

Search for a word in .txt and .cpp files

```bash
grep -iwro --include=\*.{txt,cpp} "Tom"
```

Search for a word in .txt and .cpp files and exclude dir

```bash
grep -iwro --include=\*.{txt,cpp} --exclude-dir=build "Tom"

grep -iwro --include=\*.{txt,cpp} --exclude-dir={build, temp} "Tom"
```

Find a line which contian vivek or raj word (OR option)
 
```bash
grep -E 'vivek|raj' temp.txt
```

All the lines that contain both “Dev” and “Tech” in it (in the same order (AND option)

```bash
grep -E 'Dev.*Tech' employee.txt
```

Find only line which begging with vivek word

```bash
grep ^vivek /etc/passwd
```

Find only line which ending with vivek word

```bash
grep vivek$ /etc/passwd
```

## hexdump

[man page](https://man7.org/linux/man-pages/man1/hexdump.1.html)

View file in hex format

```bash
cat file.txt | hexdump -C
```

## Java

Install certificates for Java keystore (JAVA 8)

```bash
sudo $JAVA_HOME/bin/keytool -import -alias root_CA1 -keystore $JAVA_HOME/jre/lib/security/cacerts -file $downloaded_cert_file
sudo $JAVA_HOME/bin/keytool -importcert -file <cert> -cacerts -keypass changeit -storepass changeit -noprompt -alias <alias>
```

Default password for keystore: changeit

Java 11/17

```bash
$ ./bin/keytool -importcert -file <cert> -cacerts -keypass changeit -storepass changeit -noprompt -alias <alias>

$ sudo ./bin/keytool -importcert -file ~/Downloads/Cert.crt -keypass changeit -storepass changeit -keystore ./lib/security/cacerts -alias root_CA1
```

Where <alias> is a random uniq name for this cert in the java cert storage 

Generate JNI header file from java file

```bash
$ javac -h . ClassName.java
```

# keytool (Android tool for working with keystore)

Get certificate signing hash from key store

```bash
$ keytool -list -v -keystore NAME_OF_KEYSTORE -alias KEY_ALIAS
```
