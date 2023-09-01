import St from 'gi://St';
import GObject from 'gi://GObject';
import GnomeDesktop from 'gi://GnomeDesktop';
import Clutter from 'gi://Clutter';
import Shell from 'gi://Shell';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { formatDateWithCFormatString } from 'resource:///org/gnome/shell/misc/dateUtils.js';

const ModifiedClock = GObject.registerClass(
    class ModifiedClock extends St.BoxLayout {
        _init(settings) {
            super._init({ style_class: 'unlock-dialog-clock', vertical: true });

            this._settings = settings;
            let customStyle = this._settings.get_boolean('custom-style')

            this._time = new St.Label({
                style_class: customStyle ? null : 'unlock-dialog-clock-time',
                x_align: Clutter.ActorAlign.CENTER,
            });

            customStyle
                ? this._time.set_style
                    (
                        `color: ${this._settings.get_string('time-color')};
                        font-size: ${this._settings.get_int('time-size')}pt`
                    )
                : null;

            this._date = new St.Label({
                style_class: customStyle ? null : 'unlock-dialog-clock-date',
                x_align: Clutter.ActorAlign.CENTER,
            });

            customStyle
                ? this._date.set_style
                    (
                        `color: ${this._settings.get_string('date-color')};
                        font-size: ${this._settings.get_int('date-size')}pt`
                    )
                : null;

            this._hint = new St.Label({
                style_class: customStyle ? null : 'unlock-dialog-clock-hint',
                x_align: Clutter.ActorAlign.CENTER,
                opacity: 0,
            });

            const removeTime = this._settings.get_boolean('remove-time');
            const removeDate = this._settings.get_boolean('remove-date');
            const removeHint = this._settings.get_boolean('remove-hint');

            removeTime ? null : this.add_child(this._time);
            removeDate ? null : this.add_child(this._date);
            removeHint ? null : this.add_child(this._hint);

            this._wallClock = new GnomeDesktop.WallClock({ time_only: true });
            this._wallClock.connect('notify::clock', this._updateClock.bind(this));

            this._seat = Clutter.get_default_backend().get_default_seat();
            this._seat.connectObject('notify::touch-mode',
                this._updateHint.bind(this), this);

            this._monitorManager = global.backend.get_monitor_manager();
            this._monitorManager.connectObject('power-save-mode-changed',
                () => (this._hint.opacity = 0), this);

            this._idleMonitor = global.backend.get_core_idle_monitor();
            this._idleWatchId = this._idleMonitor.add_idle_watch(1 * 1000, () => {
                this._hint.ease({
                    opacity: 255,
                    duration: 300,
                });
            });

            this._updateClock();
            this._updateHint();
        }

        _updateClock() {
            let date = new Date();
            let dateFormat = Shell.util_translate_time_string('%A %B %-d');

            let customizeClock = this._settings.get_string('custom-clock-text');
            let customizeDate = this._settings.get_string('custom-date-text');

            let timeFormat = Shell.util_translate_time_string(customizeClock);
            let customDateFormat = Shell.util_translate_time_string(customizeDate);

            this._time.text =
                customizeClock === ''
                    ? this._wallClock.clock
                    : customizeClock.startsWith('%')
                        ? formatDateWithCFormatString(date, timeFormat)
                        : customizeClock

            this._date.text =
                customizeDate === ''
                    ? formatDateWithCFormatString(date, dateFormat)
                    : customizeDate.startsWith('%')
                        ? formatDateWithCFormatString(date, customDateFormat)
                        : customizeDate
        }

        _updateHint() {
            this._hint.text = this._seat.touch_mode
                ? 'Swipe up to unlock'
                : 'Click or press a key to unlock'
        }

        _onDestroy() {
            this._wallClock.run_dispose();
            this._idleMonitor.remove_watch(this._idleWatchId);
        }
    }
)

export default ModifiedClock;
