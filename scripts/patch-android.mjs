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
// Android immersive sticky hides both bars while keeping system gestures.
// A swipe can show them temporarily; focus/resume reapply the immersive mode.
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
        enterImmersiveMode();
    }

    @Override
    protected void onResume() {
        super.onResume();
        enterImmersiveMode();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            enterImmersiveMode();
        }
    }

    private void enterImmersiveMode() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.setSystemBarsBehavior(
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
            }
        } else {
            getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
            );
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            );
        }
    }
}
`;
writeFileSync(javaPath,nativeJava);
console.log('Android: sensorLandscape, immersive sticky hides status + navigation bars');
