chrome.webNavigation.onCompleted.addListener(
    async () => {
        chrome.windows.create("index.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no")
    },
    { url: [
      { urlMatches: 'https://www.google.com/' },
    ] },
  );