# AI Code Reviewer Frontend

This project is a React-based user interface for an AI-powered code reviewer. It allows users to either **upload a code file** or **paste code directly** into a text field, view a detailed analysis of potential issues, and filter the results.

## Setup

To run this project locally, follow these steps:

1.  Navigate into the project directory from the main repository root:
    `cd frontend-app`

2.  Install the necessary dependencies:
    `npm install`

3.  Start the development server:
    `npm run dev`

The application will then be available at `http://localhost:5173`.

## Components

The application is built with a component-based architecture. The primary components are:

-   **Upload**: Provides a side-by-side interface for both file selection and pasting code text. It triggers the analysis request to the backend.
-   **Loading**: A full-page loading indicator with dynamic steps, shown while the analysis is in progress.
-   **Filters**: Provides dropdown menus to filter and sort the analysis results by type, severity, and line number.
-   **Results**: Displays the formatted analysis results, including a dynamic summary, headlines for each category, and a list of all findings.
-   **FindingDetail**: A modal pop-up that shows detailed information for a single issue when clicked.

## API Integration

The frontend communicates with a backend server to perform the code analysis.

-   It sends a `POST` request containing the code file (either uploaded or from pasted text) and analysis type to the `/analyze` endpoint.
-   It is built to handle a JSON object in response, which contains the analysis results broken down by static analysis and AI suggestions.
-   It features robust error handling, including toast notifications and a "Retry" mechanism for failed requests.