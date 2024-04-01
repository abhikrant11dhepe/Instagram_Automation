const { remote } = require('webdriverio');
const {ADB} = require('appium-adb');

// Function to fetch connected device UDIDs 
async function getConnectedDeviceUDIDs() {
  const adb = new ADB(); // Create an ADB instance
  const devices = await adb.getConnectedDevices(); 
  return devices.map(device => device.udid); 
}

// Function to launch Instagram
async function launchInstagram(driver) {
  // Checking if the app is already running before starting the activity
  if (!(await driver.isAppInstalled('com.instagram.android'))) {
    console.error('Instagram is not installed on the device!');
    return; 
  }

  await driver.startActivity(
    'com.instagram.android', 
    'com.instagram.mainactivity.InstagramMainActivity'
  );
}

// Click the second story element (the first story is your own profile)
async function clickSecondStory(driver, storyXpath) {
  const storyElements = await driver.$$(storyXpath); 

  if (storyElements.length >= 2) {
    await storyElements[1].click(); 
  } else {
    console.log("Not enough stories to proceed.");
    return;
  }
}

// Function to perform the swipe loop
async function performSwipeLoop(driver, storyXpath) {
  while (true) {
    try {
      const { width, height } = await driver.getWindowSize();
      const startX = width * 0.8;
      const endX = width * 0.2;
      const startY = height / 2;

      for (let i = 0; i < 5; i++) { 
        await driver.touchAction([
          { action: 'press', x: startX, y: startY },
          { action: 'moveTo', x: endX, y: startY },
          'release'
        ]);
        await driver.pause(5000); 
      }

      if (!(await driver.$(storyXpath).waitForExist({ timeout: 5000 }))) {
        console.log('No more stories');
        break; 
      }

    } catch (error) {
      console.error('Error during swiping:', error);
    }
  } 
} 

async function runTest() {
  try {
    const udids = await getConnectedDeviceUDIDs(); 

    if (udids.length === 0) {
      console.error('No Android devices connected.');
      return; 
    }

    const selectedUDID = udids[0];  

    // Configuration for WebdriverIO session
    const capabilities = {
      "platformName": "Android",
      "appium:udid": selectedUDID,
      "appium:appPackage": "com.instagram.android",
      "appium:appActivity": "com.instagram.mainactivity.InstagramMainActivity",
      "appium:automationName": "UiAutomator2",
      "appium:noReset": true,
      "appium:ensureWebviewsHavePages": true,
      "appium:nativeWebScreenshot": true,
      "appium:newCommandTimeout": 3600,
      "appium:connectHardwareKeyboard": true
    };

    // Create WebdriverIO session
    const driver = await remote({
      protocol: "http",
      hostname: "127.0.0.1",
      port: 4723,
      path: '/',
      capabilities
    });

    const storyXpath = '//*[@resource-id="com.instagram.android:id/avatar_image_view"]'; 

    await launchInstagram(driver);
    await clickSecondStory(driver, storyXpath);
    await performSwipeLoop(driver, storyXpath);

  } catch (error) {
    console.error("Error in runTest:", error); 
  } finally {
    // Ensure session termination even if errors occur
    if (driver) {
      await driver.deleteSession(); 
    }
  }
}

runTest().catch(console.error); 





