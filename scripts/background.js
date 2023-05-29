// chrome.tabs.onActivated.addListener(updateBadge);

/** @param {chrome.tabs.Tab} tab  */
async function activate_Ext(tab) {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';

  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === 'ON') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        exec_activate_Ext: true,
      });
    });
  } else if (nextState === 'OFF') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        exec_activate_Ext: false,
      });
    });
  }
}

chrome.action.onClicked.addListener(activate_Ext);

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'activate-ext') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arr_tab) {
      activate_Ext(arr_tab[0]);
    });
  } else {
    console.log(`Command ${command} not found`);
  }
});
