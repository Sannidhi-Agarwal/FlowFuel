# FuelFlow - Personalized Meal Recommendations for Purdue Women

FuelFlow is a React-based web application that provides personalized meal recommendations for Purdue women based on their menstrual cycle phase. The app integrates with Purdue dining court data and uses AI to analyze meal photos and provide nutritional insights.

## Features

- User authentication and profile management
- Personalized meal recommendations based on menstrual cycle phase
- Integration with Purdue dining court menus
- AI-powered meal photo analysis
- Support for dietary preferences and restrictions

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will be available at http://localhost:3000

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.js
│   ├── Dashboard/
│   │   └── Dashboard.js
│   ├── MealRecommendation/
│   │   └── MealRecommendation.js
│   └── MealAnalysis/
│       └── MealAnalysis.js
├── App.js
└── index.js
```

## Technologies Used

- React
- Material-UI
- React Router
- Groq AI API (coming soon)
- Purdue Dining API (coming soon)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
