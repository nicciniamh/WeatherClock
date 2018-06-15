# WeatherClock for Raspberry Pi

## Description
Displays on local display, weather data for configurable locations, and local temperature and humidity

## Required hardware
-   Raspberry Pi
-   Display suitable for X11
-   si7021 temperature/humidity sensor

## Required software
-   Web server
-   Python libraries: smbus2 wiringpi pytemperature
-   xdotool (so busykbd can keep screen on and mouse pointer lower right)

## Files
    ~/etc/owm.json     Copy the file here, own.json, and add openweathermap api key
    bin/
        busykbd         Keeps screen on and mouse pointer in lower right corner
        getowm          Get weather data from openweathermap
        si7021data      Get data from si7021
        WeatherClock    Script to start wc.html in browser
    pylib/
        si7021.py       Python library for si7021
    owm.php             PHP script to read processed openweathermap data in JSON format
    places.php          PHP script to get list of configured places in JSON format
    strftime.js         Javascript strftime module from [Sami Samhuri](https://www.github.com//samsonjs/strftime)
    util.js             Some utilitiy functions
    wc.css              CSS for weather clock
    wc.html             HTML framework for weather clock
    wc.js               Javascript that runs weather clock
    wdata.php           PHP Script to get local temperature data in JSON format
    weather.png         favicon file for Weatherclock

##  Put it together
### Make a /sensor directory that is not going to hammer the sd card
- sudo mkdir /sensor
- Add an entry to /etc/fstab to mount a tmpfs to /sensor: `tmpfs /sensor tmpfs nodev,uid=1000,gid=1000,nosuid,size=8M 0 0`

### Cron jobs
```
*/1 * * * * /home/pi/bin/getowm     # Get open weathermap data
*/1 * * * * /home/pi/bin/busykbd    # Run busykbd to keep screen on
@reboot /home/pi/bin/WeatherClock   # Run browser session in app mode for the weather clock
@reboot /home/pi/bin/si7021data     # Get local temperature/humidity data
```