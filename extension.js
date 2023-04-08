/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

'use strict';

const {Shell} = imports.gi;

const UnlockDialog = imports.ui.unlockDialog;
const ExtensionUtils = imports.misc.extensionUtils;

let native = UnlockDialog.Clock.prototype._updateClock;

class modified {
    enable() {
        UnlockDialog.Clock.prototype._updateClock = this._Change;
    }

    disable() {
        UnlockDialog.Clock.prototype._updateClock = native;
        // unlock-dialog is used because this extension purpose is
        // to control the clock format on lock screen itself.
    }

    _Change() {
        this._settings = ExtensionUtils.getSettings();

        let REPLACE_CLOCK_TEXT = this._settings.get_string('replace-clock-text');
        let CLOCK_FORMAT = this._settings.get_string('clock-format');
        let REPLACE_DATE_TEXT = this._settings.get_string('replace-date-text');
        let DATE_FORMAT = this._settings.get_string('date-format');

        let date = new Date();

        let clockFormat = Shell.util_translate_time_string(CLOCK_FORMAT);
        let dateFormat = Shell.util_translate_time_string(DATE_FORMAT);
        let dateFormatOriginal = Shell.util_translate_time_string('%A %B %-d');

        let cCF = this._settings.get_boolean('customize-clock-format');

        if (REPLACE_CLOCK_TEXT === 'default' && !cCF)
            this._time.text = this._wallClock.clock;
        else if (REPLACE_CLOCK_TEXT === 'default' && cCF)
            this._time.text = date.toLocaleFormat(clockFormat);
        else
            this._time.text = REPLACE_CLOCK_TEXT;

        let cDF = this._settings.get_boolean('customize-date-format');

        if (REPLACE_DATE_TEXT === 'default' && !cDF)
            this._date.text = date.toLocaleFormat(dateFormatOriginal);
        else if (REPLACE_DATE_TEXT === 'default' && cDF)
            this._date.text = date.toLocaleFormat(dateFormat);
        else
            this._date.text = REPLACE_DATE_TEXT;
    }
}

/**
 *
 */
function init() {
    return new modified();
}
