# Project Proposal: Study Helper

## 1. Project Title

**Study Helper: AI Study Assistant for Course Notes**

## 2. Team Members and Responsibilities

- **Nara Park**: Planning, proposal writing, schedule coordination, Responsible AI review, and final submission.
- **Eric Singer**: Repository setup, infrastructure support, tooling, Azure setup automation, and Azure AI Language/Cognitive Services configuration.
- **Taylor O’Brien**: First iteration of the frontend, including the note input form and saved notes page.
- **Luna McCormick**: Documentation support, presentation preparation, video editing, and Azure deployment verification.
- **Rowan Feland**: Backend development and testing to make sure the API routes worked as intended.
- **Zeynep Camgoz**: Final frontend pass, testing, and documentation support.

## 3. Problem Statement

Students often have many lecture notes, readings, and study materials to review before quizzes, exams, or assignments. It can take a long time to identify the most important ideas from long notes. Some students may also struggle to decide what to review first.

Our project solves this problem by creating a simple web application that helps students review course notes more quickly. The user can paste study notes into the application, and the app will generate a short summary, extract key phrases, and create simple review questions.

## 4. Target Users

The target users are college or university students who want help reviewing class notes. The application is especially useful for students who have long notes and want a quick way to identify key points before studying.

## 5. Midterm Project Scope

For the midterm version, the application will allow users to paste course notes, analyze the notes with Azure AI Language, extract key phrases, create a short summary and review questions, save the results in Azure Table Storage, and view saved notes. The application will be deployed to Azure.

We will not include login, PDF upload, or advanced dashboards in the midterm version.

## 6. Azure Services Planned

The project will use the following Azure services:

- **Azure App Service**: Hosts and runs the deployed web application.
- **Azure Table Storage**: Stores submitted notes, summaries, key phrases, review questions, and timestamps.
- **Azure AI Language**: Processes the note text and extracts key phrases.
- **Azure App Settings**: Securely stores environment variables such as API keys and connection strings.

## 7. Technology Stack

- **Frontend**: Next.js
- **Backend**: Next.js API routes
- **Language**: TypeScript
- **AI Service**: Azure AI Language
- **Storage**: Azure Table Storage
- **Hosting**: Azure App Service
- **Version Control**: GitHub

## 8. AI Feature Explanation

The AI feature receives course notes as text input from the user. The text is sent from the web application to the backend API. The backend then calls Azure AI Language to extract key phrases from the note content.

**AI input:**

- User-submitted study notes in text format

**AI output:**

- Key phrases from the notes

The application also uses the extracted key phrases to create a simple summary and review questions. These results help the student understand the main ideas from the notes.

## 9. Data Storage Plan

The application stores study note records in Azure Table Storage. Azure Table Storage was selected because it is lightweight, cloud-based, cost-effective, and suitable for storing structured note data.

Each saved note record will include:

- Original note text
- Short preview of the note
- AI-assisted summary
- Extracted key phrases
- Review questions
- Created date and time

This storage plan allows the application to keep a history of submitted notes. Users can return to the saved notes page and review previous study materials.

No real private student records, grades, or personal information should be entered into the application. The app is designed for sample course notes and general study text only.

## 10. Architecture Flow

The basic architecture flow is:

1. User pastes course notes into the Study Helper web app.
2. The Next.js frontend sends the note text to the backend API route.
3. The backend sends the text to Azure AI Language to extract key phrases.
4. The backend creates a short summary and review questions, then saves the note record in Azure Table Storage.
5. The frontend displays the results and allows the user to view saved notes.

## 11. Risks and Limitations

The main risks are the short development timeline, AI reliability, and integration between frontend, backend, Azure AI Language, Azure Table Storage, and Azure deployment. To reduce these risks, the team will keep the scope small and test each feature before the final demo.

**Limitations:**

- The app supports text input only.
- PDF, image, voice input, login, and personalized accounts are not included.
- AI-assisted summaries and questions may be incomplete or inaccurate, so students should review the original notes.

## 12. Responsible AI Concerns

**Fairness:** The AI feature may work better with clear English notes than with unclear notes, short notes, or notes written in different styles. Some students may receive better results depending on how their notes are written.

**Reliability and Safety:** AI-assisted summaries, key phrases, and questions may contain mistakes or may miss important course information. Students should use the AI output as a study support tool, not as a replacement for reading the original notes.

**Privacy and Security:** The application stores submitted notes in Azure Table Storage. Users should not submit private personal information, grades, student IDs, or confidential course data. API keys and connection strings will be stored using environment variables and Azure App Settings, not in the public GitHub repository.

**Inclusiveness:** The application uses a simple web interface with text input and readable output sections. This makes it easier for different users to understand and use the app.

**Transparency:** The app clearly shows that AI is used to generate study support results. Users can see the original notes, summary, key phrases, and review questions.

**Accountability:** The user is responsible for reviewing the AI output before using it for studying. A human should check the original notes if accuracy is important.

## 13. Future Extension Plan

This project can be extended into an Agentic AI study assistant for the final project. In a future version, an AI agent could guide study sessions, ask follow-up questions, recommend topics to review, and retrieve saved notes.

Possible future features include:

- Personalized study plan
- Interactive quiz mode
- Progress tracking
- Chat-based study assistant
- Optional IoT study environment tracker
