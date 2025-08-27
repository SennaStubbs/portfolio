//// Button that behaviours like an anchor tag, with the option to open in a new tab
function ClickLink(event, url, openInNewTab = false)
{
    // Make sure the user is not trying to press a different link
    if (event.target.tagName != "A")
    {
        if (openInNewTab == true)
        {
            window.open(url, '_blank').focus();
        }
        else
        {
            window.location.href = url
        }
    }
}


//// Changing the style of the page
const currentDate = new Date(); // Will be updated on page refresh
var currentPageStyle = localStorage['pageStyle'] || "default"; // Initial value is 'default' if no value is cached
// Check the page is using the right style
// Applies seasonal styles if applicable
function CheckStyle()
{
    // Winter (December-January if 'default' style)
    if (([11, 0].includes(currentDate.getMonth()) && currentPageStyle == "default") || currentPageStyle == "winter")
    {
        currentPageStyle = "winter";

        document.getElementsByTagName("body")[0].classList = "winter";
        document.getElementById("style").value = "winter";
    }
    // Halloween (October if 'default' style)
    else if ((currentDate.getMonth() == 9 && currentPageStyle == "default") || currentPageStyle == "spooky")
    {
        currentPageStyle = "spooky";

        document.getElementsByTagName("body")[0].classList = "spooky";
        document.getElementById("style").value = "spooky";
    }
    // Easter (April if 'default' style)
    else if ((currentDate.getMonth() == 3 && currentPageStyle == "default") || currentPageStyle == "easter")
    {
        currentPageStyle = "easter";

        document.getElementsByTagName("body")[0].classList = "easter";
        document.getElementById("style").value = "easter";
    }
    // Birthday (May 6th if 'default' style)
    else if ((currentDate.getMonth() == 4 && currentDate.getDate() == 6 && currentPageStyle == "default") || currentPageStyle == "birthday")
    {
        currentPageStyle = "birthday";

        document.getElementsByTagName("body")[0].classList = "birthday";
        document.getElementById("style").value = "birthday";
    }
    // Light
    else if (currentPageStyle == "light")
    {
        currentPageStyle = "light";

        document.getElementsByTagName("body")[0].classList = "light";
        document.getElementById("style").value = "light";
    }
    // Dark (default)
    else
    {   
        document.getElementsByTagName('body')[0].classList = '';

        if (currentPageStyle != "default")
        {
            document.getElementById("style").value = "dark";
            currentPageStyle = "dark";
        }
    }
}
CheckStyle();

//// Input listener
document.addEventListener('input', function(event)
{
    // Page style changed
    if (event.target.id == 'style')
    {
        currentPageStyle = event.target.value;

        // Caching selected page style
        localStorage['pageStyle'] = currentPageStyle;

        // Update style with newly assigned values
        CheckStyle()
    }
    else return;
});
