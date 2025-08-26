# SENNA STUBBS 2025
import requests, json, time

# Server access
url = "omada_server_url"
omadaLogin = {
    "username": "username",
    "password": "password"
}



# Token Variables
lastAccessTokenTime = 0
lastRefreshTokenTime = 0
refreshToken = ""

apiHeaders = {}
allDevices = []

# Get token to make the request to get Omada JSON
def UpdateToken(client_id, client_secret, omadac_id):
    global apiHeaders

    global lastAccessTokenTime
    global lastRefreshTokenTime
    global refreshToken

    # If last refresh token was retrieved less than ~14 days ago and last access token was retrieved more than 2 hours ago, need to refresh access token
    # (Source: https://use1-omada-northbound.tplinkcloud.com/doc.html#/home - "2.2.4 Refresh Access Token")
    if int(time.time()) - lastRefreshTokenTime <= 1209000 and refreshToken != "" and int(time.time()) - lastAccessTokenTime > 6600:
        # Obtain Access Token
        r = requests.post(
            url + "/openapi/authorize/token?client_id=" + client_id + "&client_secret=" + client_secret + "&refresh_token=" +
            refreshToken + "&grant_type=refresh_token&code=" + authorization_code,
            json={"client_id":client_id,"client_secret":client_secret},
            verify=False
        )

        apiHeaders = {"Authorization":"AccessToken=" + r.json()["result"]["accessToken"]}
        lastAccessTokenTime = int(time.time())
    # If last refresh token was retrieved over ~14 days ago, need to re-authorise
    # (Source: https://use1-omada-northbound.tplinkcloud.com/doc.html#/home - "2.2.4 Refresh Access Token")
    elif int(time.time()) - lastRefreshTokenTime > 1209000:
        # Login Authentication
        r = requests.post(
            url + "/openapi/authorize/login?client_id=" + client_id + "&omadac_id=" + omadac_id,
            json={"username":omadaLogin["username"],"password":omadaLogin["password"]},
            verify=False
        )
        csrfToken = r.json()["result"]["csrfToken"] # Needed for authorization code
        sessionId = r.json()["result"]["sessionId"] # Needed for authorization code

        # Obtain Authorization Code
        r = requests.post(
            url + "/openapi/authorize/code?client_id=" + client_id + "&omadac_id=" + omadac_id +"&response_type=code",
            headers={"Csrf-Token":csrfToken,"Cookie":"TPOMADA_SESSIONID=" + sessionId},
            verify=False
        )
        authorization_code = r.json()["result"]

        # Obtain Access Token
        r = requests.post(
            url + "/openapi/authorize/token?grant_type=authorization_code&code=" + authorization_code,
            json={"client_id":client_id,"client_secret":client_secret},
            verify=False
        )

        apiHeaders = {'Content-Type': 'application/json', 'Authorization':'AccessToken=' + r.json()["result"]["accessToken"]}

        refreshToken = r.json()["result"]["refreshToken"]

        lastAccessTokenTime = int(time.time())
        lastRefreshTokenTime = lastAccessTokenTime

# Update Global 'allDevices' variable with updated Omada data
def UpdateAllDevices(omadac_id, site_id):
    global allDevices
    allDevices = []

    r = requests.get(
        url + "/openapi/v1/" + omadac_id + "/sites/" + site_id + "/dashboard/overview-diagram?pageSize=1&page=1",
        headers=apiHeaders,
        verify=False
    ).text
    totalDevices = json.loads(r)["result"]["totalApNum"]
    for i in range((totalDevices // 100) + 1):
        print(i)
        r = requests.get(
            url + "/openapi/v1/" + omadac_id + "/sites/" + site_id + "/devices?pageSize=100&page=" + str(i + 1),
            headers=apiHeaders,
            verify=False
        )
        for device in r.json()["result"]["data"]:
            allDevices.append(device)