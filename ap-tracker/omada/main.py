# SENNA STUBBS 2025
import time, threading, json
import inc_omada as omada

# Omada server details
omada_client_id = "client_id"
omada_client_secret = "client_secret"
omadac_id = "customer_id"
omada_site_id = "site_id"

omada.UpdateToken(omada_client_id, omada_client_secret, omadac_id)

# Update Omada info
def Update():
    # Get updated data
    omada.UpdateToken(omada_client_id, omada_client_secret, omadac_id)
    omada.UpdateAllDevices(omadac_id, omada_site_id)

    tagsJSON = {} # Tags = Areas
    # Go through all Omada devices and create entries only for APs
    for device in omada.allDevices:
        try:
            if "tagName" in device:
                # Create tag entry
                if device["tagName"] not in tagsJSON:
                    tagsJSON[device["tagName"]] = {}

                # Creating AP entry in tag
                if device["type"] == "ap":
                    tagsJSON[device["tagName"]][device["ip"]] = {
                        'mac': device["mac"],
                        'model': device["model"],
                        'name': device["name"],
                        'status': device["status"]
                    }

                    # Uptime only available if device is online
                    if "uptime" in device:
                        tagsJSON[device["tagName"]][device["ip"]]["uptime"] = device['uptime']
        except:
            # Most likely due to the device not holding the information needed to create an AP entry
            print("Could not add a device: ", device)
            continue

    # Sorting devices by name
    for tagName in tagsJSON:
        jsonKeys = list(tagsJSON[tagName].keys())
        jsonKeys.sort(key=lambda a: tagsJSON[tagName][a]["name"].lower())
        tagsJSON[tagName] = {i: tagsJSON[tagName][i] for i in jsonKeys}

    # Sort tags by name
    jsonKeys = list(tagsJSON.keys())
    jsonKeys.sort()
    sortedJson = {i: tagsJSON[i] for i in jsonKeys}

    # Serialise data to JSON format
    jsonObject = json.dumps(sortedJson, indent = 4)

    # Create/update JSON file
    file = open("website/omada_info.json", "w+")
    file.write(jsonObject)
    file.close()

    print("JSON created/updated!")

    # Loops infinitely
    time.sleep(60) # Every minute
    loopThread = threading.Thread(target=Update)
    loopThread.start()
Update()
