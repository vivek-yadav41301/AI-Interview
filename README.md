# AI Interview Preparation Platform

An AI-powered full-stack interview preparation platform that helps candidates practice **Technical and HR interviews** using personalized questions generated from their uploaded resumes.

## Features

* **Resume-Based Interview Generation** — Upload a resume and generate personalized interview questions using AI.
* **Technical Interview Round** — Practice technical questions based on the candidate's profile and skills.
* **HR Interview Round** — Practice common and personalized HR interview questions.
* **AI-Powered Feedback** — Get AI-generated feedback to understand interview performance and areas for improvement.
* **Credit-Based System** — Users consume credits to access interview preparation features.
* **Razorpay Integration** — Purchase additional credits through Razorpay.
* **Google Authentication** — Secure login using Firebase Google Authentication.
* **User Data Management** — Store user profiles, interview data, credits, and payment records using MongoDB.
* **Interactive UI** — Responsive React interface with smooth animations using Framer Motion.

## Tech Stack

### Frontend

* React.js
* Redux
* Tailwind CSS
* Framer Motion
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT

### AI & Services

* Google Gemini API
* Firebase Authentication
* Razorpay

## Application Flow

1. User signs in using Google Authentication.
2. User uploads their resume.
3. The platform processes the resume and generates personalized interview questions using Gemini AI.
4. User selects a Technical or HR interview round.
5. User practices the generated questions and receives AI-powered feedback.
6. Users can purchase additional credits through Razorpay when required.

## Project Structure

```text
AI-Interview/
├── Client/
│   ├── src/
│   └── ...
│
├── Server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
│
└── README.md
```

## Key Highlights

* Full-stack MERN architecture
* AI integration using Google Gemini API
* Resume-based personalized interview generation
* Technical and HR interview workflows
* Credit-based SaaS access model
* Razorpay payment integration
* Firebase Google Authentication
* MongoDB-based persistent data storage

## Deployment

The application is deployed with separate frontend and backend services, providing a production-ready full-stack setup.

## Future Improvements

* Interview performance analytics
* More specialized interview categories
* Question difficulty levels
* Detailed candidate performance reports
* Additional authentication providers
