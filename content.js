$(document).ready(function(){alert('For OneClick to work properly, close this tab after finishing downloading your music.\nUse only 1 tab for downloading.\nThank you! :)');})

chrome.runtime.sendMessage({'Action':'showPageAction'});

chrome.runtime.sendMessage({'Action':'AddEventHandler'});

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse)
{

	//Normal opening
	if (!sender.tabs && request.Action!='OpenAgain')
	{
		//downloading the file
		window.open(request.link);
	}

	//this one is used for error tolerence
	else if (!sender.tabs && request.Action=='OpenAgain')
	{
		console.log('An error was corrected. :)');
		window.open(request.link);
	}

	else if (!sender.tabs && request.Action =='Redirect')
	{
		window.location.assign('www.google.com');
	}

});
