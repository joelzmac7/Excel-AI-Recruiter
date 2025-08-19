/* *****************************************************************************
 ****Use the following editor to insert scripts into the browser****
 1. You can use island.sdk .to access different libraries.
 for example island.sdk.$ is similar to using Cash JS library
 2. Context can be referenced to get specific details about the
    current browsing session. For example: alert(context.userinfo.email)
    will show an alert with the logged in user's email.
    *context.url
    *context.tabId
    *context.userInfo.userId
    *context.userInfo.tenantId
    *context.userInfo.picture
    *context.userInfo.name
    *context.userInfo.email
    *context.deviceInfo.osUsername
    *context.deviceInfo.osVersion
 3. You can send custom audit events by adding island.auditAsync('name_of_event') to the code
4. You can show customized user notification by adding the following in the code:
rpa.sdk.notify({
  type: 'Warning', // 'Warning' | 'Info' - will set the notification icon
  action: 'Some Action', // free text
  verdict: 'Warned', // 'Blocked' | 'Warned' | 'Monitored' - will be shown as the verdict in the notification
  tooltip: 'Some tooltip message',
  link: 'https://some.link', // optional
  closeNotificationAfterMS: 2000, // optional
})
5. You can create a step-up MFA challenge for the user, using the following code:
rpa.sdk.mfa()
The mfa function can also get an optional parameter of type MfaOptions, which can be used to configure the MFA challenge.
For example:
rpa.sdk.mfa({forceMfaEverytime: true}) - to enforce the MFA challenge every time the RPA profile is triggered. The default grace period is 1 hour.
 **********************************************************************
*/

/* ************ Recruiter Social Post Generator RPA ******************
  Description: This script runs on popular job board websites, adds a button to job posting pages,
  takes a screenshot, and allows a recruiter to instantly generate social media content.

  Configuration:
  run on host: linkedin.com, indeed.com, ziprecruiter.com
  urlType: Host
  executionFrame: TopFrame
*/

(function() {
    'use strict';

    // --- 1. Configuration ---
    const APP_URL = '/'; // Using relative path for this environment. Replace if app is hosted elsewhere.

    const LAUNCHER_ID = 'recruiter-ai-launcher-btn';
    const IFRAME_WRAPPER_ID = 'recruiter-ai-iframe-wrapper';
    const hasRpa = typeof rpa !== 'undefined' && rpa.sdk && rpa.sdk.auditAsync;

    function isAppRunning() {
        return !!document.getElementById(IFRAME_WRAPPER_ID);
    }
    
    function closeApp() {
        const iframeWrapper = document.getElementById(IFRAME_WRAPPER_ID);
        if (iframeWrapper) {
            document.body.removeChild(iframeWrapper);
        }
        window.removeEventListener('message', handleAppMessages);
        const launcher = document.getElementById(LAUNCHER_ID);
        if (launcher) launcher.style.display = 'inline-flex';
    }
    
    function handleAppMessages(event) {
        if (event.data && event.data.type === 'CLOSE_RECRUITER_APP') {
            closeApp();
        }
    }

    // This function simulates the action of taking a screenshot via the Island SDK.
    // In a real environment, `rpa.sdk.takeScreenshot` would be a function provided by Island Browser.
    async function takeScreenshotOfPage() {
        if (hasRpa && typeof rpa.sdk.takeScreenshot === 'function') {
            try {
                // This is a hypothetical function call. The actual API may differ.
                // It's expected to return a base64 encoded string of the page screenshot.
                const base64Image = await rpa.sdk.takeScreenshot({ format: 'png', quality: 90 });
                rpa.sdk.auditAsync('Screenshot_Success');
                return base64Image;
            } catch (e) {
                rpa.sdk.auditAsync('Screenshot_Failed');
                console.error("RPA Screenshot failed:", e);
                alert("Could not take a screenshot. Please ensure permissions are granted or contact your administrator.");
                return null;
            }
        } else {
            console.warn("rpa.sdk.takeScreenshot not found. This feature requires the Island Browser RPA environment.");
            alert("Screenshot functionality is not available. This tool must be run within the Island Browser with the correct permissions.");
            return null;
        }
    }


    // --- 2. UI Injection ---
    function injectLauncherButton() {
        if (document.getElementById(LAUNCHER_ID) || isAppRunning()) return;

        const button = document.createElement('button');
        button.id = LAUNCHER_ID;
        button.innerHTML = `
            <svg style="width: 20px; height: 20px; margin-right: 8px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4,4H6V6H4V4M20,11V8L18,6L20,4V3H4V4L6,6L4,8V11H6.2L6.5,12H7.7L8,11H16L16.3,12H17.5L17.8,11H20M8,9H6V7H8V9M18,9H16V7H18V9M4,20H20V14H4V20M6,15H18V18H6V15Z" /></svg>
            Generate Social Posts
        `;
        button.setAttribute('style', `
            position: fixed; bottom: 20px; right: 20px; z-index: 2147483646;
            background-color: #1d4ed8; color: white; border: none; border-radius: 8px;
            padding: 10px 18px; font-size: 16px; font-weight: 600; cursor: pointer;
            box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.25); transition: all 0.2s ease;
            display: inline-flex; align-items: center; justify-content: center;
        `);

        button.onmouseover = () => button.style.backgroundColor = '#1e40af';
        button.onmouseout = () => button.style.backgroundColor = '#1d4ed8';

        button.addEventListener('click', launchApp);
        document.body.appendChild(button);
    }

    // --- 3. Data Extraction & App Launch ---
    async function launchApp() {
        // --- Take Screenshot ---
        // Note: The script will stop if screenshot fails. The user is alerted in takeScreenshotOfPage.
        const screenshotBase64 = await takeScreenshotOfPage();
        if (!screenshotBase64) return;
        
        // --- Recruiter Info Extraction ---
        let recruiterInfo = { name: '', email: '', phone: '' };
        if (typeof context !== 'undefined' && context.userInfo) {
            recruiterInfo.name = context.userInfo.name || '';
            recruiterInfo.email = context.userInfo.email || '';
            if (hasRpa) rpa.sdk.auditAsync('Autofill_Recruiter_Info_Success');
        } else if (hasRpa) {
            rpa.sdk.auditAsync('Autofill_Recruiter_Info_Failed_No_Context');
        }

        // --- Iframe Creation ---
        const iframeWrapper = document.createElement('div');
        iframeWrapper.id = IFRAME_WRAPPER_ID;
        iframeWrapper.setAttribute('style', `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(23, 37, 84, 0.6); backdrop-filter: blur(8px);
            z-index: 2147483647; display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s ease;
        `);
        iframeWrapper.addEventListener('click', (e) => {
            if (e.target === iframeWrapper) closeApp();
        });

        const iframe = document.createElement('iframe');
        iframe.src = APP_URL;
        iframe.setAttribute('style', `
            width: 95%; height: 95%; max-width: 1400px; max-height: 90vh;
            border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: scale(0.95); transition: transform 0.3s ease;
        `);
        
        iframeWrapper.appendChild(iframe);
        document.body.appendChild(iframeWrapper);
        
        setTimeout(() => {
            iframeWrapper.style.opacity = '1';
            iframe.style.transform = 'scale(1)';
        }, 10);

        // --- Post Message to App ---
        iframe.onload = () => {
            iframe.contentWindow.postMessage({
                type: 'INIT_RECRUITER_APP',
                payload: { 
                    screenshotBase64,
                    recruiterInfo
                }
            }, '*');
        };
        
        window.addEventListener('message', handleAppMessages);
        
        const launcher = document.getElementById(LAUNCHER_ID);
        if(launcher) launcher.style.display = 'none';
        
        if (hasRpa) rpa.sdk.auditAsync('Recruiter_App_Launched');
    }
    
    // Using an interval to ensure the button is injected even on single-page-app navigation changes.
    setInterval(injectLauncherButton, 1500);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        injectLauncherButton();
    } else {
        window.addEventListener('load', injectLauncherButton);
    }

})();

/* *********************************************************************
...other examples from template could follow here...
********************************************************************* */
