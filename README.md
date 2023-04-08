# customize-clock-on-lock-screen
GDM Lock Screen - Customize Clock & Date with your own Text or Change the Formats of both Clock and Date as you wish.

To customize color, size, font weight, font-style etc, you need to edit the extensions `stylesheet.css` file.  
You can open the file with `nano` with below command or change `nano` with your favourite text editor
````
nano $HOME/.local/share/gnome-shell/extensions/CustomizeClockOnLockScreen@pratap.fastmail.fm/stylesheet.css
````
Once edited and saved the file, you need to restart gnome-shell to see the changes.

Sometimes, turning off and on the extension will do the trick. You may try this first before restaring gnome-shell with below methods.  
Alt+F2 r enter method if you are on `xorg`.  
If you are on `wayland` you need to logout and login for the changes to effect.

sample css code
````
.unlock-dialog-clock-time {
    padding: 0;
    /* color: blue;
    font-size: 64px;
    font-weight: bold;
    border-radius: 8px;
    font-style: italic; */
}

.unlock-dialog-clock-date {
    padding: 0;
    /* color: maroon;
    font-size: 64px;
    font-weight: bold;
    border-radius: 8px;
    font-style: italic; */
}
````
![customize_clock_on_lock_screen_1](https://user-images.githubusercontent.com/40719899/230715451-8a0fdf1c-0dce-4216-923d-c7259d1c1444.png)
![customize_clock_on_lock_screen_2](https://user-images.githubusercontent.com/40719899/230715452-98c0cb24-28e2-4de2-a50e-e7729a35fa80.png)
![customize_clock_on_lock_screen_3](https://user-images.githubusercontent.com/40719899/230715453-0670c04d-ea43-4e04-b276-1718747a4800.png)
![customize_clock_on_lock_screen_4](https://user-images.githubusercontent.com/40719899/230715454-86fa893f-7ae1-4a9e-bef3-3a37c18258c1.png)
![customize_clock_on_lock_screen_5](https://user-images.githubusercontent.com/40719899/230715459-241c96a2-4f65-4143-9893-f8e214b6abf2.png)
![customize_clock_on_lock_screen_6](https://user-images.githubusercontent.com/40719899/230715460-06d940fd-28ce-4c37-bcc3-01bb25c168be.png)
