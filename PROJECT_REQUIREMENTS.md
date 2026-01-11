# Project Requirements & Technical Specifications

## 1. Project Overview
**Name**: AI Security Test Case Generator
**Goal**: A full-stack application that accepts user-defined requirements and generates comprehensive security test cases using an LLM.

## 2. Technology Stack

### Frontend
-   **Framework**: [React](https://react.dev/) (v18+)
-   **Build Tool**: [Vite](https://vitejs.dev/) (Fast, modern bundler)
-   **Styling**: [TailwindCSS](https://tailwindcss.com/) (Utility-first CSS) + [Shadcn/UI](https://ui.shadcn.com/) (Accessible components)
-   **State Management**: React Context / Hooks
-   **HTTP Client**: Axios

### Backend
-   **Framework**: [Flask](https://flask.palletsprojects.com/) (Python microframework)
-   **API Design**: RESTful API
-   **CORS Handling**: Flask-CORS
-   **Environment Management**: `python-dotenv`

### Database (Provisional)
-   **Development**: SQLite (Lightweight, file-based)
-   **Production (Optional)**: PostgreSQL

## 3. Proposed LLM Integration
**Model**: **Google Gemini 1.5 Flash**
-   **Reasoning**: High speed, low latency, and sufficient context window for analyzing requirement documents. Excellent for extraction and generation tasks.
-   **Alternative**: OpenAI GPT-4o-mini.
-   **Integration**:
    -   Library: `google-generativeai` (Python SDK)
    -   API Key: Required from Google AI Studio.

## 4. Software & Tools Used in Development
-   **Code Editor**: VS Code
-   **Version Control**: Git
-   **Package Managers**:
    -   `npm` (Node.js)
    -   `pip` (Python)
-   **API Testing**: Postman (or Thunder Client)
-   **Browser**: Chrome / Edge for testing

## 5. Functional Requirements
1.  **Requirement Ingestion**: User can paste text or upload a file (PDF/TXT) containing feature requirements.
2.  **Analysis Pipeline**: System parses the input.
3.  **Test Case Generation**: LLM maps requirements to security risks (OWASP Top 10) and generates verifying test cases.
4.  **Export**: Ability to export test cases as CSV/JSON.
