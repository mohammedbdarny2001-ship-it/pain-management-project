# PainCare Assistant - Assignment 2

PainCare Assistant is a web application for a pain clinic.

This version was developed for Assignment 2 in the Advanced Web Technologies course.

## Main Features

- Patient registration and login
- Doctor login
- Daily pain reports
- Pain level, location, type, duration and notes
- Emergency alerts for high pain levels
- Self-recommendations after pain reports
- Pain trends
- Medication reminders
- Doctor dashboard
- Patient clinical summary
- Doctor notes
- Gemini API chatbot through Express backend
- MongoDB database integration

## Important Note - Gemini API Key

The chatbot is connected to Gemini API through the Express backend.

For security reasons, the real Gemini API key is not included in this GitHub repository.

To run the chatbot, create a file:

server/.env

based on:

server/.env.example

Then replace:

GEMINI_API_KEY=PUT_YOUR_GEMINI_API_KEY_HERE

with your own valid Gemini API key.

If no key is provided, the chatbot still works with safe fallback responses.

## Run Backend

cd server
npm install
npm run dev

Backend runs on:

http://localhost:5000

## Run Frontend

cd paincare-assistant
npm install
npm run dev

Frontend usually runs on:

http://localhost:5173

## Database

The project uses MongoDB with the following collections:

- users
- painreports
- doctornotes
- medications
