import requests
import json
from datetime import datetime
from typing import Optional, List, Dict

class PurdueDiningScraper:
    def __init__(self):
        self.cookies = {
            'api_gac': '390fa50b-675a-42c9-bbda-d5119e8fd886',
            'CookieControl': '{"necessaryCookies":[],"optionalCookies":{"analytics":"accepted"},"statement":{},"consentDate":1725030992628,"consentExpiry":90,"interactedWith":true,"user":"60046416-305B-40C2-BA3D-B6AD57F74F6B"}',
            'BIGipServer~WEB~pool_wpvwebasp03-01-19_api.hfs.purdue.edu_web': '!7OuXuqSMw8Tv/fHstmuMAE7ECixZ9HfMk91sg/bQZkapMwAzIjG6aEpEVcEh3W6C6aFUPkyRRA==',
        }

        self.headers = {
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'DNT': '1',
            'Origin': 'https://dining.purdue.edu',
            'Referer': 'https://dining.purdue.edu/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
            'accept': '/',
            'content-type': 'application/json',
            'sec-ch-ua': '"Not?A_Brand";v="99", "Chromium";v="130"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'sec-gpc': '1',
        }

        # Define dining court schedules
        self.dining_schedules = {
            'Hillenbrand': {
                'Monday': ['Lunch', 'Dinner'],
                'Tuesday': ['Lunch', 'Dinner'],
                'Wednesday': ['Lunch', 'Dinner'],
                'Thursday': ['Lunch', 'Dinner'],
                'Friday': [],  # Closed
                'Saturday': [], # Closed
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
        }

    def is_meal_available(self, dining_court: str, meal_type: str, date: Optional[datetime] = None) -> bool:
        """Check if a meal is available at a dining court on a given day."""
        if date is None:
            date = datetime.now()
        
        day_of_week = date.strftime('%A')
        
        if dining_court not in self.dining_schedules:
            return False
        
        available_meals = self.dining_schedules[dining_court][day_of_week]
        return meal_type in available_meals

    def get_menu(self, dining_court: str, meal_type: str, date: Optional[str] = None) -> Dict:
        """
        Get the menu for a specific dining court and meal type.
        
        Args:
            dining_court: Name of the dining court
            meal_type: Type of meal (Breakfast, Lunch, Dinner, etc.)
            date: Optional date string in YYYY-MM-DD format
        """
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        
        # Check if the meal is available
        if not self.is_meal_available(dining_court, meal_type, datetime.strptime(date, "%Y-%m-%d")):
            return {
                "error": f"{meal_type} is not available at {dining_court} on this day",
                "items": []
            }

        json_data = {
            'operationName': 'getLocationMenu',
            'variables': {
                'name': dining_court,
                'date': date,
            },
            'query': 'query getLocationMenu($name: String!, $date: Date!) {\n  diningCourtByName(name: $name) {\n    address {\n      city\n      state\n      street\n      zip\n      __typename\n    }\n    formalName\n    id\n    bannerUrl\n    logoUrl\n    name\n    latitude\n    longitude\n    googlePlaceId\n    normalHours {\n      id\n      name\n      effectiveDate\n      days {\n        dayOfWeek\n        meals {\n          endTime\n          name\n          startTime\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    dailyMenu(date: $date) {\n      notes\n      meals {\n        endTime\n        startTime\n        notes\n        name\n        status\n        stations {\n          iconUrl\n          id\n          name\n          notes\n          items {\n            specialName\n            item {\n              isFlaggedForCurrentUser\n              isHiddenForCurrentUser\n              isNutritionReady\n              itemId\n              name\n              traits {\n                name\n                svgIcon\n                svgIconWithoutBackground\n                __typename\n              }\n              components {\n                name\n                isFlaggedForCurrentUser\n                isHiddenForCurrentUser\n                isNutritionReady\n                itemId\n                traits {\n                  name\n                  svgIcon\n                  svgIconWithoutBackground\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}',
        }

        try:
            response = requests.post(
                'https://api.hfs.purdue.edu/menus/v3/GraphQL',
                cookies=self.cookies,
                headers=self.headers,
                json=json_data
            )
            response.raise_for_status()
            data = response.json()
            
            # Parse the menu data for the specific meal type
            return self.parse_menu_data(data, meal_type)
        except requests.RequestException as e:
            return {
                "error": f"Failed to fetch menu: {str(e)}",
                "items": []
            }

    def parse_menu_data(self, data: Dict, meal_type: str) -> Dict:
        """Parse the menu data for a specific meal type."""
        dining_court = data.get('data', {}).get('diningCourtByName', {})
        daily_menu = dining_court.get('dailyMenu', {})
        food_items = []

        meals = daily_menu.get('meals', [])
        if isinstance(meals, list):
            for meal in meals:
                # Only process the requested meal type
                if meal.get('name') != meal_type:
                    continue
                    
                stations = meal.get('stations', [])
                if isinstance(stations, list):
                    for station in stations:
                        items = station.get('items', [])
                        if isinstance(items, list):
                            for item_appearance in items:
                                item = item_appearance.get('item', {})
                                if isinstance(item, dict):
                                    item_name = item.get('name', 'Unknown Item')
                                    traits = item.get('traits', [])
                                    if isinstance(traits, list):
                                        trait_names = [trait.get('name', 'Unknown Trait') for trait in traits]
                                        food_items.append({
                                            'name': item_name,
                                            'traits': trait_names
                                        })

        return {
            "error": None if food_items else f"No items found for {meal_type}",
            "items": food_items
        }

# Example usage:
if __name__ == "__main__":
    scraper = PurdueDiningScraper()
    menu = scraper.get_menu("Ford", "Lunch")  # You can change the dining court and meal type
    print(json.dumps(menu, indent=2))
