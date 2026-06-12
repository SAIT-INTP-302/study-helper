# Issues 8.1-5

# Study Helper

Study Helper is a web application that designed to help students to learn more efficently and quicker. This application uses AI to analyze students course work.

Students can get a summary of their course notes, learn the key phrases, and have access to ai generated review questions. User's also have an access to their saved notes.


## Features

- Genetrate an AI-powered summary using course notes
- Generate review questions for studying
- Extracting important key phrases
- save generated notes for later review


## Azure Services & Architecture

### Azure Services

The Study Helper application used Microsoft Azure to provide AI powered note analysis.

- Azure OpenAI Service - Used for generating summaries, extract key phrases, and create review questions using user's input (course notes)

- Azure App Service - Host the web application (if deployed to Azure)

- Azure AI Interface API - Processes the requests sent from the application to the AI model.

### Application Architecture

1. The user enters a course note into the notes input field.
2. The Next.js frontend sends the entered note to the backend API route.
3. The backend communicates with Azure OpenAI.
4. Azure OpenAI creates a summary, key phrases and review questions
5. The backend returns the AI generated content to the frontend to display.


## Environment Variables

### --- Azure Storage ---
AZURE_STORAGE_CONNECTION_STRING=

### --- Azure AI Language ---
AZURE_LANGUAGE_KEY=

### --- App ---
AZURE_WEBAPP_URL=


## Run Locally

- Go to bash (WSL or Git bash)

- run: az --version (ensure you have installed)

- run: bun --version (azure.sh uses bun), You can use npm as well, just replace references to bun in the script with npm

- cd into /scripts

- run: chmod +x azure.sh

- run: az login 


## You have a few options now

### Local Only Create

- run: ./azure.sh up

### Create with deployed app

- run: ./azure.sh up --hosting

This will give you a live URL to visit

### See Current Setup

- run: ./azure.sh info

This will show you the info about your current setup

### Deploy to Azure

- run: ./azure.sh deploy

This will deploy the app to azure

### Delete/Cleanup

- run: ./azure.sh down
- run: ./azure.sh down --wait (for a more full cleanup)




## Known Issues & Limitations

- Generated AI summary notes should be reviewed by the user and shouldn't be relied on.

- Performnce may be lower based on the amount of text that is being processed.

- Internet connection is required for using this application since it uses Azure OpenAI services.

- This application only suports pasted text and it does not support any other document types such as PDF and Word documents.

- Ai generated summary and key phrases may contain / result with inaccurate information or it may occasionally pass through important information.






