# Nutrition app for students

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

##Prompt given to Vercel V0
You are a frontend developer building a simple, clean web app for school students to learn about nutrition and healthy eating.

The web app should have the following features:

1. *Home Page / Dashboard*  
   - Welcome message with the student’s name  
   - Button to "Log Today's Meal"  
   - Summary of today’s feedback (if any)  
   - Progress bar or badges earned from quizzes

2. *Meal Logging Page*  
   - Text input field: "What did you eat today?"  
   - Submit button  
   - After submission, show loading animation  
   - Display AI-generated feedback (e.g. what’s good, what’s missing, 1 fun tip)  

3. *Nutrition Quiz Page*  
   - Multiple-choice question (1 at a time)  
   - Options styled as colorful buttons  
   - Submit answer, show correct answer & explanation  
   - Score tracker at top  
   - Fun emojis and rewards for correct answers

4. *User Profile Page (Optional)*  
   - Display name, class, and total meals logged  
   - Nutrition badges collected (e.g. "Protein Pro", "Fiber Finder")  

Design notes:
- Keep the UI *fun and kid-friendly* (ages 10–14)  
- Use *bright colors, **emojis*, and large buttons  
- Responsive design for tablet & mobile use  
- Use simple, readable fonts  
- Store and retrieve user data using Supabase backend

You can use dummy data for now, but include Supabase API integration points (e.g. where to fetch user data, log meals, or save quiz results).

Generate the code using HTML/CSS/JS or React (whichever you prefer). Keep the components modular and clear.

