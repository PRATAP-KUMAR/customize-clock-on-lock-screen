import Clutter from 'gi://Clutter';

import {Extension, InjectionManager} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import ModifiedClock from './ModifiedClock.js';

export default class CustomizeClockOnLockScreenExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._injectionManager = new InjectionManager();

        this._dialog = null;
        this._dialogStack = null;
        this._promptBox = null;
        this._originalClock = null;
        this._clockModified = false;

        // Ensure we apply our clock replacement both when:
        // 1) the unlock dialog already exists (explicit lock), and
        // 2) the extension is enabled before the dialog is created (auto-lock on idle).
        this._injectionManager.overrideMethod(Main.screenShield, '_ensureUnlockDialog',
            originalMethod => {
                const extension = this;
                return function (allowCancel) {
                    const ret = originalMethod.call(this, allowCancel);
                    extension._maybeModifyClock();
                    return ret;
                };
            });

        this._maybeModifyClock();
    }

    disable() {
        // Best-effort restoration (the unlock dialog may already be destroyed).
        this._restoreOriginalClock();

        if (this._injectionManager) {
            this._injectionManager.clear();
            this._injectionManager = null;
        }

        this._clockModified = false;
        this._settings = null;
    }

    _maybeModifyClock() {
        const dialog = Main.screenShield?._dialog ?? null;
        if (!dialog)
            return;

        // If the dialog instance changed (destroy/recreate), allow re-applying.
        if (this._dialog !== dialog) {
            this._restoreOriginalClock();
            this._clockModified = false;
        }

        const dialogStack = dialog?._stack ?? null;
        const promptBox = dialog?._promptBox ?? null;
        const originalClock = dialog?._clock ?? null;

        if (!dialogStack || !originalClock || this._clockModified)
            return;

        const primaryMonitor = Main.layoutManager.primaryMonitor ?? null;
        const width = primaryMonitor?.width ?? global.stage?.width ?? 0;

        this._dialog = dialog;
        this._dialogStack = dialogStack;
        this._promptBox = promptBox;
        this._originalClock = originalClock;

        try {
            this._dialogStack.remove_child(this._originalClock);
        } catch {
            // If the actor is not (or no longer) a child, just bail out.
            return;
        }

        const newClock = new ModifiedClock(this._settings, width);
        newClock.set_pivot_point(0.5, 0.5);
        // Mark the instance so we can detect it later if needed.
        newClock._customClockOnLockScreen = true;

        this._dialog._clock = newClock;
        this._dialogStack.add_child(newClock);

        this._promptBox?.set_y_align(Clutter.ActorAlign.CENTER);
        this._clockModified = true;
    }

    _restoreOriginalClock() {
        if (!this._clockModified || !this._dialog || !this._dialogStack || !this._originalClock)
            return;

        const currentClock = this._dialog._clock;
        try {
            this._dialogStack.remove_child(currentClock);
        } catch {
            // Ignore; we still try to restore below if possible.
        }

        try {
            this._dialogStack.add_child(this._originalClock);
        } catch {
            // Nothing else to do.
        }

        this._promptBox?.set_y_align(Clutter.ActorAlign.DEFAULT);

        try {
            currentClock?.destroy();
        } catch {
            // ignore
        }

        this._dialog._clock = this._originalClock;

        this._dialog = null;
        this._dialogStack = null;
        this._promptBox = null;
        this._originalClock = null;
        this._clockModified = false;
    }
}
