---
title: Debugging and decompiling Android apk file 
description: Debugging and decompiling Android apk file
---

## Decompile and rebuild apk

1. Download 'android.py' tool

```bash
$ curl -o android.py https://github.com/SerhiiButryk/DevelopmentTools/blob/main/tools/android.py
```

2. Grant exec permission for 'android.py' tool

```bash
$ chmod +x android.py
```

3. Assuming you put 'android.py' tool in the same folder with your apk file, decompile your apk

```bash
$ android.py -decomp <your file name>.apk
```

Wait while the tool downloads all necesary dependencies. If no errors, check out 'output' directory.

4. Modify sources.

5. Rebuild apk 

```bash
$ android.py -decomp <your file name>.apk
```

6. Resign your apk

```bash
$ android.py -resign-apk modified.apk
```

7. Install apk and enjoy ! 🙂