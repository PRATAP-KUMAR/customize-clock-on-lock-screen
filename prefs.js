import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

let fontSizeTimeAdjustButton;
let fontSizeDateAdjustButton;
let fontSizeHintAdjustButton;

export default class CustomizeClockExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();
        window._timeColorButton = new Gtk.ColorButton();
        window._dateColorButton = new Gtk.ColorButton();
        window._hintColorButton = new Gtk.ColorButton();

        setButtonColor(window._timeColorButton, 'time-color');
        setButtonColor(window._dateColorButton, 'date-color');
        setButtonColor(window._hintColorButton, 'hint-color');

        const colorButton = (button, id) => {
            return selectButtonColor(button, id);
        };

        const myAdjustFontSizeTime = () => {
            fontSizeTimeAdjustButton = new Gtk.SpinButton();
            fontSizeTimeAdjustButton.set_range(36, 96);
            fontSizeTimeAdjustButton.set_increments(2, 4);
            fontSizeTimeAdjustButton.set_value(window._settings.get_int('time-size'));
            fontSizeTimeAdjustButton.connect('value-changed', entry => {
                window._settings.set_int('time-size', entry.get_value());
            });

            return fontSizeTimeAdjustButton;
        };

        const myAdjustFontSizeDate = () => {
            fontSizeDateAdjustButton = new Gtk.SpinButton();
            fontSizeDateAdjustButton.set_range(36, 96);
            fontSizeDateAdjustButton.set_increments(2, 4);
            fontSizeDateAdjustButton.set_value(window._settings.get_int('date-size'));
            fontSizeDateAdjustButton.connect('value-changed', entry => {
                window._settings.set_int('date-size', entry.get_value());
            });

            return fontSizeDateAdjustButton;
        };

        const myAdjustFontSizeHint = () => {
            fontSizeHintAdjustButton = new Gtk.SpinButton();
            fontSizeHintAdjustButton.set_range(24, 96);
            fontSizeHintAdjustButton.set_increments(2, 4);
            fontSizeHintAdjustButton.set_value(window._settings.get_int('hint-size'));
            fontSizeHintAdjustButton.connect('value-changed', entry => {
                window._settings.set_int('hint-size', entry.get_value());
            });

            return fontSizeHintAdjustButton;
        };

        // const myResetFontSize = () => {
        //     let resetButton = new Gtk.Button();
        //     resetButton.set_label("Reset");
        //     resetButton.connect('clicked', () => {
        //         window._settings.set_int('date-size', 24);
        //       fontSizeTimeAdjustButton.set_value(window._settings.get_int('date-size'));
        //     });
        // }

        const CustomTimeText = () => {
            let textUrlEntry = new Gtk.Entry();
            textUrlEntry.set_width_chars(40);
            textUrlEntry.set_placeholder_text('ex: %r - Foo Bar or Hello World');

            textUrlEntry.set_text(window._settings.get_string('custom-time-text'));
            textUrlEntry.connect('changed', entry => {
                window._settings.set_string('custom-time-text', entry.get_text());
            });

            return textUrlEntry;
        };

        const CustomDateText = () => {
            let textUrlEntry = new Gtk.Entry();
            textUrlEntry.set_width_chars(40);
            textUrlEntry.set_placeholder_text('ex: %r - Foo Bar or Hello World');

            textUrlEntry.set_text(window._settings.get_string('custom-date-text'));
            textUrlEntry.connect('changed', entry => {
                window._settings.set_string('custom-date-text', entry.get_text());
            });

            return textUrlEntry;
        };

        const addTip = () => {
            let url = 'https://help.gnome.org/users/gthumb/stable/gthumb-date-formats.html.en';
            let linkButton = Gtk.LinkButton.new_with_label(url, 'Web link for valid Date/Time Format Codes');

            return linkButton;
        };

        const customStyling = new Adw.SwitchRow({
            title: 'Apply below custom styling',
        });

        const timeColorRow = new Adw.ActionRow({
            title: 'Time font color',
        });
        timeColorRow.add_suffix(colorButton(window._timeColorButton, 'time-color'));

        const dateColorRow = new Adw.ActionRow({
            title: 'Date font color',
        });
        dateColorRow.add_suffix(colorButton(window._dateColorButton, 'date-color'));

        const hintColorRow = new Adw.ActionRow({
            title: 'Hint font color',
        });
        hintColorRow.add_suffix(colorButton(window._hintColorButton, 'hint-color'));

        const timeFontSizeRow = new Adw.ActionRow({
            title: 'Time Size in Pixels',
        });
        timeFontSizeRow.add_suffix(myAdjustFontSizeTime());

        const dateFontSizeRow = new Adw.ActionRow({
            title: 'Date Size in Pixels',
        });
        dateFontSizeRow.add_suffix(myAdjustFontSizeDate());

        const hintFontSizeRow = new Adw.ActionRow({
            title: 'Hint Size in Pixels',
        });
        hintFontSizeRow.add_suffix(myAdjustFontSizeHint());

        const customTimeText = new Adw.ActionRow({
            title: 'Custom Time Text',
        });
        customTimeText.add_suffix(CustomTimeText());

        const customDateText = new Adw.ActionRow({
            title: 'Custom Date Text',
        });
        customDateText.add_suffix(CustomDateText());

        const hintRow = new Adw.ActionRow({
            title: 'Gnome Time Date Format Help Link',
        });
        hintRow.add_suffix(addTip());

        const removeTime = new Adw.SwitchRow({
            title: 'Remove Time',
        });

        const removeDate = new Adw.SwitchRow({
            title: 'Remove Date',
        });

        const removeHint = new Adw.SwitchRow({
            title: 'Remove Hint',
        });

        const page = new Adw.PreferencesPage();
        window.add(page);

        const customStyleGroup = new Adw.PreferencesGroup({
            title: 'Custom Styling',
        });
        page.add(customStyleGroup);

        const customTextGroup = new Adw.PreferencesGroup({
            title: 'Custom Text Options',
            description: 'either use gnome time date text format or type your preferred text or leave blank for default values',
        });
        page.add(customTextGroup);

        const group = new Adw.PreferencesGroup({
            title: 'Remove Options',
        });
        page.add(group);

        group.add(removeTime);
        group.add(removeDate);
        group.add(removeHint);

        customStyleGroup.add(customStyling);
        customStyleGroup.add(timeColorRow);
        customStyleGroup.add(dateColorRow);
        customStyleGroup.add(hintColorRow);
        customStyleGroup.add(timeFontSizeRow);
        customStyleGroup.add(dateFontSizeRow);
        customStyleGroup.add(hintFontSizeRow);

        customTextGroup.add(customTimeText);
        customTextGroup.add(customDateText);
        customTextGroup.add(hintRow);

        window._settings.bind('custom-style', customStyling, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-time', removeTime, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-date', removeDate, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-hint', removeHint, 'active', Gio.SettingsBindFlags.DEFAULT);

        window.maximize();

        // helper functions

        /**
         *
         * @param {string} button button
         * @param {string} id id
         */
        function setButtonColor(button, id) {
            let rgba = new Gdk.RGBA();
            let hexString = window._settings.get_string(id);
            rgba.parse(hexString);
            button.set_rgba(rgba);
        }

        /**
         *
         * @param {string} button 'button'
         * @param {string} id 'id'
         */
        function selectButtonColor(button, id) {
            let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, halign: Gtk.Align.END});
            button.connect('notify::rgba', () => onPanelColorChanged(button, id));
            hbox.append(button);

            return hbox;
        }

        /**
         *
         * @param {string } button 'button'
         * @param {string} id 'id'
         */
        function onPanelColorChanged(button, id) {
            let rgba = button.get_rgba();
            let css = rgba.to_string();
            let hexString = cssHexString(css);
            window._settings.set_string(id, hexString);
        }

        /**
         *
         * @param {string} css 'css'
         */
        function cssHexString(css) {
            let rrggbb = '#';
            let start;
            for (let loop = 0; loop < 3; loop++) {
                let end = 0;
                let xx = '';
                for (let loop1 = 0; loop1 < 2; loop1++) {
                    while (true) {
                        let x = css.slice(end, end + 1);
                        if (x === '(' || x === ',' || x === ')')
                            break;
                        end += 1;
                    }
                    if (loop1 === 0) {
                        end += 1;
                        start = end;
                    }
                }
                xx = parseInt(css.slice(start, end)).toString(16);
                if (xx.length === 1)
                    xx = `0${xx}`;
                rrggbb += xx;
                css = css.slice(end);
            }
            return rrggbb;
        }
    }
}
