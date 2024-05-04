chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        if (tab.url && tab.url.includes("americanexpress.com/us/credit-cards/card-application/apply/prospect/terms")) {
            console.log(tab.url);
            chrome.tabs.sendMessage(activeInfo.tabId, {
                type: "NEW",
                cardURL: tab.url
            });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes("americanexpress.com/us/credit-cards/card-application/apply/prospect/terms")) {
        console.log(changeInfo.url);
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            cardURL: changeInfo.url
        });
    }
});


//https://www.americanexpress.com/us/credit-cards/card-application/apply/prospect/terms/platinum-card/91125-10-0/?pznOfferCode=100XM-8DK5QC-4W3R-IWA#offer-terms