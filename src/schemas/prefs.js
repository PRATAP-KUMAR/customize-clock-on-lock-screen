'use strict';

const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;

const SCHEMA_NAME = 'org.gnome.shell.extensions.lockscreen';

function init() {
}

function buildPrefsWidget() {
    let widget = new PrefsWidget();
    return widget.widget;
}

class PrefsWidget {
    constructor() {
        this.gsettings = ExtensionUtils.getSettings(SCHEMA_NAME);

        this.widget = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin_top: 10,
            margin_bottom: 10,
            margin_start: 10,
            margin_end: 10,
        });

        this.vbox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            margin_top: 0,
            hexpand: true,
        });
        this.vbox.set_size_request(50, 50);

        this.vbox.append(this.replaceClockWithText());
        this.vbox.append(this.replaceDateWithText());
        this.vbox.append(new Gtk.Separator({ orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));
        this.vbox.append(this.customizeClockFormatSwitch());
        this.vbox.append(this.adjustClockFormat());
        this.vbox.append(new Gtk.Separator({ orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));
        this.vbox.append(this.customizeDateFormat());
        this.vbox.append(this.adjustDateFormat());
        this.vbox.append(new Gtk.Separator({ orientation: Gtk.Orientation.HORIZONTAL, margin_bottom: 5, margin_top: 5}));
        this.vbox.append(this.addTip());
        
        this.widget.append(this.vbox);
    }

        replaceClockWithText() {
        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
        let replaceClockWithText_label = new Gtk.Label({ label: "Replace Clock with your Text", xalign: 0, hexpand: true });
        this.replaceClockWithText_entry = new Gtk.Entry({ hexpand: true, margin_start: 20 });
	this.replaceClockWithText_entry.set_placeholder_text("Enter your own text or click on Reset Button to Use System Clock");
	
	this.resetButton = new Gtk.Button({ margin_start: 5 });
        this.resetButton.set_label("Reset to System Clock");
        this.resetButton.connect('clicked', ()=> { this.gsettings.set_string('replace-clock-text', 'Default');
        this.replaceClockWithText_entry.set_text(this.gsettings.get_string('replace-clock-text')); })
        
        this.noTextButton = new Gtk.Button({ margin_start: 5 });
        this.noTextButton.set_label("Remove Clock");
        this.noTextButton.connect('clicked', ()=> { this.gsettings.set_string('replace-clock-text', '');
        this.replaceClockWithText_entry.set_text(this.gsettings.get_string('replace-clock-text')); })
	
	this.replaceClockWithText_entry.set_text(this.gsettings.get_string('replace-clock-text'));
	this.replaceClockWithText_entry.connect('changed', (entry) => { this.gsettings.set_string('replace-clock-text', entry.get_text()); });
	
	hbox.append(replaceClockWithText_label);
	hbox.append(this.replaceClockWithText_entry);
	hbox.append(this.resetButton);
	hbox.append(this.noTextButton);
	return hbox;	
	}
	
        replaceDateWithText() {
        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
        let replaceDateWithText_label = new Gtk.Label({ label: "Replace Date with your Text", xalign: 0, hexpand: true });
        this.replaceDateWithText_entry = new Gtk.Entry({ hexpand: true, margin_start: 20 });
	this.replaceDateWithText_entry.set_placeholder_text("Enter your own text or click on Reset Button to Use System Date");
	
	this.resetButton = new Gtk.Button({ margin_start: 5 });
        this.resetButton.set_label("Reset to System Date");
        this.resetButton.connect('clicked', ()=> { this.gsettings.set_string('replace-date-text', 'Default');
        this.replaceDateWithText_entry.set_text(this.gsettings.get_string('replace-date-text')); })
        
        this.noTextButton = new Gtk.Button({ margin_start: 5 });
        this.noTextButton.set_label("Remove Date");
        this.noTextButton.connect('clicked', ()=> { this.gsettings.set_string('replace-date-text', '');
        this.replaceDateWithText_entry.set_text(this.gsettings.get_string('replace-date-text')); })
	
	this.replaceDateWithText_entry.set_text(this.gsettings.get_string('replace-date-text'));
	this.replaceDateWithText_entry.connect('changed', (entry) => { this.gsettings.set_string('replace-date-text', entry.get_text()); });
	
	hbox.append(replaceDateWithText_label);
	hbox.append(this.replaceDateWithText_entry);
	hbox.append(this.resetButton);
	hbox.append(this.noTextButton);
	
	return hbox;	
	}	
	
    	customizeClockFormatSwitch() {
    	let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
        let cCF_label = new Gtk.Label({ label: "Turn on to customize clock format (Effective only if 'Reset to System Clock' Button above is Clicked)", xalign: 0, hexpand: true });
        this.cCF_switch = new Gtk.Switch({ active: this.gsettings.get_boolean('customize-clock-format') });
        this.cCF_switch.connect('notify::active', (button) => { this.gsettings.set_boolean('customize-clock-format', button.active); });
        
        hbox.append(cCF_label);
        hbox.append(this.cCF_switch);
        return hbox;
    }
    
    _test() {
    let boolean = this.gsettings.get_boolean('customize-clock-format');
    if(boolean) { this.gsettings.set_string('replace-clock-text', 'Default'); } else {
    this.gsettings.set_string('clock-format', ''); }
    }
    
	adjustClockFormat() {
        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
        let clockFormat_label = new Gtk.Label({ label: "Enter Valid Date/Time Format Codes", xalign: 0, hexpand: true });
        this.clockFormat_entry = new Gtk.Entry({ hexpand: true, margin_start: 20 });
	this.clockFormat_entry.set_placeholder_text("Enter Valid Date/Time Format Codes");
	
	this.clockFormat_entry.set_text(this.gsettings.get_string('clock-format'));
	this.clockFormat_entry.connect('changed', (entry) => { this.gsettings.set_string('clock-format', entry.get_text()); });
	
	hbox.append(clockFormat_label);
	hbox.append(this.clockFormat_entry);
	
	return hbox;	
	}    
    
    	customizeDateFormat() {
    	let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
        let cDF_label = new Gtk.Label({ label: "Turn on to customize date format (Effective only if 'Reset to System Date' Button above is Clicked)", xalign: 0, hexpand: true });
        this.cDF_switch = new Gtk.Switch({ active: this.gsettings.get_boolean('customize-date-format') });
        this.cDF_switch.connect('notify::active', (button) => { this.gsettings.set_boolean('customize-date-format', button.active); });
        
        hbox.append(cDF_label);
        hbox.append(this.cDF_switch);
        return hbox;
    }
    
	adjustDateFormat() {
        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
        let dateFormat_label = new Gtk.Label({ label: "Enter Valid Date/Time Format Codes", xalign: 0, hexpand: true });
        this.dateFormat_entry = new Gtk.Entry({ hexpand: true, margin_start: 20 });
	this.dateFormat_entry.set_placeholder_text("Enter Valid Date/Time Format Codes");
	
	this.dateFormat_entry.set_text(this.gsettings.get_string('date-format'));
	this.dateFormat_entry.connect('changed', (entry) => { this.gsettings.set_string('date-format', entry.get_text()); });
	
	hbox.append(dateFormat_label);
	hbox.append(this.dateFormat_entry);
	
	return hbox;	
	}    
	
	addTip() {
    	let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
	let url = "https://help.gnome.org/users/gthumb/stable/gthumb-date-formats.html.en";
	this.linkButton = Gtk.LinkButton.new_with_label(url, 'web link for valid Date/Time Format Codes');
	
	hbox.append(this.linkButton);
	
	return hbox;
	}
    
}      

