# AIread

![Team Photo](https://i.imgur.com/STx4kOF.jpg)

AIread is a web application and learning and note-taking platform that allows users to more effectively and efficiently absorb information from handouts and assigned readings. When a user uploads readings to the platform, they can receive and save summaries and explanations of the texts (with varying complexities). Original texts and their summaries are viewed side by side, helping users break down the structure of the readings and the significance of each section, and users can add to the AI-generated summaries with their own notes and insights, resulting in an interactive AI-facilitated learning environment.

![noah_airead2](https://github.com/dartmouth-cs52-23s/project-airead/assets/20538238/dd4b79cb-4c29-411b-aba8-a1b170df6b8d)


## Architecture

AIread is a Single-Page Application built using React and Vite. It interacts with a node + express backend (https://github.com/dartmouth-cs52-23s/project-airead-api) and uses utilize OpenAI language models in order to perform text summary / analysis and other text-related tasks.

We are using Firebase Storage to store uploaded PDFs and Cloud Firestore to store PDF text, summaries, and user notes. The application also utilizes Firebase Authentication to handle account creation and maintenance.

## Setup

To run the app locally, first retrieve the contents of the `.env` file pinned in the CS52 airead slack channel and paste them into a `.env` file at the root-level directory of the project. Then, run `npm install` and then `npm run dev`

## Deployment

Settings for render.com:
* build command:  `npm install && npm run build`
* publish directory: `dist`

## URL
https://project-airead.onrender.com/

## Authors

* Jason Chen
* Thomas Fenaroli
* Stanley Gao
* Noah Yusen

## Acknowledgments
