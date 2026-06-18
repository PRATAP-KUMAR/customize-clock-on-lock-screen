import Clutter from 'gi://Clutter';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import ModifiedClock from './ModifiedClock.js';

export default class CustomizeClockOnLockScreenExtension extends Extension {
    enable() {
        let primaryMonitor = Main.layoutManager.primaryMonitor;
        let {width} = primaryMonitor;

        this._settings = this.getSettings();
        this._dialog = Main.screenShield?._dialog ?? null;
        this._dialogStack = this._dialog?._stack ?? null;
        this._promptBox = this._dialog?._promptBox ?? null;
        this._originalClock = this._dialog?._clock ?? null;

        if (!this._dialog || !this._dialogStack || !this._originalClock)
            return;

        this._dialogStack.remove_child(this._originalClock);
        this._dialog._clock = new ModifiedClock(this._settings, width);
        this._dialog._clock.set_pivot_point(0.5, 0.5);
        this._dialogStack.add_child(this._dialog._clock);

        this._promptBox?.set_y_align(Clutter.ActorAlign.CENTER);
    }

    disable() {
        if (!this._dialog || !this._dialogStack || !this._originalClock) {
            this._settings = null;
            return;
        }

        // unlock-dialog is used in session-modes because this extension purpose is
        // to tweak the clock on lock screen itself.
        this._dialogStack.remove_child(this._dialog._clock);
        this._dialogStack.add_child(this._originalClock);

        this._promptBox?.set_y_align(Clutter.ActorAlign.DEFAULT);

        this._dialog._clock.destroy();
        this._dialog._clock = null;
        this._dialogStack = null;
        this._promptBox = null;
        this._dialog = null;
        this._originalClock = null;

        this._settings = null;
    }
}
