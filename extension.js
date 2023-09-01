import { Extension, InjectionManager } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as UnlockDialog from 'resource:///org/gnome/shell/ui/unlockDialog.js';
import ModifiedClock from './ModifiedClock.js';
// import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class CustomizeClockOnLockScreenExtension extends Extension {
    enable() {
        this._injectionManager = new InjectionManager();
        this._injectionManager.overrideMethod(UnlockDialog.UnlockDialog.prototype, '_init',
            originalMethod => {
                const settings = this.getSettings();
                return function (...args) {
                    originalMethod.call(this, ...args);
                    this._stack.remove_child(this._clock);
                    this._clock = new ModifiedClock(settings);
                    this._clock.set_pivot_point(0.5, 0.5);
                    this._stack.add_child(this._clock);
                }
            })
    }

    disable() {
        this._injectionManager.clear();
        this._injectionManager = null;
    }
}