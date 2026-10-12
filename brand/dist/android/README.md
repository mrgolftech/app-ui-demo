# Android reference files

Legacy mipmaps and adaptive foreground are pre-generated. In a Capacitor 8 Android build, copy mipmap-* directories into android/app/src/main/res and brand_colors.xml into res/values. Ensure the Android manifest icon points at @mipmap/ic_launcher. The foreground fits the center-safe region of an Android adaptive icon. Apply these AFTER npx cap add android and BEFORE assembling the APK.
