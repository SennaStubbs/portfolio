# SENNA STUBBS 2025
import random, os, json

# Clear previous command line outputs
os.system("cls")

# Format for AP names
apNamingFormat = "ap-{area}-{number}"

# Model names and the chance of getting them and their OUI
models = {
    "Super AP v1.0": {
        "Chance": 10,
        "OUI": "abcdef"
    },
    "Normal AP v1.6": {
        "Chance": 2,
        "OUI": "bcdefg"
    },
    "AP Lite v1.3": {
        "Chance": 1,
        "OUI": "cdefgh"
    }
}

# Create a list to pick a model out of using their chance to duplicate and append to the list,
# then using the length of this list to pick a random number and choose a model
modelsToChoose = []
for model in models:
    for i in range(models[model]["Chance"]):
        modelsToChoose.append(model)

# The dictionary that will contain all AP info and will eventually be converted into JSON
omada_info = {}

# AP limit will be used to keep the IP range between 192.168.1.2 - ~192.168.255.254
apLimit = 252 * 255 # APs available in an area * Areas available | DO NOT CHANGE - WILL THROW MEMORY ERROR IF TOO MUCH IS GENERATED
totalAps = 0 # To compare to the AP limit and break the loops if it goes over

existingMacs = {} # To prevent duplicate MAC addresses

# Get user input for the number of areas and range of APs in each area as well as how many areas will be "shutdown"
# Function to make checks for valid integer input
def IntInput(prompt, minimum, maximum = -1):
    while True:
        try:
            userInput = int(input("\n{prompt} (MINIMUM = {minimum}{maximum}): "
                .format(
                    prompt = prompt,
                    minimum = minimum,
                    maximum = "" if maximum == -1 else " | MAXIMUM = " + str(maximum) # Will not display if no 'maximum' argument was given
                )))
            # If the inputted integer is less than the minimum or greater than the maximum (if a maximum was given),
            # raise an error, which will execute the 'except' block
            if userInput < minimum or (userInput > maximum and maximum != -1):
                raise
            break
        except:
            print("Invalid input")
    return userInput

areas = IntInput("How many areas are there", 1)
shutdownAreas = IntInput("How many areas will be shutdown", 0, areas) # Will be used to demonstrate an area where all APs are offline
minAPs = IntInput("What is the minimum number of APs in an area", 1)
maxAPs = IntInput("What is the maximum number of APs in an area", minAPs)
onlineChance = IntInput("What is the chance(%) of an AP being online", 0, 100)

# Generating areas with APs
for area in range(areas):
    # AP limit check
    if totalAps > apLimit:
        break
    
    # Determine if the current area will be shutdown
    shutdown = False
    if shutdownAreas > 0:
        # Ensures that the number of areas to shutdown is met
        if random.randint(1, areas - area) <= shutdownAreas:
            shutdownAreas -= 1 # Decrements the remaining number of areas to shutdown
            shutdown = True

    # Create area dictionary
    omada_info["Area " + str(area+1)] = {}
    for ap in range(random.randint(minAPs, maxAPs)):
        # AP limit check
        if totalAps > apLimit:
            break

        # Calculates the IP by the total number of APs made, keeping the third octet between 1-254 (+ 1 to offset
        # it and start from 1) and the fourth octet between 2-254 (+ 2 to offset it and start from 2)
        apIp = "192.168." + str(1 + (totalAps // 253)) + "." + str((totalAps % 253) + 2)

        # Chooses a random model (explained on line 25)
        apModel = modelsToChoose[random.randint(1, len(modelsToChoose)) - 1]

        # Generate a MAC address by using the chosen model's OUI and then randomly generating
        # the NIC with 'hex()', concatenating them and joining a character between each pair
        # to make them appear as a MAC address
        apMac = ""
        # Will be looped if the generated MAC address already exists, with 100 available tries before
        # using the last generated MAC (16,777,216 available MAC addresses per model)
        tries = 100
        while(tries > 0):
            nic = ""
            for i in range(3):
                nic += hex(random.randint(0, 255))[2:].zfill(2) # Formats each octet to be 2 digits (e.g. 0F)
            apMac = '-'.join((models[apModel]["OUI"] + nic)[i:i+2] for i in range(0,12,2)).upper()
            if apMac not in existingMacs:
                break

            tries -= 1
        existingMacs[apMac] = 1
        
        # Formatted AP name
        apName = apNamingFormat.format(area = f"{area+1:02d}", number = f"{(ap+1):02d}")
        
        apStatus = 0 # A single if statement will be used to determine if the AP is online, otherwise default to offline
        # Will not check if area to set to be shutdown
        if not shutdown and random.random() * 100 <= onlineChance:
            apStatus = 1

        # Create the current APs value with its IP as the key
        omada_info["Area " + str(area+1)][apIp] = {
            "mac": apMac,
            "model": apModel,
            "name": apName,
            "status": apStatus
        }
        
        # AP uptime is only added if the status is set to be online
        if apStatus == 1:
            apUptime = "{days}days(s) {hours}h {seconds}s".format(
                days = random.randint(1, 500),
                hours = random.randint(0, 23),
                seconds = random.randint(0, 59)
            )

            omada_info["Area " + str(area+1)][apIp]["uptime"] = apUptime

        totalAps += 1

# Converts dictionary into JSON
jsonObject = json.dumps(omada_info, indent = 4)

# Display estimated file size to let user either cancel or continue creating the JSON file
estBytes = len(jsonObject) * 1.032 # Multiply by the average difference between estimate and actual file size to get a more accurate estimate
units = ["BYTES", "KB", "MB"] # Smallest to biggest unit
# Find which unit to use for file size
biggestUnit = estBytes
unitIndex = 0
for i in range(len(units) - 1):
    if biggestUnit / 1024 >= 1:
        biggestUnit /= 1024
        unitIndex += 1
    else:
        break
# Show bytes regardless of unit used or if its no bigger than 1023 bytes
# 'biggestUnit' variable will be turned into a string to format into the displayed information
if unitIndex != 0:
    biggestUnit = "{bigBytes:,} {unit} ({bytes:,} BYTES)".format(bigBytes = round(biggestUnit, 2), unit = units[unitIndex], bytes = int(estBytes))
else:
    biggestUnit = "{:,} BYTES".format(int(estBytes))

print("\nEstimated file size: " + str(biggestUnit))
input("\nClose program to cancel.\nPress ENTER to continue...")

print("\nCreating JSON file.")
# Get the directory path of this script
dir_path = os.path.dirname(os.path.realpath(__file__))
# Creates a JSON file in this script's directory if it doesn't exist and opens it
file = open(dir_path + "\omada_info.json", "w+")
# Write new JSON into the opened JSON file and closes it
file.write(jsonObject)
file.close()

print("JSON file created!\nDirectory path: " + file.name)
input("\nPress ENTER to close program...")