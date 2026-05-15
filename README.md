# MindCheck Pro 🧠

> A dynamic stress analyser built with the **MEAN Stack** — MongoDB, Express, Angular, and Node.js.

![Tech Stack](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat&logo=mongodb&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Angular-17-DD0031?style=flat&logo=angular&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=node.js&logoColor=white)

---

## What is MindCheck Pro?

MindCheck Pro is a wellness screening tool that helps users identify their current stress levels across three dimensions — **Emotional**, **Physical**, and **Mental/Cognitive**. Each session presents 9 randomised questions drawn from a bank of 18, calculates a personalised stress score, and stores results in MongoDB for community-wide benchmarking.

> ⚠️ This is a wellness tool only — not a clinical diagnostic instrument. Results should not replace professional medical advice.

---

## Features

- 🎲 **Randomised sessions** — 3 questions per category drawn randomly from MongoDB each time
- 📊 **Real-time scoring** — all calculation done server-side with reverse-scored question support
- 💾 **Persistent sessions** — every quiz attempt and answer set stored in MongoDB
- 📈 **Community benchmarks** — live aggregate stats (avg stress level, total sessions) shown on results screen
- 🔍 **Category breakdown** — Emotional / Physical / Mental score bars on results page
- ⚡ **Angular 17** — standalone components, signals, computed values, typed models

---

## Tech Stack

| Layer     | Technology              | Purpose                              |
|-----------|-------------------------|--------------------------------------|
| Database  | MongoDB 7 + Mongoose    | Stores questions, sessions, answers  |
| Backend   | Node.js 20 + Express 4  | REST API, scoring logic              |
| Frontend  | Angular 17              | SPA, HTTP calls, chart rendering     |
| Charts    | Chart.js 4              | Animated doughnut stress gauge       |

---

## Project Structure

```
mindcheck-pro/
├── backend/
│   ├── models/
│   │   ├── Question.js       # Question schema (text, category, reverse)
│   │   └── Session.js        # Session schema (answers, scores, result)
│   ├── routes/
│   │   └── api.js            # All REST endpoints
│   ├── server.js             # Express entry point
│   ├── seed.js               # Seeds 18 questions into MongoDB
│   └── .env.example
│
└── frontend/
    └── src/app/
        ├── models/
        │   └── quiz.model.ts         # TypeScript interfaces
        ├── services/
        │   └── quiz.service.ts       # HttpClient API calls
        └── components/quiz/
            ├── quiz.component.ts     # All state logic (signals)
            ├── quiz.component.html   # Template (6 app states)
            └── quiz.component.css    # Component styles
```

---

## API Reference

| Method | Endpoint                       | Description                              |
|--------|--------------------------------|------------------------------------------|
| GET    | `/api/questions/random`        | Returns 9 randomised questions (3/cat)   |
| POST   | `/api/sessions`                | Creates a session, returns `sessionId`   |
| POST   | `/api/sessions/:id/submit`     | Submits answers, returns full result     |
| GET    | `/api/sessions/:id`            | Retrieves a completed session            |
| GET    | `/api/stats`                   | Aggregate stats across all sessions      |

### Submit Answers — Example Request

```json
POST /api/sessions/<sessionId>/submit
{
  "answers": [
    { "questionId": "...", "category": "E", "reverse": false, "rawValue": 3 },
    { "questionId": "...", "category": "P", "reverse": false, "rawValue": 2 },
    { "questionId": "...", "category": "M", "reverse": true,  "rawValue": 1 }
  ]
}
```

### Submit Answers — Example Response

```json
{
  "success": true,
  "result": {
    "scores": { "E": 8, "P": 5, "M": 9 },
    "percentage": 51,
    "primaryCategory": "M",
    "stressType": "Cognitive Overload",
    "stressDescription": "Your mind is overloaded. Try task-batching and mindfulness meditation."
  }
}
```

---

## Stress Classification

| Score Range | Classification  |
|-------------|-----------------|
| 0 – 24%     | Minimal Stress  |
| 25 – 49%    | Mild Stress     |
| 50 – 74%    | Emotional Burnout / Physical Stress / Cognitive Overload |
| 75 – 100%   | Severe Stress   |

---

## Getting Started

### Prerequisites

| Tool        | Version  | Install                         |
|-------------|----------|---------------------------------|
| Node.js     | ≥ 18     | https://nodejs.org              |
| MongoDB     | ≥ 6      | https://www.mongodb.com/try/download/community |
| Angular CLI | ≥ 17     | `npm install -g @angular/cli`   |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

**Backend:**
```bash
cd backend
cp .env.example .env       # edit MONGODB_URI if needed
npm install
npm run seed               # seeds 18 questions (run once)
npm run dev                # starts on http://localhost:5000
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
ng serve                   # starts on http://localhost:4200
```

Open **http://localhost:4200** in your browser.

---

## Environment Variables

Create a `.env` file inside the `backend/` folder (copy from `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/mindcheck
PORT=5000
CLIENT_ORIGIN=http://localhost:4200
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](https://choosealicense.com/licenses/mit/)
