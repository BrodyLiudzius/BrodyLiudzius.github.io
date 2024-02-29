################################################################################
# This python file is intended to retrieve and parsethe CSULB dining hall menu
# from the school website and parse it into a JSON file that can be distributed
# with the diningHallMenu.js script used by diningHall.html on brodyliudzius.com
#
# Copyright © Brody Liudzius 2023 MIT License
################################################################################

# Copiously commented because I'll probably have to come back to this program
# and debug it once next semester's menus are posted

import requests, string, re, json
from bs4 import BeautifulSoup

# Get the page content as a string
url = "https://www.csulb.edu/49er-shops-at-the-beach/residential-dining-menu-cycles"
pageText: str = BeautifulSoup(requests.get(url).text, "html.parser").text

# Remove the page text after the cycle 5 menus
pageText = pageText[:pageText.find("Allergen Identification")]

# Remove non-printable characters from the string
pageText = ''.join([c for c in pageText if c in string.printable])

# Remove empty lines and whitespace
pageText = "\n".join([l.strip() for l in pageText.splitlines() if l.strip()])

# Split into separate menu cycles
menuCycles = re.split("Cycle \d Menu", pageText)[1:]

# This will hold all the data parsed from the web page text
# It will be indexed as [cycleNumber(0-4)][dayOfWeek(0-6)][mealName(string)][diningHall(string)]
allMenuData = []

# How many nested loops can I write before my CS degree gets revoked?
for iCycle, cycle in enumerate(menuCycles, ):
    # The regex pattern has positive lookaheads in case a food item has the day in its name (i.e. "Taco Tuesday")
    # The actual day name should always be followed by a meal name
    menuDays = re.split("(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(?=\s*Breakfast|\s*Brunch|\s*Saturday|\s*Sunday)", cycle)
    menuDays = [day for day in menuDays if day.strip()]

    for iDay, day in enumerate(menuDays):
        # The regex pattern has positive lookaheads in case a food item has the meal in its name (i.e. "Breakfast burrito")
        # The actual meal name should always be followed by a dining hall name
        meals = re.split("(Breakfast|Lunch|Dinner|Brunch)(?=\s*Beachside|\s*Hillside|\s*Parkside)", day)
        meals = [meal for meal in meals if meal.strip() and meal.find("brunch and dinner is only served") == -1]

        # Splits list into two lists by even and odd indices
        mealNames = meals[::2] # even indices
        mealData = meals[1::2] # odd indices

        for iMeal, meal in enumerate(mealData):
            # second verse, same as the first
            diningHalls = re.split("(Beachside|Hillside|Parkside)", meal)
            diningHalls = [hall for hall in diningHalls if hall.strip()]

            diningHallNames = diningHalls[::2]
            diningHallData = diningHalls[1::2]

            for iHall, hall in enumerate(diningHallData):
                # menu items will be the individual dishes
                menuItems = hall.splitlines()
                menuItems = [item.strip() for item in menuItems if item.strip()]
                diningHallData[iHall] = menuItems
            
            diningHallDict = dict(zip(diningHallNames, diningHallData))
            mealData[iMeal] = diningHallDict
        mealDict = dict(zip(mealNames, mealData))
        menuDays[iDay] = mealDict
    allMenuData.append(menuDays)

# Serialize allMenuData into a JSON file
with open("./assets/data/menu.json", "w") as file:
    json.dump(allMenuData, file, indent = 2)