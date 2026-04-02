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

Tell LLDB where the source code is. The debugger uses it for all matching references.

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
# Output only 1 field from a line
$ cat test.txt | awk '{print $1}'
```

## curl

[man page](https://man7.org/linux/man-pages/man1/curl.1.html)

POST request:

```bash
$ curl -X POST --form "file=@1.txt" -v http://example.com
```

POST request:

```bash
$ curl -X POST -H "Authorization: Bearer <token>" http://example.com -v -d 'post_body'
```

Kerberos auth:

```bash
$ curl -v -k --negosiate -u user_name:pass http://example.com
```

NTLM auth:

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

