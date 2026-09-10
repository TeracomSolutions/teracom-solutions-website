// Help Centre / FAQ content recovered from the previous Teracom Solutions
// website (Wayback Machine archive, Sept 2026). Each topic corresponds to
// one of the old site's "Technical Help" explainer articles -- these were
// also what the old site's own /faq page linked out to, so "Help Centre"
// and "FAQs" on the old site were really the same set of 8 topics rather
// than separate shipping/returns/payment Q&A.

export const helpCenterTopics = [
  {
    slug: 'ahd',
    title: 'AHD Cameras Explained',
    intro: `AHD CCTV stands for "analog high definition". It's an HD surveillance video standard for CCTV cameras and DVRs, currently supporting 720p, 1080p, 4MP, 5MP and 8MP resolutions.

Surveillance cameras come in a huge range of shapes and sizes, each with their own strengths, so it pays to think through a few things before choosing one for a given location: the distance from the camera to the area you want covered, how wide that field of view needs to be, how the lighting changes through the day (or whether you need low-light performance), and whether you need colour or black & white footage (black & white tends to perform better in low light). There isn't one camera that suits every situation, so it's worth evaluating each location on its own merits.`,
    faqs: [
      {
        q: 'What are AHD cameras / AHD technology?',
        a: 'AHD CCTV is an analog high definition closed-circuit television video surveillance standard that uses coax cable to transmit HD video from security cameras to DVRs. AHD supports resolutions from 720p up to 8MP.',
      },
      {
        q: 'What is the difference between SDI, TVI, CVI, Analog, AHD and IP?',
        a: `Analog -- up to 1000 TVL.
AHD (Analog High Definition) -- up to 8MP resolution.
CVI / TVI -- different manufacturers' own HD-over-coax formats.
SDI -- Full HD, 1080p.
IP -- network/digital cameras.`,
      },
      {
        q: 'What are the advantages of an AHD camera?',
        a: `AHD cameras capture high definition video at up to 8MP resolution and are used with AHD DVRs, with the convenience of plug-and-play installation. The camera and DVR connect via BNC (Bayonet Neill-Concelman) cable, which carries power to the camera and returns the video/alarm signal to the DVR.

Key advantages:
1. Wide range of resolutions available
2. Supports long cable transmission distances
3. Low cost`,
      },
      {
        q: 'What cable is used to connect an AHD camera to the DVR?',
        a: "AHD cameras are installed using coaxial cable. Most integrators use CCTV cable (3+1), which carries video, audio and DC power in the one run -- keep in mind this has some limitations over very long distances due to power and video signal drop.",
      },
      {
        q: 'What is CMOS?',
        a: 'CMOS (Complementary Metal-Oxide Semiconductor) is the image sensor inside the camera that converts incoming light into an electronic signal.',
      },
      {
        q: 'What type of lens does an AHD camera use?',
        a: 'AHD cameras generally use one of two lens types -- fixed or varifocal. Fixed lenses are commonly available in 2.6mm, 3.6mm, 6mm, 8mm and 12mm focal lengths depending on the field of view you need.',
      },
      {
        q: 'What is a varifocal lens?',
        a: 'A varifocal lens has a variable focal length, so the focus changes as the focal length is adjusted. AHD varifocal cameras typically use a 2.8-12mm lens, letting you fine-tune the field of view once the camera is on site.',
      },
      {
        q: 'What is an ICR (IR-cut filter) and what does it do?',
        a: "An ICR (IR-Cut Filter Removable) is a mechanical shutter between the lens and image sensor, controlled by a motor or electromagnet. When it's switched on, it blocks infrared light so only visible light passes through (colour mode). When switched off, infrared light is allowed through and the image switches to black & white, which is more sensitive in low light.",
      },
      {
        q: "What is an IR LED, and what gives an AHD camera its day/night capability?",
        a: "An IR LED (Infrared Light Emitting Diode) emits light in the infrared range, invisible to the naked eye. AHD cameras use IR LEDs to illuminate a scene in darkness -- effectively acting like a spotlight only the camera can see -- and this is what gives them day/night switching.",
      },
      {
        q: 'What DVR do I need for an AHD camera?',
        a: 'AHD cameras need an AHD DVR of a matching or higher resolution -- for example, a 3MP AHD camera should be paired with a DVR that supports at least 3MP.',
      },
    ],
  },
  {
    slug: 'ip',
    title: 'Megapixel IP Cameras Explained',
    intro: `The megapixel value is simply a shorthand way of expressing a camera's image resolution as a single figure -- multiply the horizontal resolution by the vertical resolution to get the total number of pixels the sensor can deliver. Because that multiplication typically runs into the hundreds of thousands or millions, we use "mega" (10 to the power of six) to express the result. Any resolution over 1 million pixels is considered "megapixel", and the labels are approximate -- a "2 megapixel" camera actually captures around 1,920,000 pixels per frame, and a "3 megapixel" camera around 3,145,728 pixels per frame.

Common resolution terms you'll see quoted on cameras and recorders:
- 720p HD -- 1280 x 720 (approx. 1 Megapixel)
- 960P (Sony-specific HD standard) -- 1280 x 960
- 1.3 Megapixel -- 1280 x 1024
- 1080p HD -- 1920 x 1080 (2.0 Megapixel)
- 3MP -- 2048 x 1536 (3.0 Megapixel)
- 4MP -- 2688 x 1520 (4.0 Megapixel)
- 5MP -- 2592 x 1944 (5.0 Megapixel)
- 6MP -- 3072 x 2048 (6.0 Megapixel)
- 8MP -- 3840 x 2160 (8.0 Megapixel)
- 12MP -- 4000 x 3072 (12.0 Megapixel)

Older analog cameras quote resolution in "TV lines" instead -- the horizontal resolution of the image, so a 700-line camera resolves more detail than a 420-line camera. Digital recorders, by contrast, use the megapixel terms above; a DVR rated "Full D1" can record all the detail captured by the highest-resolution analog cameras. Which resolution you actually need comes down to the application, your budget, and how much detail matters -- it's easier to justify paying for higher resolution when you need to read fine detail, such as recording monetary transactions, facial recognition, or reading number plates.`,
    faqs: [
      {
        q: 'What is an IP camera?',
        a: "IP stands for Internet Protocol. An IP camera is a digital video system that can transmit data over a network, so you can view your security feed from a mobile device anywhere with an internet connection. IP cameras are also referred to as network cameras.",
      },
      {
        q: 'How do IP surveillance cameras work?',
        a: "In a traditional analog system, video is sent over cable to a DVR. An IP camera instead sends digital video over your network -- much like any other IT device such as a printer. Footage may be stored on the camera itself, or streamed to a separate storage device on the network known as a network video recorder (NVR). Image quality isn't compromised by going digital -- resolution is generally better than analog.",
      },
      {
        q: 'What network connection do I need for an IP camera system?',
        a: "You can run IP cameras over a wired network (physical router/switch) or Wi-Fi. Wired networks tend to be more secure and reliable; Wi-Fi is easier to install but needs more attention to security. A cellular connection is also possible and tends to be more secure than Wi-Fi, though slower. We can help work out which option suits your site and security needs.",
      },
      {
        q: 'What components will I need for an IP camera system?',
        a: "You'll need the IP cameras themselves and an NVR or other storage device. Microphones and speakers are usually already built into the cameras, so additional accessories generally aren't required. We can help size the right equipment for your budget.",
      },
      {
        q: 'What are the advantages of IP surveillance systems?',
        a: 'Higher resolution, easier installation, improved capability for the cost, faster and more reliable performance, easier day-to-day management, and easier compliance with IT policy requirements.',
      },
    ],
  },
  {
    slug: 'ptz',
    title: 'PTZ Cameras Explained',
    intro: `PTZ is an abbreviation for pan, tilt and zoom, reflecting the camera's movement options. A related type is ePTZ, or virtual pan-tilt-zoom (VPTZ), where a high-resolution camera digitally zooms and pans into portions of the image with no physical movement of the camera itself. PTZ cameras are usually connected to a digital video recorder, which records the camera's full field of view in full quality regardless of where the camera is currently pointed.

PTZ cameras look similar to dome cameras and are housed in a hard-shell dome that both protects the camera and hides its current direction from onlookers, but they differ in that they support remote directional and zoom control. Beyond surveillance, PTZ cameras are also widely used for video conferencing, live production, lecture capture and distance learning.`,
    faqs: [
      {
        q: 'What is meant by a PTZ camera?',
        a: "PTZ stands for pan, tilt and zoom -- a surveillance camera with remote directional and zoom control. Panning and tilting is the camera itself physically moving, while zoom is the lens changing its focal length and focus.",
      },
      {
        q: 'What is the difference between IP PTZ and AHD PTZ cameras?',
        a: 'An AHD PTZ camera uses two separate cables -- one for the video signal, one for the pan/tilt/zoom controller. An IP PTZ camera works over a single network cable that carries both the video feed and the pan/tilt/zoom control signal.',
      },
      {
        q: 'What is a PTZ camera housing made of -- is it vandal-proof?',
        a: "PTZ cameras carry an IP66 rating and offer a degree of vandal resistance -- the outer casing is metal or high-grade abrasion-resistant plastic, with the lens further protected by a reinforced glass dome.",
      },
      {
        q: 'What power supply does a PTZ camera need?',
        a: 'Our PTZ camera range requires a 12V DC, 5 Amp power supply.',
      },
      {
        q: 'What cable connections are needed for power and video?',
        a: 'Power connector: DC pin, 12V DC, 5 Amp.\nVideo/network connector: RJ45 over Cat6 cable.',
      },
      {
        q: 'How far can the power connection to a PTZ camera run?',
        a: "We strongly recommend powering a PTZ camera from an immediate, local power source. Running power over a long cable distance reduces the voltage reaching the camera and can stop it functioning properly.",
      },
    ],
  },
  {
    slug: 'nvr',
    title: 'NVR Explained',
    intro: `NVR stands for Network Video Recorder. Unlike its predecessor the DVR, an NVR isn't limited to sitting in the same location as your camera cabling -- it can be placed virtually anywhere, as long as it's on the same LAN as your IP cameras. Video on a DVR is encoded and processed at the recorder itself; video on an NVR is encoded and processed at the camera, then streamed to the NVR for storage or remote viewing.

An NVR is essentially a software program that records video in a digital format to a disk drive, USB flash drive, SD card or other mass storage device -- it contains no dedicated video capture hardware of its own, though the software typically runs on a dedicated device with an embedded operating system. Because of how they work, a camera capable of capturing high resolution (megapixel) video will record and play back at that full resolution on an NVR. We also offer hybrid DVR systems that combine NVR and DVR functionality in the one recorder.`,
    faqs: [
      {
        q: 'Forgot the login password?',
        a: "Note down the unit's serial number and contact your dealer for a temporary password. Log in with the temporary password, then reset it to something of your own.",
      },
      {
        q: "The web plugin (ActiveX) won't load?",
        a: `Close your browser before the installation starts, and disable your firewall and antivirus while installing.
In Internet Explorer: enable checking for newer versions of stored pages on every visit (Tools -> Internet Options -> General -> Settings), add your NVR's IP address to Trusted Sites (Tools -> Internet Options -> Security) and to the Compatibility View list (Tools -> Compatibility View Settings), then clear IE's cache.`,
      },
      {
        q: 'A camera keeps going online and offline?',
        a: 'Check that the network connection is stable, and update the firmware on both the camera and the NVR -- contact us for the latest versions.',
      },
      {
        q: "Live view works but I can't find the recording?",
        a: "Check that a recording schedule is configured correctly, that the NVR's time and time zone are correct, that the hard disk isn't damaged, and that the footage you're after hasn't already been overwritten.",
      },
      {
        q: "Motion detection isn't working?",
        a: "Check that motion detection is enabled and the detection area is drawn correctly, that sensitivity isn't set too low, and that the arming schedule is configured for the time in question.",
      },
      {
        q: "The NVR won't recognise a hard disk?",
        a: 'Use the power adapter supplied with your NVR, power the unit down and reseat the disk, then try a different disk slot. If it still isn\'t recognised, the disk may not be compatible -- contact us for a list of compatible models.',
      },
      {
        q: "The mouse doesn't work?",
        a: "Use the mouse supplied with your NVR, and make sure no extension cable has been added between the mouse and the unit.",
      },
    ],
  },
  {
    slug: 'xvr',
    title: 'DVR / XVR Explained',
    intro: `DVR stands for Digital Video Recorder. DVR systems process and encode video data at the recorder itself, whereas NVR systems encode and process video at the camera before streaming it to the recorder for storage and remote viewing. A DVR records video from a dozen or more surveillance cameras onto a hard disk, and can switch frame rate between real-time and time-lapse to save storage space -- a big step up in flexibility from the analog VHS tape systems it replaced, with footage that can easily be transmitted over a network.

Our Pentabrid DVR range (also called XVR) is compatible with all of the latest HD-over-coax signal types -- HDCVI, TVI and AHD -- as well as traditional standard-definition analog CCTV cameras, so a single recorder can support a mix of camera generations on site.`,
    faqs: [
      {
        q: 'What is a DVR?',
        a: "A DVR records video in a digital format that can be saved to a disk drive, SSD, SD card or USB flash drive -- like a basic VCR that uses hard drives instead of videotapes, and can pause live TV in real time. For CCTV, the DVR converts the incoming analog signal to a compressed digital format. IP cameras can work independently of a DVR in the same way a security camera can record to its own SD card.",
      },
      {
        q: 'What do the on-screen messages mean (No Disk / Disk Fail / No Video / Disk Full)?',
        a: `No Disk -- the disk isn't fully inserted, or isn't available.
Disk Fail -- the disk isn't FAT32 formatted, or has failed.
No Video -- an intermittent video connection or signal.
Disk Full -- the recording storage is full.`,
      },
      {
        q: 'Why does the picture pixelate?',
        a: "This is usually caused by the memory card's write speed being too slow to keep up with the incoming video. Because memory card speed is tied to specific byte locations, pixelation tends to reappear at the same point each time -- for example, always around 5 minutes into a clip. Static scenes are less likely to pixelate than full-action video, especially when recording in Variable Bit Rate (VBR) mode; cards with wear-levelling will pixelate at a different spot each time a new file is created.",
      },
      {
        q: 'Why is there no audio, in live view or in playback?',
        a: "If there's no audio in playback, check the audio setting is enabled for that channel. If there's no audio in the live surveillance window at all, check you have a working microphone and powered speaker connected, and that the audio cabling isn't damaged. If live audio is fine but playback has none, check the audio option was ticked while recording and that the correct channel is linked to that camera's video.",
      },
      {
        q: "Why doesn't motion detection work?",
        a: "Check that motion detection is switched on and the detection area is drawn correctly over the zone you want covered, that sensitivity isn't set too low, and that the arming/schedule for motion detection is actually active for the time in question.",
      },
      {
        q: 'Why does the camera image flicker?',
        a: 'Move the camera, or move any strong light source, away from direct line of sight of the lens -- flicker is usually caused by a bright light or reflection interfering with the sensor.',
      },
      {
        q: "The DVR won't boot up, or keeps rebooting -- what should I check?",
        a: `Won't boot at all: check the power supply is correct and firmly connected, that the power lead isn't damaged, that the last firmware update completed successfully, and that the hard disk, its SATA lead, front panel and mainboard aren't damaged.

Boots, then reboots or stops after a few minutes: check the input voltage is stable, the hard disk isn't damaged, the power supply isn't underpowered, the video signal is stable, and that the unit isn't overheating due to poor ventilation.`,
      },
      {
        q: "The DVR can't detect a hard disk -- what should I check?",
        a: "Confirm the hard disk's power cable is connected, check the SATA data cable for damage, and check the SATA port on the mainboard isn't faulty. If all of that looks fine, the disk itself may have failed.",
      },
      {
        q: "There's no video output on one, several or all channels -- what should I check?",
        a: "Update the firmware if it's out of date, restore default image settings (brightness can end up set to 0), confirm there's actually a video signal reaching that input, and check whether channel or screen protection has been enabled. If none of that resolves it, the hardware itself may be faulty.",
      },
      {
        q: 'The image colour or brightness looks wrong -- what should I check?',
        a: "Confirm the BNC output is set to the correct video standard (PAL, not NTSC) -- the wrong setting shows as black and white. Check the DVR's output impedance matches the monitor, that the video cable run isn't too long or lossy, and review the colour/brightness settings on the DVR itself.",
      },
      {
        q: "I can't find recorded footage, or local playback isn't clear -- what should I check?",
        a: "Check the hard disk and its data cable for damage, confirm you haven't updated the DVR with a mismatched firmware/program file, and check whether the footage you're after has already been overwritten or recording was switched off for that period. If the image itself is poor quality, this may reflect the recording quality setting used at the time -- try rebooting the DVR if the issue is inconsistent.",
      },
      {
        q: 'The date/time on the DVR is wrong -- what should I check?',
        a: "Check the date/time and time zone settings, confirm the internal battery isn't flat or making a poor connection, and set up NTP time sync so the unit keeps itself correct automatically.",
      },
      {
        q: "The DVR won't control my PTZ camera -- what should I check?",
        a: "Confirm the PTZ camera itself is working, and that the PTZ decoder's wiring, address and protocol settings on the DVR all match the camera. If several decoders are daisy-chained, the far end of the A/B data line needs a 120 Ω terminating resistor to prevent signal reflection, and check the cable run isn't too long for reliable control.",
      },
      {
        q: "I can't log in via a web browser or the CMS software?",
        a: "Older operating systems (Windows 98/ME) aren't supported -- update to Windows 2000 SP4 or later. Check ActiveX hasn't been blocked, that your graphics driver supports at least DirectX 8.1, that the network connection and settings are correct, and that you're using the right username and password. If using CMS, confirm the software version matches the DVR's firmware version.",
      },
      {
        q: 'My network connection to the DVR keeps dropping, or footage looks poor remotely?',
        a: "Confirm the network itself is stable, and check for IP or MAC address conflicts -- these are common causes of intermittent connections. If remote viewing looks poor even with a stable connection, check whether your PC is under-resourced, whether \"play-in-team\" mode is set in the DVR's network settings, and whether channel or region protection is enabled for that camera.",
      },
      {
        q: "USB backup or CD/DVD burning isn't working?",
        a: "Make sure the backup drive and the internal hard disk aren't sharing the same data cable. If the backup fails partway through, try stopping recording during the backup, reduce how much footage you're backing up in one go, and confirm the backup device itself isn't faulty or incompatible.",
      },
      {
        q: "The alarm output won't trigger, or won't reset?",
        a: "Check the alarm configuration and wiring are correct, and that the input device (sensor) itself isn't damaged. If the alarm output was switched on manually it needs to be switched off the same way. If two alarm inputs are wired into a single loop, separate them onto their own inputs. If none of this resolves it, update the DVR's firmware -- some program versions have known alarm-handling issues.",
      },
      {
        q: 'Recording storage time seems too short?',
        a: "Check the camera lens is clean and the picture quality setting isn't unnecessarily high for what you need, and confirm the hard disk has enough capacity for how long you want to keep footage -- and isn't failing. Reducing frame rate or resolution on lower-priority cameras is an easy way to extend total storage time.",
      },
      {
        q: "Downloaded or backed-up video files won't play?",
        a: "You'll need a media player capable of DirectX 8.1 or higher, plus, for older AVI exports, the DivX and ffdshow codecs installed on the playback PC. If you're not sure which player or codec a particular export needs, contact us and we can point you to the right one for your recorder's software version.",
      },
    ],
  },
  {
    slug: 'starvis',
    title: 'Sony Starvis Explained',
    intro: `There's a need for surveillance cameras to capture clear images in a wide variety of environments. Sony's STARVIS image sensors meet that need by providing high-sensitivity performance suited to night filming.

STARVIS is a back-illuminated pixel technology used in CMOS image sensors for surveillance camera applications. Unlike a front-illuminated sensor, a back-illuminated sensor gathers the image from the back side of the chip, where there's no wiring or circuitry in the way -- so a wider range of light reaches the photodiode, giving much higher sensitivity. Many of the cameras we supply use the very first pixel design developed specifically for surveillance use in this back-illuminated structure.`,
    faqs: [
      {
        q: 'What does STARVIS actually improve?',
        a: "STARVIS sensors are rated at a sensitivity of 2000mV or more per 1µm² (colour product, imaged with a 706 cd/m² light source at F5.6 in a 1 second accumulation equivalent), giving high picture quality in both the visible-light and near-infrared regions. In practice this means clearer colour images in low light and better overall night performance than earlier sensor designs.",
      },
      {
        q: 'What is HDR and why does it matter on a surveillance camera?',
        a: "Many surveillance scenes have bright and dark areas side by side -- a car park entrance against a bright sky, for example. HDR (High Dynamic Range) lets the sensor capture both the light and dark regions of a scene clearly in the same frame, rather than one blowing out or the other dropping into shadow, which meaningfully improves how useful the recorded footage is for identification.",
      },
      {
        q: 'Can we use the STARVIS logo on our own products or marketing?',
        a: "Only with Sony's approval, and only under a signed logo usage agreement. It may be used on packaging, catalogues, posters, informational websites and other promotional material or exhibition signage for products that genuinely incorporate a Sony CMOS sensor with STARVIS technology -- it can't be used on the body of a product or within a software interface. Sony reviews each request individually and doesn't guarantee approval.",
      },
    ],
  },
  {
    slug: 'bitvision',
    title: 'BitVision App Explained',
    intro: `BitVision is an easy-to-use P2P network camera monitoring app for mobile phones, connecting to your device by its unique serial number over the global P2P network. It lets you view real-time video from network cameras installed at home or in the office, plus capture snapshots and video, so you can check in on a location in the shortest time possible.

The BitVision mobile app is available for Android (via Google Play) and iOS (via the App Store) -- search "BitVision" or use the links on our downloads page. A full BitVision App user manual is also available on request.`,
    faqs: [
      {
        q: "Username doesn't exist, or password error / forgot password?",
        a: 'Double-check the username and password -- both are case sensitive. If you\'ve forgotten your password, click "Forget?" on the login screen and follow the prompts to reset it.',
      },
      {
        q: 'Login failed, or login times out?',
        a: 'Make sure your phone has a stable network connection, and try logging in again a few times to rule out a temporary drop in signal.',
      },
      {
        q: '"The device has been bound to XXXXX@XX.com" when adding a device?',
        a: 'A device can only be bound to one account at a time. If you added it under a previous account, either log in with that account and delete it there before adding it to the new one, or go to Login -> Setting -> Unbind Apply, enter the required details and submit -- the platform will review and unbind it.',
      },
      {
        q: "Can't search for recorded video?",
        a: "Confirm the device actually has a recording for that time period -- playback won't work if nothing was recorded. If recording is normal but playback still fails, check the local storage cabling, TF card or hard disk, and confirm the phone and device have matching time zone and daylight saving settings.",
      },
      {
        q: 'Live preview keeps stalling ("caton")?',
        a: 'Switch the device\'s stream type from "HD" to "BD" or "Fluent", check both the device\'s upload bandwidth and your phone\'s download bandwidth, reduce the number of simultaneous previews, and check whether the device is already being viewed by multiple phones or terminals at once.',
      },
      {
        q: 'The device is online but the preview keeps dropping or refreshing?',
        a: "The device's firmware may be out of date -- update to the latest version. This can also be caused by an unstable or slow mobile network; try a stronger network connection.",
      },
      {
        q: "Can't preview or delete a device?",
        a: "Check the device is online in both the local system and the mobile app, confirm it's on the latest firmware, and try a different network type or mobile carrier.",
      },
      {
        q: 'A password prompt pops up during preview?',
        a: "This happens if the account or password used when binding was incorrect, or if the password was changed elsewhere (locally or on the web portal) -- just enter the current, correct account and password when prompted.",
      },
    ],
  },
  {
    slug: 'xmeye',
    title: 'XMeye Cloud Explained',
    intro: `XMEye is a free cloud connection and remote monitoring service for CCTV systems, letting you view your recorder from a PC or mobile device without complex network configuration. It's a P2P (peer-to-peer) communication system -- rather than needing to open ports and manage a changing IP address, each device has a Unique Identity (UID) derived from its MAC address, and the app connects to it directly through that UID.

From the app you can use Live Video to view any device on your list, Remote Playback to pull back recorded footage from the unit's local storage, and Audio Speaking to talk to the site through the recorder's microphone/speaker. This is our legacy platform -- it's compatible with Teravision recorders manufactured prior to 2019; newer Teravision recorders use BitVision instead.

Setup is done through the free XMEye account system at xmeye.net, or the XMEye app for phone/tablet -- register an account, add your recorder using its serial number (found on the unit under Main Menu -> Info -> Version), and once connected it will appear in your device list along with all its camera channels. If you'd rather use a desktop client, our CMS and VMS software downloads are also available.`,
    faqs: [
      {
        q: "I can't log into the DVR from the internet -- what should I check?",
        a: `If you're using the cloud connection: confirm the DVR serial number you've entered is correct, make sure your mobile device actually has data or Wi-Fi connectivity, and check the cloud status on the DVR itself under System -> Netservice -- it should read "Connected". If it doesn't, check the network cable. If you can only access the DVR locally, the cloud service may just be busy -- try again shortly, or close and reopen the mobile app.

If you're using port forwarding instead of the cloud: double-check the IP address and port in the address bar (it should read http://[external IP]:7000), try a different browser, and confirm ports 7000-7001 aren't blocked by any firewall, router port filtering or application exception list. Also check that the router's forwarding rule still points at the DVR's current local IP address, and that any Dynamic DNS hostname you're using hasn't expired.`,
      },
      {
        q: "There's no local network access to the DVR -- what should I check?",
        a: "Make sure the computer and DVR are on the same router, then ping the DVR's local IP address from a command line -- if you get responses, you should be able to log in locally via a web browser. If you get a timeout, reseat or swap the network cable, power-cycle the DVR, and check the link lights on both the router and the DVR's network port. Confirm the DVR has a unique local IP address valid for your router's address range, and double-check you're using the correct IP and port when logging in.",
      },
      {
        q: "Internet Explorer logs in but there's no video?",
        a: 'Check IE\'s ActiveX security settings (set "Prompt" for "Download unsigned ActiveX controls") and refresh the page. Confirm the media port has been forwarded correctly, and add the DVR to IE\'s Local Intranet zone (Internet Options -> Security -> Local Intranet -> Sites -> Advanced). If the page seems to hang, give the ActiveX control a few minutes to load. If IE still won\'t show video, our CMS software is a reliable fallback -- install it, log in with the default credentials, then add the DVR under System -> Device Manager -> Add Area -> Add Device -> IP Search.',
      },
      {
        q: "IE's ActiveX control crashes with NOD32 antivirus installed?",
        a: "Open NOD32's Advanced Setup, expand Web and E-mail -> Protocol Filtering -> Excluded Applications, and make sure both Internet Explorer and the DVR software are ticked as excluded.",
      },
      {
        q: 'The Android app keeps losing its settings?',
        a: "Always exit the app using the phone's hardware Back button rather than swiping it away. If autoplay stops showing all channels, go to Tools and re-select Auto Play.",
      },
      {
        q: 'Mobile access from outside stopped working?',
        a: "Confirm the DVR's external IP address hasn't changed (if you're not using the cloud connection), and confirm local access still works before troubleshooting remote access. Try restarting the mobile device, switching between Wi-Fi and mobile data, or testing from another phone.",
      },
      {
        q: 'A camera is dropping out or giving a poor picture?',
        a: "Confirm the login details for that IP camera are correct, and try logging into the camera directly to rule out the DVR. Check the power adapter matches the camera's required voltage and current rating, and confirm you're using good-quality cable between the DVR and camera. Make sure the switch feeding the DVR can handle the bandwidth of all connected cameras -- a gigabit switch is recommended for multi-channel HD -- and check that every camera has a unique local IP address.",
      },
      {
        q: 'Internet Explorer keeps crashing?',
        a: "Add the DVR to IE's Local Intranet zone (Internet Options -> Security -> Local Intranet -> Sites -> Advanced) and test locally. If it still crashes, use our CMS software instead.",
      },
      {
        q: "Motion detection isn't recording?",
        a: 'Confirm the recording schedule includes "Detect" and is set to "Schedule" (uncheck "Regular" if you don\'t want continuous recording on that camera). Check that the relevant channel is selected and enabled under Alarm -> Motion Detect, and if it\'s an IP camera, that motion detection is also configured in the camera itself. If it\'s still not triggering, try adding the camera as a NETIP camera instead of ONVIF and test again.',
      },
      {
        q: "An IP camera isn't showing up on the DVR?",
        a: "Confirm you can log into the camera directly from a computer on the same network as the DVR, and try power-cycling the camera. Check the network cable is properly seated, and make sure every camera on the network has its own unique local IP address -- assigning a static IP to each camera avoids conflicts.",
      },
    ],
  },
];
