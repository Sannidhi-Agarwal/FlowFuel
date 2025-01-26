import os
import sys
import logging
from flask import Flask, request, jsonify
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

try:
    from scrapers.purdue_dining_scraper import PurdueDiningScraper
    logger.info("Successfully imported PurdueDiningScraper")
except Exception as e:
    logger.error(f"Failed to import PurdueDiningScraper: {e}")
    raise

app = Flask(__name__)
scraper = PurdueDiningScraper()

@app.route('/api/menu', methods=['GET'])
def get_menu():
    try:
        dining_court = request.args.get('diningCourt')
        meal_type = request.args.get('mealType')
        date = request.args.get('date')

        logger.info(f"Received request for dining_court={dining_court}, meal_type={meal_type}, date={date}")

        if not dining_court or not meal_type:
            return jsonify({
                'error': 'Both diningCourt and mealType are required'
            }), 400

        menu = scraper.get_menu(dining_court, meal_type, date)
        logger.info(f"Successfully fetched menu: {len(menu.get('items', [])) if menu else 0} items")
        return jsonify(menu)
    except Exception as e:
        logger.error(f"Error in get_menu: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Failed to fetch menu',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Starting Python server on port 5002")
    app.run(port=5002)
