
(function () {
    "use strict";
    
    var messageBanner;
    var arr1 = new Array();
    var arr2 = new Array();
    // var arr3 = new Array();
    var coll = [arr1, arr2];
    var arr3 = ['agreement', 'company', 'terms', 'notice', 'customer', 'fees', 'software', 'party', 'written', 'services', 'state', 'conditions', 'law', 'license', 'days', 'gsa', 'rights', 'right', 'parties', 'breach', 'expenses', 'damages', 'applicable', 'time', 'use', 'event', 'liability', 'accordance', 'information', 'licensee', 'subscription', 'date', 'payment', 'entity', 'termination', 'term', 'order', 'ordering', 'taxes', 'contract', 'activity', 'courts', 'legal', 'companys', 'obligations', 'costs', 'section', 'writing', 'consumer', 'service'];

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Initialize the FabricUI notification mechanism and hide it
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();

            // If not using Word 2016, use fallback logic.
            if (!Office.context.requirements.isSetSupported('WordApi', '1.1')) {
                //$("#template-description").text("This sample displays the selected text.");
                //$('#button-text').text("elua-review!");
                //$('#button-desc').text("Display the selected text");
                
                //$('#highlight-button').click(displaySelectedText);
                return;
            }
          
            $('#elua-review').click(Eula);
           // $('#elua-review').click(eluaReviewKeyphrashes);
            $('#elua-review-keyphrases').click(Eulakeyphrashes);
          
            
            //$("#template-description").text("This sample highlights the longest word in the text you have selected in the document.");
            //$('#button-text').text("Review Eula!");
            //$('#button-desc').text("Highlights the longest word.");
            
           // loadSampleData();

            // Add a click event handler for the highlight button.
            //$('#highlight-button').click(hightlightLongestWord);
        });
    };
    function Eula() {
        $("#Progress_bar").show();
        //pbar.style.visibility = "visible";
        setTimeout(function () { eluaReview();}, 2000);  
    }

    function Eulakeyphrashes() {
        $("#Progress_bar").show();
        //pbar.style.visibility = "visible";
        setTimeout(function () { eluaReviewKeyphrashes1(); }, 2000);
    }
    function eluaReview() {
        arr1 = [];
        arr2 = [];
        //coll.push(arr3);
        var searchcol = null;
        var regarry = null;
        var regarry1 = null;
        var range = null;
        var m= null;
        var reg = null;
        var str = null;
        var title = null;
        var k = 0;
        var res;
        var  d=0;
        Word.run(async (context) => {
            var paragraph;
           
            var docBody = context.document.body.paragraphs;
            docBody.load();
            await context.sync();
         
            for (let i = 0; i < docBody.items.length; i++) {
                paragraph = docBody.items[i].getRange('Whole');
                paragraph.load();

                if (paragraph != null) {
                  
                    await context.sync();
                  
                    if (paragraph.text != "\r") {
                        
                        //str = paragraph.text;
                        reg = new RegExp('^(\\d+)[\\.](\\s?\\;?\\s?[A-Z]+)+[\\.]?');
                       regarry1=  paragraph.text.match(reg);
                        if (regarry1 != null) {
                            regarry = regarry1[0].match('([A-Z]+\\s?\\;?\\s?)+');
                            searchcol = paragraph.search(regarry[0], { matchCase: true });
                            searchcol.load();
                            await context.sync();
                            //searchcol.items[0].font.highlightColor = "skyblue";
                            //arr1.push(regarry[0]);
                            searchcol = paragraph.search(regarry1[0], { matchCase: true });
                            searchcol.load();
                            await context.sync();
                            range = searchcol.items[0].getRange(Word.RangeLocation.end).expandTo(paragraph.getRange(Word.RangeLocation.end));
                            range.load();
                            title = regarry[0];
                            await context.sync();
                            if (range.text != null && range.text !="") {
                                arr1.push(regarry[0]);
                                arr2.push(range.text)
                                
                                await callAPI({



                                    text: range.text,



                                }).then((data) => {



                                    console.log(data);
                                    if (data["prediction"] <= 0.770) {
                                        d = 1;
                                        //paragraph.font.highlightColor = "yellow";
                                    }
                                    else {
                                        d = 0;
                                        //alert("in else")
                                    }
                                });
                                d=1
                                if (d == 1) {
                                    paragraph.font.highlightColor = "yellow";
                                } else {
                                    if (d == 0) {
                                        paragraph.font.highlightColor = null;
                                    }

                                } 
                                
                            }
                            
                        }
                        else {
                            if (paragraph.text.length >= 5) {
                                
                                reg = new RegExp('^(((\\d+)([\\.]\\d+)+(\\s+)?[\\-|\\–]?\\s+?)|((\\()?[\\w]\\)(\\s+)?))');
                                regarry = paragraph.text.match(reg);
                                if (regarry != null)
                                {
                                   m= regarry[0].match("((\\d+)([\\.]\\d+)+(\\s+)?[\\-|\\–]?\\s+?)");
                                    if (m!=null&& m[0]== regarry[0])
                                    {
                                        searchcol = paragraph.search(regarry[0], { matchCase: true });
                                        searchcol.load();
                                        await context.sync();
                                        range = searchcol.items[0].getRange(Word.RangeLocation.end).expandTo(paragraph.getRange(Word.RangeLocation.end));
                                        range.load();
                                        await context.sync();
                                        //paragraph.font.highlightColor = "yellow";
                                        if (range.text!="") {
                                            arr1.push(title);

                                            arr2.push(range.text);
                                            
                                           await callAPI({



                                                text: range.text,



                                            }).then((data) => {



                                                console.log(data);
                                                if (data["prediction"] <= 0.770) {
                                                    d=1
                                                    //paragraph.font.highlightColor = "yellow";
                                                }
                                                else {
                                                    d = 0;
                                                    //alert("in else")
                                                }
                                            });
                               
                                            if (d == 1) {
                                                paragraph.font.highlightColor = "yellow";
                                            }
                                            else {
                                                if (d == 0) {
                                                    paragraph.font.highlightColor = null;
                                                }

                                            } 
                                        }
                                        m = null;

                                        m = range.text.match("([A-Z]\\w+(\\s+)?([\\/]|[\\,]|[\\;]|\\w+)?(\\s+)?([A-Z]\\w+)?)+(etc)?[\\.]");
                                        if (m!=null) {
                                            str = m[0];
                                        }
                                      
                                     }
                                    else
                                    {
                                        searchcol = paragraph.search(regarry[0], { matchCase: true });
                                        searchcol.load();
                                        await context.sync();
                                        range = searchcol.items[0].getRange(Word.RangeLocation.end).expandTo(paragraph.getRange(Word.RangeLocation.end));
                                        range.load();
                                        await context.sync();
                                       // paragraph.font.highlightColor = "yellow";
                                        arr1.push(title);
                                        if (str != null) {
                                            arr2.push(str + range.text);
                                            await callAPI({



                                                text: str + range.text,



                                            }).then((data) => {



                                                console.log(data);
                                                if (data["prediction"] <= 0.770) {
                                                    //alert("in if");
                                                    d = 1;
                                                    //paragraph.font.highlightColor = "yellow";
                                                }
                                                else {
                                                    d = 0;
                                                    //alert("in else")
                                                }
                                            });
                                         
                                            if (d == 1) {
                                                paragraph.font.highlightColor = "yellow";
                                            }
                                            else {
                                                if (d == 0) {
                                                    paragraph.font.highlightColor = null;
                                                }

                                            } 
                                        }
                                        else {

                                            arr2.push(range.text);
                                            await callAPI({



                                                text: range.text,



                                            }).then((data) => {



                                                console.log(data);
                                                if (data["prediction"] <= 0.770) {
                                                    d = 1;
                                                    //alert("in if");
                                                    //paragraph.font.highlightColor = "yellow";
                                                }
                                                else {
                                                    d = 0;
                                                    //alert("in else")
                                                }
                                            });
                                            
                                            if (d == 1) {
                                                paragraph.font.highlightColor = "yellow";
                                            }
                                            else {
                                                if (d == 0) {
                                                    paragraph.font.highlightColor = null;
                                                }

                                            } 
                                        }
                                      

                                    }
                                    k = i+1;
                                    for (k; k < docBody.items.length; k++) {
                                        i = k;
                                        paragraph = docBody.items[k].getRange('Whole');
                                        paragraph.load();
                                        await context.sync();
                                       
                                        reg = new RegExp('^(\\d+)[\\.](\\s?\\;?\\s?[A-Z]+)+[\\.]?');
                                        regarry1 = paragraph.text.match(reg);
                                        if (regarry1 != null) {
                                            
                                            break;
                                        }
                                        else {
                                            if (paragraph.text.length >= 5) {
                                                regarry = null;
                                                reg = new RegExp('^(((\\d+)([\\.]\\d+)+(\\s+)?[\\-|\\–]?\\s+?)|((\\()?[\\w]\\)(\\s+)?))');
                                                regarry = paragraph.text.match(reg);
                                                if (regarry != null) {
                                                    
                                                    break;
                                                }
                                                else {
                                                    if (paragraph.text.startsWith("<")) {
                                                        break;
                                                    } else {


                                                        arr1.push(title);
                                                        //paragraph.font.highlightColor = "yellow";
                                                        if (str != null) {
                                                            arr2.push(str + paragraph.text);
                                                           await callAPI({



                                                                text: str + paragraph.text,



                                                            }).then((data) => {



                                                                console.log(data);
                                                                if (data["prediction"] <= 0.770) {
                                                                    d = 1;
                                                                    //alert("in if");
                                                                   // paragraph.font.highlightColor = "yellow";
                                                                }
                                                                else {
                                                                    d = 0;
                                                                    //alert("in else")
                                                                }
                                                            });
                                                            if (d == 1) {
                                                                paragraph.font.highlightColor = "yellow";
                                                            }
                                                            else {
                                                                if (d == 0) {
                                                                    paragraph.font.highlightColor = null;
                                                                }

                                                            } 
                                                        }
                                                        else {
                                                           await callAPI({



                                                                text:  paragraph.text,



                                                            }).then((data) => {



                                                                console.log(data);
                                                                if (data["prediction"] <= 0.770) {
                                                                    d = 1;
                                                                    //alert("in if");
                                                                    //paragraph.font.highlightColor = "yellow";
                                                                }
                                                                else {
                                                                    d = 0;
                                                                    //alert("in else")
                                                                }
                                                            });
                                                            if (d == 1) {
                                                            paragraph.font.highlightColor = "yellow";
                                                            }
                                                            else {
                                                                if (d == 0) {
                                                                    paragraph.font.highlightColor = null;
                                                                }

                                                            } 
                                                            arr2.push(paragraph.text);
                                                        }
                                                       
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (k == i)
                                    {
                                      i= k-1;
                                    }
                                }
                                else
                                {
                                    if (paragraph.text.startsWith("<")) {
                                        break;
                                    }
                                    else {
                                        range = context.document.body.getRange(Word.RangeLocation.start).expandTo(paragraph.getRange(Word.RangeLocation.end));
                                        range.load();
                                        await context.sync();
                                        regarry=  range.text.match('(\\d+)[\\.](\\s?\\;?\\s?[A-Z]+)+[\\.]?');
                                        if (regarry == null)
                                        {
                                            console.log(paragraph.text);
                                        }
                                        else {
                                           // paragraph.font.highlightColor = "yellow";
                                            arr1.push(title);
                                            await callAPI({



                                                text:  paragraph.text,



                                            }).then((data) => {



                                                console.log(data);
                                                if (data["prediction"] <= 0.770) {
                                                    d = 1;
                                                    //alert("in if");
                                                   // paragraph.font.highlightColor = "yellow";
                                                }
                                                else {
                                                    d = 0;
                                                    //alert("in else")
                                                }
                                            });
                                           
                                            if (d == 1) {
                                                paragraph.font.highlightColor = "yellow";
                                            }
                                            else {
                                                if (d == 0) {
                                                    paragraph.font.highlightColor = null;
                                                }

                                            } 
                                            arr2.push(paragraph.text);
                                            
                                        }
                                    }
                                   // arr3.push(paragraph);
                                }
                            }
                        }


                       
                    }
                }
               
            }
            $("#Progress_bar").hide();
        });
       
    }



    function demo() {
        var res;
        for (var i = 0; i < arr2.length; i++) {
            res = callAPI({

                text: arr2[i],

            }).then((data) => {

                console.log(data);

            });
        }
    }
    function eluaReviewKeyphrashes1() {
       //demo();
        Word.run(async (context) => {
            var paragraph;
            var para = null;
            var scol = null;
            var docBody = context.document.getSelection();
            docBody.load();
            await context.sync();
            paragraph = docBody.paragraphs;
            paragraph.load();
            await context.sync();
            para = paragraph.items[0].getRange("Whole");
            context.load(para, "font");
            await context.sync();
            if (para.font.highlightColor != null) {
                if (para.font.highlightColor.toString() == "#FFFF00") {
                    for (var j = 0; j < arr3.length; j++) {
                        scol = null;
                        scol = para.search(arr3[j], { matchWholeWord: true });
                        if (scol != null) { scol.load(); }
                        await context.sync();
                        if (scol != null && scol.items.length != 0) {
                            for (var k = 0; k < scol.items.length; k++) {
                                scol.items[k].font.highlightColor = "Red";

                            }
                        }
                    }
                }
            }
            $("#Progress_bar").hide();
        });
    }
    async function callAPI(data = {}) {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "https://stark-river-30268.herokuapp.com/clause";
        const response = await fetch(proxyurl + url, {
                       
            method: "POST",
                       
            headers: {



                "Content-Type": "application/json",



            },



            body: JSON.stringify(data), // body data type must match "Content-Type" header



        });

        
       
        return response.json(); // parses JSON response into native JavaScript objects




    }


    ////////function eluaReviewKeyphrashes() {
       
    ////////    var body = { "endpoints": { "/clause": { "description": "Given a clause, predicts a classification", "required_params": { "text": "All Content including any and all intellectual property rights in the Content are owned by COMPANY, and Customer shall make no claim of ownership to any content, including subsequent versions or enhancements to Content made at Customer’s request that are implemented by COMPANY or its licensors. This Agreement does not constitute a Copyright license. COMPANY warrants that is the lawful owner or licensee of all Content made accessible to Customer under this Agreement." } } } };
    ////////    var xhttp = new XMLHttpRequest();
    ////////    xhttp.onreadystatechange = function () {
    ////////        if (this.readyState == 4 && this.status == 200) {
    ////////            alert(this.responseText);
    ////////        }
    ////////    };
    ////////    xhttp.open("POST", "https://stark-river-30268.herokuapp.com", true);
    ////////    xhttp.setRequestHeader("Content-type", "application/json");
    ////////    xhttp.send(body);
    ////////}
   

    //$$(Helper function for treating errors, $loc_script_taskpane_home_js_comment34$)$$
    function errorHandler(error) {
        // $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
        showNotification("Error:", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();
