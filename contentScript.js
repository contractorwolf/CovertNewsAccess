let hideInterval;
const style = 'color: white; font-weight: bold;background-color: blue;';
let currentInterval = 2000;
const shortInterval = 2000;
const longInterval = 25000;


function resetTimer(){
    if (currentInterval == shortInterval) {
        console.log(`%c[contentScript] changing timer to: ${longInterval}`, style);
        currentInterval = longInterval;
        if (hideInterval) clearInterval(hideInterval); hideInterval = null;
        hideInterval = setInterval(hideDivAndUndoOverflow, currentInterval);
    }
}

function hideDivAndUndoOverflow() {
    let shouldReset = false;

    const divElements = document.getElementsByClassName('fc-ab-root');
    const usaTodayElements = document.getElementsByClassName('fEy1Z2XT');
    const modalElements = document.getElementsByTagName("modality-custom-element");
    const asideElements = document.querySelectorAll('aside[aria-label="advertisement"]');

    const tpModalElements = document.getElementsByClassName('tp-modal');
    const tpBackdropElements = document.getElementsByClassName('tp-backdrop');


    const divs = [
        ...usaTodayElements, 
        ...divElements, 
        ...modalElements, 
        ...asideElements,
        ...tpModalElements,
        ...tpBackdropElements
    ];


    divs.forEach(element => {
        element.remove();
        shouldReset = true;
    });
     

    const usaTodayHeader = document.getElementsByClassName("gnt_n");
    if (usaTodayHeader && usaTodayHeader.length > 0 && usaTodayHeader[0]) {
        usaTodayHeader[0].style.top = '0';
        usaTodayHeader[0].style.margin = '0';
        shouldReset = true;
    }

    const body = document.querySelector('body');
    if (body && body.style.overflow === 'hidden') {
        console.log(`%c[contentScript] updoing hidden body overflow`, style);
        body.style.overflow = 'auto';
        shouldReset = true;
    }
  
    const html = document.querySelector('html');
    if (html && html.style.overflow === 'hidden') {
        console.log(`%c[contentScript] updoing hidden body overflow`, style);
        html.style.overflow = 'auto';
        shouldReset = true;
    }

    if (shouldReset) resetTimer();
  }
  
  // Execute the function based on the stored state
  chrome.storage.local.get('isEnabled', (data) => {
    //console.log(`%c[contentScript] Execute the function based on the stored state`, style);
    if (data.isEnabled ?? true) {
        hideInterval = setInterval(hideDivAndUndoOverflow, shortInterval);
    }else{
        if (hideInterval) clearInterval(hideInterval); hideInterval = null;
    }
  });
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //console.log(`%c[contentScript] Listen for messages from the popup`, style);
    if (message.isEnabled) {
        hideInterval = setInterval(hideDivAndUndoOverflow, shortInterval);
    } else {
        if (hideInterval) clearInterval(hideInterval); hideInterval = null;
        location.reload();
    }
  });
  