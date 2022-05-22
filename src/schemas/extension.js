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


'use strict'

const { Gio, GLib, Shell, St } = imports.gi;

const Main = imports.ui.main;
const Background = imports.ui.background;
const UnlockDialog = imports.ui.unlockDialog;
const ExtensionUtils = imports.misc.extensionUtils;

const SCHEMA_NAME = 'org.gnome.shell.extensions.lockscreen';

let native = UnlockDialog.Clock.prototype._updateClock;

class modified {
    constructor() {
    }

    enable() {
    	UnlockDialog.Clock.prototype._updateClock = this._Change;
    }

    disable() {
        if(Main.sessionMode.currentMode == 'unlock-dialog') {
        UnlockDialog.Clock.prototype._updateClock = this._Change; } else {
        UnlockDialog.Clock.prototype._updateClock = native; }
    }
    
   
    _Change() {
    
        this.gsettings = ExtensionUtils.getSettings(SCHEMA_NAME);
        
        let REPLACE_CLOCK_TEXT = this.gsettings.get_string('replace-clock-text');
        let CLOCK_FORMAT = this.gsettings.get_string('clock-format');
        let REPLACE_DATE_TEXT = this.gsettings.get_string('replace-date-text');
        let DATE_FORMAT = this.gsettings.get_string('date-format');
        
        let date = new Date();
        
        let clockFormat = Shell.util_translate_time_string(N_(CLOCK_FORMAT));
        let dateFormat = Shell.util_translate_time_string(N_(DATE_FORMAT));
        let dateFormatOriginal = Shell.util_translate_time_string(N_('%A %B %-d'));
        
        let cCF = this.gsettings.get_boolean('customize-clock-format');
        
        if(REPLACE_CLOCK_TEXT === "Default" && (!cCF)) {
        this._time.text = this._wallClock.clock; } else if(REPLACE_CLOCK_TEXT === "Default" && (cCF)) {
        this._time.text = date.toLocaleFormat(clockFormat); } else {
        this._time.text = REPLACE_CLOCK_TEXT;
	}
	
	let cDF = this.gsettings.get_boolean('customize-date-format');
	
	if(REPLACE_DATE_TEXT === "Default" && (!cDF)) {
        this._date.text = date.toLocaleFormat(dateFormatOriginal); } else if(REPLACE_DATE_TEXT === "Default" && (cDF)) {
        this._date.text = date.toLocaleFormat(dateFormat); } else {
        this._date.text = REPLACE_DATE_TEXT;
	}
     }
}

function init() {
return new modified();
}
