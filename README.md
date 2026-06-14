# Study Helper

Study Helper is a web application designed to help students review course notes more efficiently. Users can paste their course notes into the app and receive a short summary, important key phrases, and simple review questions.

Users can also save their notes and review previous study results later.

## Features

* Generate a short summary from course notes
* Extract important key phrases
* Generate simple review questions for studying
* Save notes and generated results for later review
* View saved notes

## Azure Services & Architecture

### Azure Services

The Study Helper application uses Microsoft Azure to support AI-powered note analysis, cloud storage, and deployment.

* **Azure AI Language**: Used to analyze submitted course notes and extract key phrases.
* **Azure Table Storage**: Used to save notes, summaries, key phrases, review questions, and timestamps.
* **Azure App Service**: Used to host the deployed web application.
* **Azure App Settings**: Used to store environment variables such as service keys and connection strings.

### Application Architecture

1. The user enters course notes into the notes input field.
2. The Next.js frontend sends the entered note to the backend API route.
3. The backend sends the note text to Azure AI Language.
4. Azure AI Language extracts key phrases from the note text.
5. The application creates a short summary and simple review questions.
6. The note, summary, key phrases, review questions, and timestamp are saved in Azure Table Storage.
7. The frontend displays the results to the user.

## Environment Variables

This project uses environment variables for Azure service keys and connection strings.

Examples include:

* Azure Storage connection string
* Azure AI Language key
* Azure AI Language endpoint
* Azure web app URL

Real keys and connection strings should not be committed to GitHub.

## Run Locally

To run the project locally, install the required dependencies and start the development server.

```bash
npm install
npm run dev
```

Then open the local development URL in a browser.

```text
http://localhost:3000
```

## Deployment

The application is intended to be deployed on Azure App Service for the midterm project deliverable.

The deployed application URL should be shared as part of the final submission.

## Known Issues & Limitations

* The application supports pasted text only.
* PDF, Word document, image, and voice input are not supported.
* AI-assisted summaries, key phrases, and review questions should be reviewed by the user.
* The AI output may be incomplete, inaccurate, or may miss important information.
* Internet connection is required because the application uses Azure services.
* Performance may vary depending on the length and clarity of the submitted notes.

## Responsible AI Note

Study Helper is designed as a study support tool. It should not replace the student’s own review or understanding. Users should avoid submitting private information, grades, student IDs, or confidential course content.
