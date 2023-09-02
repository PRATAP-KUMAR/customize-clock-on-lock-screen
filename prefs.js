import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class CustomizeClockExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();
        window._timeColorButton = new Gtk.ColorButton();
        window._dateColorButton = new Gtk.ColorButton();
        window._hintColorButton = new Gtk.ColorButton();

        setButtonColor(window._timeColorButton, 'time-color');
        setButtonColor(window._dateColorButton, 'date-color');
        setButtonColor(window._hintColorButton, 'hint-color');

        window.widget = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin_top: 10,
            margin_bottom: 10,
            margin_start: 10,
            margin_end: 10,
        });

        const colorButton = (label, button, id) => {
            let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
            let colorLabel = new Gtk.Label({ label, xalign: 0, hexpand: true });

            hbox.append(colorLabel);
            hbox.append(selectButtonColor(button, id));
            return hbox;
        }

        const adjustFontSizeTime = () => {
            let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
            let fontSizeLabel = new Gtk.Label({ label: 'Adjust Time Font Size (pt)', xalign: 0, hexpand: true });
            let fontSizeAdjustButton = new Gtk.SpinButton();
            fontSizeAdjustButton.set_range(24, 96);
            fontSizeAdjustButton.set_increments(2, 4);
            fontSizeAdjustButton.set_value(window._settings.get_int('time-size'));
            fontSizeAdjustButton.connect('value-changed', entry => {
                window._settings.set_int('time-size', entry.get_value());
            });

            let resetButton = new Gtk.Button({ margin_start: 5 });
            resetButton.set_label("Reset to Extensions's Default Value");
            resetButton.connect('clicked', () => {
                window._settings.set_int('time-size', 72);
                fontSizeAdjustButton.set_value(window._settings.get_int('time-size'));
            });

            hbox.append(fontSizeLabel);
            hbox.append(fontSizeAdjustButton);
            hbox.append(resetButton);

            return hbox;
        };

        const adjustFontSizeDate = () => {
            let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
            let fontSizeLabel = new Gtk.Label({ label: 'Adjust Date Font Size (pt)', xalign: 0, hexpand: true });
            let fontSizeAdjustButton = new Gtk.SpinButton();
            fontSizeAdjustButton.set_range(24, 96);
            fontSizeAdjustButton.set_increments(2, 4);
            fontSizeAdjustButton.set_value(window._settings.get_int('date-size'));
            fontSizeAdjustButton.connect('value-changed', entry => {
                window._settings.set_int('date-size', entry.get_value());
            });

            let resetButton = new Gtk.Button({ margin_start: 5 });
            resetButton.set_label("Reset to Extensions's Default Value");
            resetButton.connect('clicked', () => {
                window._settings.set_int('date-size', 24);
                fontSizeAdjustButton.set_value(window._settings.get_int('date-size'));
            });

            hbox.append(fontSizeLabel);
            hbox.append(fontSizeAdjustButton);
            hbox.append(resetButton);

            return hbox;
        };

        const adjustFontSizeHint = () => {
            let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
            let fontSizeLabel = new Gtk.Label({ label: 'Adjust Hint Font Size (pt)', xalign: 0, hexpand: true });
            let fontSizeAdjustButton = new Gtk.SpinButton();
            fontSizeAdjustButton.set_range(12, 96);
            fontSizeAdjustButton.set_increments(2, 4);
            fontSizeAdjustButton.set_value(window._settings.get_int('hint-size'));
            fontSizeAdjustButton.connect('value-changed', entry => {
                window._settings.set_int('hint-size', entry.get_value());
            });

            let resetButton = new Gtk.Button({ margin_start: 5 });
            resetButton.set_label("Reset to Extensions's Default Value");
            resetButton.connect('clicked', () => {
                window._settings.set_int('hint-size', 12);
                fontSizeAdjustButton.set_value(window._settings.get_int('hint-size'));
            });

            hbox.append(fontSizeLabel);
            hbox.append(fontSizeAdjustButton);
            hbox.append(resetButton);

            return hbox;
        };

        const customTimeText = () => {
            let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
            let label = new Gtk.Label({ label: 'Custom Time Text', xalign: 0, hexpand: true });
            let textUrlEntry = new Gtk.Entry({ margin_start: 5 });
            textUrlEntry.set_width_chars(60);
            textUrlEntry.set_placeholder_text('ex: %r - Foo Bar or Hello World');

            textUrlEntry.set_text(window._settings.get_string('custom-time-text'));
            textUrlEntry.connect('changed', entry => {
                window._settings.set_string('custom-time-text', entry.get_text());
            });

            hbox.append(label);
            hbox.append(textUrlEntry);

            return hbox;
        };

        const customDateText = () => {
            let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
            let label = new Gtk.Label({ label: 'Custom Date Text', xalign: 0, hexpand: true });
            let textUrlEntry = new Gtk.Entry({ margin_start: 5 });
            textUrlEntry.set_width_chars(60);
            textUrlEntry.set_placeholder_text('ex: %x - Foo Bar or Hello World');

            textUrlEntry.set_text(window._settings.get_string('custom-date-text'));
            textUrlEntry.connect('changed', entry => {
                window._settings.set_string('custom-date-text', entry.get_text());
            });

            hbox.append(label);
            hbox.append(textUrlEntry);

            return hbox;
        };

        const addTip = () => {
            let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
            let url = 'https://help.gnome.org/users/gthumb/stable/gthumb-date-formats.html.en';
            let linkButton = Gtk.LinkButton.new_with_label(url, 'Web link for valid Date/Time Format Codes');

            hbox.append(linkButton);

            return hbox;
        }

        const customStyling = new Adw.SwitchRow({
            title: 'Custom Styling',
        });

        const removeTime = new Adw.SwitchRow({
            title: 'Remove Time',
        });

        const removeDate = new Adw.SwitchRow({
            title: 'Remove Date',
        });

        const removeHint = new Adw.SwitchRow({
            title: 'Remove Hint',
        });

        const disableExtension = new Adw.SwitchRow({
            title: 'Disable this Extension',
        });

        const page = new Adw.PreferencesPage();
        window.add(page);

        const customStyleGroup = new Adw.PreferencesGroup({
            title: 'Custom Styling'
        });
        page.add(customStyleGroup);

        const customTextGroup = new Adw.PreferencesGroup({
            title: 'Custom Text Options',
            description: 'either use gnome date time text format or type your preferred text or leave blank for default values'
        })
        page.add(customTextGroup)

        const group = new Adw.PreferencesGroup({
            title: 'Remove Options'
        })
        page.add(group)

        group.add(removeTime);
        group.add(removeDate);
        group.add(removeHint);
        group.add(disableExtension);

        customStyleGroup.add(customStyling);
        customStyleGroup.add(colorButton('Time Color', window._timeColorButton, 'time-color'));
        customStyleGroup.add(colorButton('Date Color', window._dateColorButton, 'date-color'));
        customStyleGroup.add(colorButton('Hint Color', window._hintColorButton, 'hint-color'));
        customStyleGroup.add(adjustFontSizeTime());
        customStyleGroup.add(adjustFontSizeDate());
        customStyleGroup.add(adjustFontSizeHint());

        customTextGroup.add(customTimeText());
        customTextGroup.add(customDateText());
        customTextGroup.add(addTip())

        window._settings.bind('custom-style', customStyling, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-time', removeTime, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-date', removeDate, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('remove-hint', removeHint, 'active', Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('disable-extension', disableExtension, 'active', Gio.SettingsBindFlags.DEFAULT);

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
            let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5, halign: Gtk.Align.END });
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
