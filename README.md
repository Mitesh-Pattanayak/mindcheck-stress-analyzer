🧠 MindCheck: Emotional Stress Analyzer
MindCheck is a lightweight, web-based wellness screening application designed to help users quantify their current levels of mental and emotional stress. By utilizing a series of targeted psychological questions, the app calculates a stress percentage and identifies the primary "type" of stress the user is experiencing.
🚀 Quick Start
Since this application is built as a standalone Single-Page Application (SPA), no installation is required.
Download the stress_test.html file.
Open the file in any modern web browser (Chrome, Firefox, Edge, or Safari).
Complete the questionnaire to see your analysis.
✨ Features
Interactive Questionnaire: A smooth, step-by-step user interface with progress tracking.
Dynamic Scoring Engine: Implements clinical-style scoring, including reverse-scoring for positive-phrased questions to ensure accuracy.
Stress Categorization: Not only provides a percentage but categorizes stress into:
🔴 Emotional Burnout
🔵 Cognitive Overload
🟢 Physical Stress Manifestation
Data Visualization: Integrated Chart.js doughnut chart for an immediate visual representation of stress levels.
Responsive Design: Fully responsive UI built with Tailwind CSS, working seamlessly on mobile, tablet, and desktop.
🛠️ Technical Stack
Frontend: HTML5, JavaScript (ES6+)
Styling: Tailwind CSS (via CDN)
Visualization: Chart.js
Typography: Google Fonts (Inter)
📉 How the Logic Works
The application uses a framework inspired by the Perceived Stress Scale (PSS).
Data Collection: Users answer 10 questions on a Likert scale (0 = Never, 4 = Very Often).
Weighted Scoring:
Questions are tagged as Emotional (E), Physical (P), or Mental (M).
Positive questions (e.g., "I felt confident...") are reverse-scored so that a high answer indicates low stress.
Percentage Calculation:
Stress %
=
(
Total User Score
Maximum Possible Score
)
×
100
Stress %=( 
Maximum Possible Score
Total User Score
​
 )×100
Type Determination: The app identifies which of the three categories (E, P, or M) has the highest raw score to determine the primary "Stress Type."
⚠️ Medical Disclaimer
IMPORTANT: MindCheck is a wellness screening tool, not a clinical diagnostic tool.
The results provided by this application are based on self-reported data and are intended for educational and self-awareness purposes only. This application does not provide medical diagnoses and should not be used as a substitute for professional medical advice, diagnosis, or treatment by a licensed mental health professional.
🗺️ Future Roadmap

PDF Report Generation: Allow users to export their results as a PDF to share with a therapist.

Historical Tracking: Integrate Firebase or MongoDB to allow users to track stress trends over weeks or months.

AI Sentiment Analysis: Implement an open-text field analyzed by an LLM to detect nuanced emotional markers.

Resource Directory: Provide localized links to mental health helplines based on the user's stress level.
