// SENNA STUBBS 2025

//// HTML templates
const tagTemplate = `
    <div id="{tag-name}" class="tag {tag-status}">
        <div class="header">
            <div>{tag-name}<span class="counter">({online-devices}/{total-devices})</span></div>
        </div>
        <div class="devices">
            {devices}
        </div>
    </div>
`;

const deviceTemplate = `
    <div id="{device-ip}" class="device {device-status}" onmouseenter="DisplayTooltip(event, this.id, this.parentElement.parentElement.id)" onmousemove="MoveTooltip(event)" onmouseleave="HideTooltip()"></div>
`;

//// Refresh the page when the file updates
let lastModifiedDateParsed
setInterval(function(){ 
    fetch("/ap-tracker/website/omada_info.json")
        .then(r => {
            if (lastModifiedDateParsed != Date.parse(r.headers.get('Last-Modified')))
                window.location.reload();
        })
        .catch((e) => {
            console.error(e);
        });
}, 1000);

//// Loading JSON data
var parsedJSON;

fetch('/ap-tracker/website/omada_info.json')
// Getting modified date of JSON file
.then(r => {
    let lastReportUpdate = r.headers.get('Last-Modified');
    lastModifiedDateParsed = Date.parse(r.headers.get('Last-Modified'))
    let lastModifiedDate = new Date(lastModifiedDateParsed)
    lastReportUpdate = lastModifiedDate.toDateString() + " " + lastModifiedDate.toTimeString().substring(0, 8);
    document.getElementById("last-updated").innerHTML = document.getElementById("last-updated").innerHTML.replace(/{last-updated}/g, lastReportUpdate)
    return r;
})
.then((response) => response.text())
.then((text) => {
    // Parsing read JSON into JavaScript object
    parsedJSON = JSON.parse(text);

    let tagsHTML = "";

    // All devices
    let allInfo = {
        "totalDevices": 0,
        "onlineDevices": 0
    }

    // Tag HTML
    for (const tagName in parsedJSON)
    {
        let tagJSON = parsedJSON[tagName];

        let devicesHTML = "";

        // For counters in main header and tag header
        let tagInfo = {
            "onlineDevices": 0,
            "totalDevices": 0
        };

        // Get all devices to add to tag HTML
        for (const deviceIp in tagJSON)
        {
            let deviceJSON = tagJSON[deviceIp];

            tagInfo.totalDevices += 1;
            let deviceStatus = "offline";
            if (deviceJSON["status"] == 1)
            {
                tagInfo.onlineDevices += 1;
                deviceStatus = "online";
            }

            devicesHTML += deviceTemplate
                .replace(/{device-ip}/g, deviceIp)
                .replace(/{device-status}/g, deviceStatus)
        }

        // Updating 'allInfo'
        allInfo.totalDevices += tagInfo.totalDevices;
        allInfo.onlineDevices += tagInfo.onlineDevices;

        // Tag status
        let tagStatus = "";
        if (tagInfo.onlineDevices == 0) // Every AP is offline
            tagStatus = "offline";

        // Applying tag values
        tagsHTML += tagTemplate
            .replace(/{tag-name}/g, tagName)
            .replace(/{online-devices}/g, tagInfo.onlineDevices)
            .replace(/{total-devices}/g, tagInfo.totalDevices)
            .replace(/{devices}/g, devicesHTML)
            .replace(/{tag-status}/g, tagStatus);
    }
    
    // Add tags
    document.getElementById("tags").innerHTML = tagsHTML;

    // Update counters in header
    document.getElementsByTagName("header")[0].innerHTML = document.getElementsByTagName("header")[0].innerHTML
        .replace(/{total-devices}/g, allInfo.totalDevices)
        .replace(/{online-devices}/g, allInfo.onlineDevices)
        .replace(/{offline-devices}/g, allInfo.totalDevices - allInfo.onlineDevices);
    
    // Making sure inputs and selects remain the same after changes to the header
    document.getElementById("style").value = currentPageStyle;
    document.getElementById("stop-scroll").checked = stopScroll == "true";
});

//// Display tooltip
let tooltipObject = document.getElementById("tooltip");
function DisplayTooltip(event, deviceIp, tagName)
{
    // Fill in details
    document.getElementById("tt-device-name").innerHTML = parsedJSON[tagName][deviceIp]["name"];
    document.getElementById("tt-device-ip").innerHTML = "IP: " + [deviceIp];
    document.getElementById("tt-device-mac").innerHTML = "MAC: " + parsedJSON[tagName][deviceIp]["mac"];
    document.getElementById("tt-device-model").innerHTML = "Model: " + parsedJSON[tagName][deviceIp]["model"];

    // Device status
    if ("uptime" in parsedJSON[tagName][deviceIp]) // Online and has 'uptime' key
    {
        tooltipObject.classList.add("online");
        tooltipObject.classList.remove("offline");

        document.getElementById("tt-device-uptime").innerHTML = "Uptime: " + parsedJSON[tagName][deviceIp]["uptime"];
    }
    else // Has no uptime
    {
        tooltipObject.classList.add("offline");
        tooltipObject.classList.remove("online");
    }

    // Display
    tooltipObject.style.display = "block";

    // Position
    MoveTooltip(event);
}

// Making sure the tooltip doesn't go out of bounds when moving
function MoveTooltip(event)
{
    tooltipObject.style.top = event.clientY + 20 + Math.min(0, (window.innerHeight - (event.clientY + tooltipObject.clientHeight + 20)));
    tooltipObject.style.left = event.clientX + Math.min(0, (window.innerWidth - (event.clientX + tooltipObject.clientWidth)));
}

// Hide tooltip
function HideTooltip()
{
    tooltipObject.style.display = "none";
}

//// Auto scrolling
const defaultScrollWaitTime = 3000; // In milliseconds
let scrollWaitTime = 5000; // Starts at 5000ms to give the user more time to look at the initial data before scrolling normally
let scrollingUp = true; // Direction check - starts at true as it is reversed once initial timer reaches 0
var stopScroll = localStorage['stopScroll'] || "false"; // Initial value is 'false' if no value is cached
setInterval(function()
{
    if (stopScroll == "false") // Auto scroll is active
    {
        let tagsScrollDiv = document.getElementById("tags");
        if (tagsScrollDiv.scrollHeight > tagsScrollDiv.clientHeight)
        {
            if (scrollWaitTime <= 0)
            {
                if (scrollingUp == false && tagsScrollDiv.scrollTop < tagsScrollDiv.scrollHeight - tagsScrollDiv.clientHeight)
                    tagsScrollDiv.scrollBy(0, 1 * ((1920 / window.innerWidth) * (945 / window.innerHeight)));
                else if (scrollingUp == true && tagsScrollDiv.scrollTop > 0)
                    tagsScrollDiv.scrollBy(0, -1 * ((1920 / window.innerWidth) * (945 / window.innerHeight)));
                else
                    scrollWaitTime = defaultScrollWaitTime;
            }
            else
            {
                scrollWaitTime -= 20;
                if (scrollWaitTime <= 0)
                    scrollingUp = !scrollingUp;
            }
        }
    }
    // console.log(((window.innerWidth / 1920) * (window.innerHeight / 945)));
}, 20);

//// Changing the style of the page
const currentDate = new Date(); // Will be updated on page refresh
var currentPageStyle = localStorage['pageStyle'] || "default"; // Initial value is 'default' if no value is cached
// Check the page is using the right style
// Applies seasonal styles if applicable
function CheckStyle()
{
    // Winter (December if 'seasonal' style)
    if ((currentDate.getMonth() == 11 && currentPageStyle == "default") || currentPageStyle == "winter")
    {
        currentPageStyle = "winter";

        document.getElementsByTagName("body")[0].classList = "winter";
        document.getElementById("style").value = "winter";
    }
    // Halloween (October if 'seasonal' style)
    else if ((currentDate.getMonth() == 9 && currentPageStyle == "default") || currentPageStyle == "spooky")
    {
        currentPageStyle = "spooky";

        document.getElementsByTagName("body")[0].classList = "spooky";
        document.getElementById("style").value = "spooky";
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
    // Stop scroll button toggled
    else if (event.target.id == "stop-scroll")
    {
        stopScroll = String(event.target.checked);

        // Caching choice
        localStorage['stopScroll'] = stopScroll;
    }
    else return;
});