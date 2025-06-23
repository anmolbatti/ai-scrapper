const { BrowserWindow, app } = require('electron');
const path = require('path');
const fs = require('fs');

const initializeBrowser = () => {
  app.whenReady().then(() => {
    console.log('Electron app is ready');
  });
  
  app.on('window-all-closed', () => {
    // Do not quit the app; keep it running in the background.
  });
};

const getBodyContent = async (url) => {
  return new Promise((resolve, reject) => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      show: true,
      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    win.loadURL(url);

    win.webContents.on('did-finish-load', async () => {
      try {
        // Start scrolling
        await win.webContents.executeJavaScript(`
          (function smoothScroll() {
            let scrollStep = window.innerHeight / 2; // Set scroll step size
            let scrollInterval = setInterval(() => {
              if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                clearInterval(scrollInterval); // Stop when bottom is reached
              }
              window.scrollBy(0, scrollStep); // Scroll down
            }, 10); // Adjust delay as needed
          })();
        `);

        // Wait a bit to ensure scrolling is complete
        setTimeout(async () => {
          const bodyContent = await win.webContents.executeJavaScript('document.body.innerHTML');
          
          // fs.writeFile('results.txt', bodyContent, (err) => {
          //   if (err) {
          //     console.error('Error writing file:', err);
          //   } else {
          //     console.log('File created and text inserted successfully!');
          //   }
          // });

          resolve({ success: true, body: bodyContent });
          win.close(); // Close the window after processing
        }, 5000);

      } catch (error) {
        console.error('Error during scrolling or retrieving body content:', error);
        reject(new Error("Failed to fetch body content"));
        win.close();
      }
    });

    win.on('closed', () => {
      reject(new Error("Window closed unexpectedly"));
    });

    win.webContents.on('crashed', () => {
      console.error('Web contents crashed');
      win.close();
      reject(new Error("Web contents crashed"));
    });
  });
};

module.exports = { getBodyContent, initializeBrowser };
