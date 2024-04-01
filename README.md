# Instagram Story Auto-Swiper
## This project automates swiping through Instagram stories on an Android device using WebdriverIO and Appium.

## Functionality
- Detects connected Android devices.
- Launches the Instagram app on the target device.
- Navigates to the second story (skips your own story).
- Performs repeated swiping actions to cycle through stories.
- Terminates the process when no more stories exist.
  
## Prerequisites
- Android Device: An Android device connected to your computer via USB with USB debugging enabled.
- Node.js and npm: Download and install Node.js from the official website (https://nodejs.org/)
- Appium: Install globally using npm install -g appium
- Appium Server: Start the Appium server (instructions at http://appium.io/)

## Setup
- Clone repository: Clone this GitHub repository to your local machine.
- Install dependencies: Navigate to the project directory in your terminal and run npm install.
  
## Running the Script
- Find Device UDID: Connect your Android device to your computer. Run adb devices in your terminal to list connected devices and their unique device IDs (UDIDs). Note the UDID of your target device.
- Update UDID (optional): If you're not using the first listed device, open the index.js file and edit the selectedUDID variable with the UDID of your target device.
- Start Appium server: If it's not already running, start the Appium server.
- Run the script: From your terminal, navigate to the project directory and run node index.js.
  
## How the Code Works
- getConnectedDeviceUDIDs(): Executes the adb devices command, parses the output, and returns an array of UDIDs.
- launchInstagram(): Uses WebdriverIO to launch the Instagram app, specified by its package and main activity names.
- clickSecondStory(): Finds story elements using the provided XPath and clicks the second one.
- performSwipeLoop(): Performs a continuous loop:
- Calculates swipe coordinates based on screen dimensions.
- Executes swipe actions using driver.touchAction().
- Waits for the next story to load; exits the loop if no new story is found.

## Notes
##### - The XPath //*[@resource-id="com.instagram.android:id/avatar_image_view"] targets the story elements. You might need to adjust this if Instagram's interface changes.
##### - This code provides a basic structure for automating Instagram story viewing. You can add further customizations or error handling as needed.
