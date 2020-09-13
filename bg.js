chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {


  if (request.Action == 'showPageAction') 
  {
    showing();
  }

  //---------------------------------------------------------------------------------------



  if (request.Action == 'AddEventHandler') 
  {
    //end of on click
    chrome.pageAction.onClicked.addListener(job); 
  }//end of if-statement

  //-----------------------------------------------------------------------------------


if (request.Action == 'Check')
  {
    
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){


      //these are for the fault tolerence tab
      var url = tabs[0].url;
      var id = tabs[0].id;

      //this is for requesting the song again
      var tempData = JSON.parse(localStorage['tempData']) ;
      
      //checking if the url is incorrect
      if (url.includes('download'))
      {
        //sending a message for requesting the url again
        chrome.tabs.sendMessage(tempData.id,{'Action':'OpenAgain','link':tempData.link});

        //closing the undesirable tab
        chrome.tabs.remove(id);
      }


    });
  }//end of if check
 });//end of on-message
  

//this is where all the magic happens
 function job ()
  {
      var currentURL,currentIndex;

      chrome.tabs.query(
        {currentWindow: true, active: true},
        function(tabArray) {
            if (tabArray && tabArray[0]){

              //these flags are used because the web api return more than one reposone message.. but only one is required
              var successFlag=true,errorFlag=true;

              //getting the current settings, tab id and tab url
                currentURL=tabArray[0].url;
                currentIndex=tabArray[0].id;

                //extracting the v from the url
                var v = currentURL.substring(currentURL.indexOf('=')+1);
                
                //modefying the download url
                _url = 'http://www.youtubeinmp3.com/fetch/?format=JSON&video=http://www.youtube.com/watch?v='+v;

                //getting data
                $.ajax({
                  url: _url,
                  accepts: "application/json",
                  type: "GET",
                  success: function(data) { 
                    if (successFlag==true)
                      {

                        var temp = JSON.parse(data);
                        chrome.tabs.sendMessage(currentIndex,{'link':temp.link});

                        //storing data for fault tolerence
                        var tempData = {'id':currentIndex,'link':temp.link};
                        localStorage['tempData'] = JSON.stringify(tempData);


                        successFlag=false;
                      }
                  },
                  error: function(jqXHR, textStatus, errorThrown)
                    {
                      if (errorFlag==true)
                        {
                          errorFlag=false;
                          alert('Something went wrong.. try again later, please. ;(');
                        } 
                    }
                });//end if ajax call
            }// end if query if
        }//end if function query
     );//full end
  }

  function showing()
  {

    chrome.tabs.query(
        {currentWindow: true, active: true},
        function(tabArray) {
            if (tabArray && tabArray[0])
            {
                chrome.pageAction.show(tabArray[0].id);
                localStorage['youtubeId']=tabArray[0].id;
            }
        }
    );
  }

  chrome.tabs.onRemoved.addListener(function(tabId)
  {
    
    var youtubeId = parseInt(localStorage['youtubeId']);
    if (tabId==youtubeId)
      {
        localStorage.removeItem('youtubeId');
        chrome.runtime.reload();
      }
   }
   );

 /* chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    
    if (localStorage['youtubeId']!=null && changeInfo.url.includes('www.youtube.com'))
    {
      if (parseInt(localStorage['youtubeId'])!=tabId)
      {
          alert('you went to youtube from another tab!');
          alert(tabId+'       '+parseInt(localStorage['youtubeId']));
          
      }
    }

    if (localStorage['youtubeId']!=null && !changeInfo.url.includes('www.youtube.com'))
    {
      if (parseInt(localStorage['youtubeId'])==tabId)
      { 
        alert('you went to google same tab!');
        localStorage.removeItem('youtubeId');
      }
    }


  });*/