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

# View a process and use a custom output format
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

# Create a CSR for the Certificate Authority (CA)
$ openssl req -new -key client_private.key -out client_request.csr

# Issue a new certificate based on a CSR
$ openssl x509 -req -in client_request.csr -CA ca.crt -CAkey ca_private.key -out client.crt -days 365 -sha256
```

## nm

[man page](https://linux.die.net/man/1/nm)

```bash
# Show symbols
# List symbols of an object or executable file
$ nm -g -C --defined-only *.o
$ nm a.out | c++filt -t | less
$ nm -a a.out | c++filt

# List symbols in a library file
$ nm -gDC lib_name.so | grep --color symbol_name
```

## Mac C/C++ Debugger

Tell lldb where the source code is. The debugger will use it for all matching references.

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

2. Find the location of your .so library that you want to check.

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

