const axios = require('axios');

class PurdueDiningScraper {
    constructor() {
        this.cookies = {
            'api_gac': '390fa50b-675a-42c9-bbda-d5119e8fd886',
            'CookieControl': '{"necessaryCookies":[],"optionalCookies":{"analytics":"accepted"},"statement":{},"consentDate":1725030992628,"consentExpiry":90,"interactedWith":true,"user":"60046416-305B-40C2-BA3D-B6AD57F74F6B"}',
            'BIGipServer~WEB~pool_wpvwebasp03-01-19_api.hfs.purdue.edu_web': '!7OuXuqSMw8Tv/fHstmuMAE7ECixZ9HfMk91sg/bQZkapMwAzIjG6aEpEVcEh3W6C6aFUPkyRRA=='
        };

        this.headers = {
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'DNT': '1',
            'Origin': 'https://dining.purdue.edu',
            'Referer': 'https://dining.purdue.edu/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
            'accept': '*/*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Not?A_Brand";v="99", "Chromium";v="130"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'sec-gpc': '1'
        };

        this.diningSchedules = {
            'Hillenbrand': {
                'Monday': ['Lunch', 'Dinner'],
                'Tuesday': ['Lunch', 'Dinner'],
                'Wednesday': ['Lunch', 'Dinner'],
                'Thursday': ['Lunch', 'Dinner'],
                'Friday': [],  // Closed
                'Saturday': [], // Closed
                'Sunday': ['Brunch']
            },
            'Earhart': {
                'Monday': ['Breakfast', 'Lunch', 'Dinner'],
                'Tuesday': ['Breakfast', 'Lunch', 'Dinner'],
                'Wednesday': ['Breakfast', 'Lunch', 'Dinner'],
                'Thursday': ['Breakfast', 'Lunch', 'Dinner'],
                'Friday': ['Breakfast', 'Lunch', 'Dinner'],
                'Saturday': ['Lunch', 'Dinner'],
                'Sunday': ['Lunch', 'Dinner']
            },
            'Windsor': {
                'Monday': ['Lunch', 'Late Lunch', 'Dinner'],
                'Tuesday': ['Lunch', 'Late Lunch', 'Dinner'],
                'Wednesday': ['Lunch', 'Late Lunch', 'Dinner'],
                'Thursday': ['Lunch', 'Late Lunch', 'Dinner'],
                'Friday': ['Lunch', 'Late Lunch'],
                'Saturday': ['Late Lunch', 'Dinner'],
                'Sunday': ['Lunch', 'Dinner']
            },
            'Wiley': {
                'Monday': ['Breakfast', 'Lunch', 'Dinner'],
                'Tuesday': ['Breakfast', 'Lunch', 'Dinner'],
                'Wednesday': ['Breakfast', 'Lunch', 'Dinner'],
                'Thursday': ['Breakfast', 'Lunch', 'Dinner'],
                'Friday': ['Breakfast', 'Lunch', 'Dinner'],
                'Saturday': ['Lunch', 'Dinner'],
                'Sunday': ['Dinner']
            },
            'Ford': {
                'Monday': ['Breakfast', 'Lunch', 'Dinner'],
                'Tuesday': ['Breakfast', 'Lunch', 'Dinner'],
                'Wednesday': ['Breakfast', 'Lunch', 'Dinner'],
                'Thursday': ['Breakfast', 'Lunch', 'Dinner'],
                'Friday': ['Breakfast', 'Lunch', 'Dinner'],
                'Saturday': ['Breakfast', 'Lunch'],
                'Sunday': ['Breakfast', 'Lunch', 'Dinner']
            }
        };
    }

    isMealAvailable(diningCourt, mealType, date = new Date()) {
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        if (!this.diningSchedules[diningCourt]) {
            return false;
        }
        
        const availableMeals = this.diningSchedules[diningCourt][dayOfWeek];
        return availableMeals.includes(mealType);
    }

    async getMenu(diningCourt, mealType, date = null) {
        if (!date) {
            date = new Date().toISOString().split('T')[0];
        }
        
        // Check if the meal is available
        if (!this.isMealAvailable(diningCourt, mealType, new Date(date))) {
            return {
                error: `${mealType} is not available at ${diningCourt} on this day`,
                items: []
            };
        }

        const jsonData = {
            operationName: 'getLocationMenu',
            variables: {
                name: diningCourt,
                date: date,
            },
            query: 'query getLocationMenu($name: String!, $date: Date!) {\n  diningCourtByName(name: $name) {\n    address {\n      city\n      state\n      street\n      zip\n      __typename\n    }\n    formalName\n    id\n    bannerUrl\n    logoUrl\n    name\n    latitude\n    longitude\n    googlePlaceId\n    normalHours {\n      id\n      name\n      effectiveDate\n      days {\n        dayOfWeek\n        meals {\n          endTime\n          name\n          startTime\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    dailyMenu(date: $date) {\n      notes\n      meals {\n        endTime\n        startTime\n        notes\n        name\n        status\n        stations {\n          iconUrl\n          id\n          name\n          notes\n          items {\n            specialName\n            item {\n              isFlaggedForCurrentUser\n              isHiddenForCurrentUser\n              isNutritionReady\n              itemId\n              name\n              traits {\n                name\n                svgIcon\n                svgIconWithoutBackground\n                __typename\n              }\n              components {\n                name\n                isFlaggedForCurrentUser\n                isHiddenForCurrentUser\n                isNutritionReady\n                itemId\n                traits {\n                  name\n                  svgIcon\n                  svgIconWithoutBackground\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}'
        };

        try {
            const response = await axios.post(
                'https://api.hfs.purdue.edu/graphql',
                jsonData,
                {
                    headers: {
                        ...this.headers,
                        'Cookie': Object.entries(this.cookies)
                            .map(([key, value]) => `${key}=${value}`)
                            .join('; ')
                    }
                }
            );

            if (!response.data) {
                throw new Error('Empty response from API');
            }

            return this.parseMenuData(response.data, mealType);
        } catch (error) {
            console.error('Error fetching menu:', error.response?.data || error.message);
            return {
                error: 'Failed to fetch menu data',
                details: error.response?.data?.errors?.[0]?.message || error.message,
                items: []
            };
        }
    }

    parseMenuData(data, mealType) {
        const foodItems = [];
        
        if (!data?.data?.diningCourtByName?.dailyMenu?.meals) {
            return {
                error: 'Invalid menu data structure',
                items: []
            };
        }

        for (const meal of data.data.diningCourtByName.dailyMenu.meals) {
            if (meal.name !== mealType) {
                continue;
            }
            
            const stations = meal.stations || [];
            for (const station of stations) {
                const items = station.items || [];
                for (const itemAppearance of items) {
                    const item = itemAppearance.item || {};
                    const itemName = item.name || 'Unknown Item';
                    const traits = item.traits || [];
                    const traitNames = traits.map(trait => trait.name || 'Unknown Trait');
                    
                    foodItems.push({
                        name: itemName,
                        traits: traitNames
                    });
                }
            }
        }

        return {
            error: foodItems.length ? null : `No items found for ${mealType}`,
            items: foodItems
        };
    }
}

module.exports = PurdueDiningScraper;
