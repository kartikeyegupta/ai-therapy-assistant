# Echo - AI Automation for Therapists
Echo is an AI-powered platform designed to streamline the workflow of therapists by automating note-taking and providing access to patient history through AI-driven conversations.  It reduces administrative workload, allowing therapists to focus more on their clients.

## Features
* **Real-Time Chat:** Enables real-time conversations with an AI assistant to access and understand patient information efficiently.
* **AI-Powered Notes:** Automatically generates comprehensive session notes using advanced AI technology.  Summarizes key insights and therapeutic themes concisely.
* **Time Savings:** Reduces administrative paperwork by hours each week.
* **Patient History Access:** Provides quick access to a patient's history, including summaries of previous sessions, medication information, triggers, and more.
* **Secure Patient Data Handling:**  Uses Supabase for secure and efficient database management of patient information.
* **Calendar Integration:** Displays upcoming appointments and session summaries on a user-friendly calendar.

## Usage
1. **Select Client:** Choose a patient from the list to begin.
2. **Start Recording:** Initiate the session recording. A waveform visualization displays the audio input.  Recordings are stored locally until a summary is generated.
3. **Add Therapist Notes:**  Document additional observations or insights in the provided text area.
4. **Generate Summary:** Once recording is complete, click "Generate Summary".  The system transcribes, analyzes, and summarizes the session, automatically saving the data.
5. **Review Information:** Access the patient's detailed information, including the AI-generated summary and your therapist notes, through the information page.

## Installation
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   ```
2. **Navigate to the project directory:**
   ```bash
   cd <project_directory>
   ```
3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```
4. **Set up environment variables:** Create a `.env` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
   NEXT_PUBLIC_SECRET=<your_openai_api_key>
   ```
5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

## Technologies Used
* **Next.js:**  A React framework for building user interfaces and serverless functions.  Used for the front-end and API routes.
* **React:** A JavaScript library for building user interfaces. Used for the front-end components.
* **Ant Design:** A UI component library for React. Provides pre-built components for forms, layouts, and more.
* **Tailwind CSS:** A utility-first CSS framework. Styles the UI components.
* **OpenAI API:** Used for speech-to-text transcription, text summarization, and real-time chat functionalities.  Specifically utilizes the `gpt-4`, `gpt-4o-realtime-preview-2024-12-17`, and `whisper-1` models.
* **Supabase:** A database service used for storing patient data. Uses PostgreSql under the hood.  Used in conjunction with `@supabase/supabase-js` and `@supabase/auth-helpers-nextjs` libraries.
* **TypeScript:** A superset of JavaScript that adds static typing. Improves code maintainability.
* **Node.js:** The JavaScript runtime environment for the backend. Runs the Next.js API routes.

## API Documentation
The project uses several API routes:

* **/api/get-ephemeral:** (POST) Creates a Realtime session with OpenAI. Requires `patientId` query parameter.  Returns session data including a client secret.
* **/api/one-sentence:** (POST) Condenses a therapy session summary into a single sentence.  Requires a `summary` in the request body.
* **/api/patient-functions:** (POST) Provides functions to retrieve patient data (getPatientSummary, getClientSince, getTranscriptQuotes). Requires `functionName` and `args` in the request body.
* **/api/patients:** (GET) Retrieves a list of patients. Returns an array of `id` and `name` objects.
* **/api/save-transcript:** (POST) Saves a transcript to the Supabase database. Requires transcript data in the request body.
* **/api/summarize:** (POST) Generates a detailed summary of a therapy session transcript. Requires a `transcript` array in the request body.
* **/api/transcribe:** (POST) Transcribes audio files using the OpenAI Whisper API. Requires an audio file (`audio`) in the form data.

## Dependencies
The project dependencies are listed in `package.json`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Testing
No explicit tests are included in the provided codebase.  Further development could include the implementation of unit and integration tests.

*README.md was made with [Etchr](https://etchr.dev)*