---
title: Debugging and decompiling Android APK files
description: Debugging and decompiling Android APK files
---

## Decompile and rebuild apk

1. Download 'android.py' tool

```bash
$ curl -o android.py https://github.com/SerhiiButryk/DevelopmentTools/blob/main/tools/android.py
```

2. Grant execute permissions to 'android.py' tool

```bash
$ chmod +x android.py
```

3. Assuming you placed 'android.py' in the same directory as your APK file, decompile your APK:

```bash
$ android.py -decomp <your file name>.apk
```

Wait while the tool downloads all necessary dependencies. If there are no errors, check the 'output' directory.

4. Modify sources

5. Rebuild APK

```bash
$ android.py -build <your folder with modified apk>
```

6. Sign your APK

```bash
$ android.py -resign-apk <your file name>.apk
```

7. Install the APK and enjoy!

```bash
$ adb install <your file name>.apk
```