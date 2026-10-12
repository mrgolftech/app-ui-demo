import { readFileSync, writeFileSync } from 'node:fs';

const path='android/app/src/main/AndroidManifest.xml';
let xml=readFileSync(path,'utf8');
const activity='android:name=".MainActivity"';
if(!xml.includes(activity))throw new Error('Capacitor Android MainActivity not found');
if(!xml.includes('android:screenOrientation=')){
 xml=xml.replace(activity,activity+' android:screenOrientation="sensorLandscape"');
}
writeFileSync(path,xml);

const javaPath='android/app/src/main/java/com/mrgolftech/kidsvisualdemo/MainActivity.java';
// Keep Android's home/back navigation bar and gestures. Hide only the top
// STATUS bar, including after the user returns from another Android activity.
const nativeJava=String.raw`package com.mrgolftech.kidsvisualdemo;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        hideTopStatusBar();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideTopStatusBar();
        }
    }

    private void hideTopStatusBar() {
        // Preserve the system navigation bar / gesture area.
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars());
                controller.setSystemBarsBehavior(
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            );
        }
    }
}
`;
writeFileSync(javaPath,nativeJava);
console.log('Android: sensorLandscape, top status bar hidden; system navigation preserved');
