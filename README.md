# Name: O M T D Bandara
# Reg No: 2022/ICT/56

# 🌱 EcoSort LK

### Offline Waste Sorting & Recycling Guide

**EcoSort LK** is an offline-first mobile application built using **React Native** and **Expo** for the *ICA 03 – Individual React Native Project*. It helps users learn how to separate common household waste, prepare materials for recycling, dispose of items more responsibly, and discover practical reuse ideas.

The application stores its learning content in a **local SQLite database**. Users can browse materials, search and filter results, read details, save favorites, and take a short recycling quiz without calling public APIs or online databases.

> **Important:** Recycling rules and collection services vary by area. EcoSort LK provides general educational guidance, not verified local collection locations or official disposal instructions.

## Features

- **Home dashboard** – Overview of the guide and quick access to the main sections.
- **Waste categories** – Explore Plastic, Paper, Glass, Metal, Organic, E-Waste, Hazardous and Textiles.
- **Waste Explorer** – Search waste materials by name or disposal guidance, filter by category, and optionally show favorites only.
- **Waste details** – Read disposal methods, preparation instructions, safety warnings and reuse suggestions.
- **Favorites** – Save or remove frequently referenced materials; favorites are stored locally.
- **Reuse ideas** – Browse ways to reuse materials before throwing them away.
- **Eco Quiz** – Answer multiple-choice questions based on recycling knowledge.
- **Quiz results** – View the final score and retry the quiz.

## Application screens

| # | Screen | Purpose |
|---|---|---|
| 1 | Home | Introduction and main navigation |
| 2 | Categories | Browse eight waste categories |
| 3 | Waste Explorer | Search, filter and view materials |
| 4 | Waste Details | Read details and manage favorites |
| 5 | Reuse Ideas | Discover reuse suggestions |
| 6 | Eco Quiz | Answer quiz questions |
| 7 | Quiz Results | View results and restart the quiz |
| 8 | About | Read the app's purpose and limitations |

## Technologies used

- **React Native** – Mobile interface
- **Expo** – React Native development environment
- **JavaScript** – Application logic
- **React Navigation (Native Stack)** – Navigation between screens
- **Expo SQLite** – Local database and persistent favorites
- **Git and GitHub** – Source control

## Getting started

### Requirements

- Node.js and npm
- Git (recommended)
- Visual Studio Code or another editor
- Android device with a compatible version of Expo Go, or an Android emulator

### Installation

1. Clone the repository and open the project folder:

   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd EcoSortLK
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Start Expo:

   ```bash
   npx expo start
   ```

4. Open the project in **Expo Go** by scanning the QR code, or run it using an Android emulator.

If you experience an SDK or package compatibility error, check the installed packages:

```bash
npx expo install --check
```

To resolve reported compatible-version differences, use:

```bash
npx expo install --fix
```

If the Metro bundler appears to load an outdated version of the application, restart it with:

```bash
npx expo start --clear
```

**Development note:** Expo Go usually needs a connection to the Metro development server to load the project. This is different from the application's data features, which do not require an online API. To verify that the app can launch fully offline, test a standalone Android build with internet connectivity disabled.

## Project structure

```text
EcoSortLK/
├── assets/                # Expo assets
├── src/
│   ├── data.js            # Waste categories, initial materials and quiz questions
│   └── database.js        # SQLite schema and initialization
├── App.js                 # Screens, navigation and user interface
├── app.json               # Expo configuration
├── index.js               # Application entry point
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## Local database and dataset

On application initialization, Expo SQLite creates a database called **`ecosortlk.db`** on the device.

| Table | Purpose |
|---|---|
| `waste_items` | Stores waste names, categories, disposal instructions, preparation tips, warnings, reuse ideas and a favorite flag |
| `quiz_questions` | Stores quiz questions, four answer options and the correct answer index |

The provided starter dataset contains **20 waste materials across eight categories** and **five quiz questions**. The application loads these records from SQLite and retrieves them dynamically for the screens. The `favorite` value is updated in the database when users save or remove an item.

Initial records are defined in `src/data.js` and inserted during database initialization through `src/database.js`. Existing records are preserved by the current `INSERT OR IGNORE` setup, so changing a record's text in `data.js` does **not** automatically update that record in an already populated database.

**For individual assignment submission:** Review and verify the starter descriptions, personalize the dataset with your own researched entries, and be prepared to explain the records and implementation. The project brief requires each student to create their own dataset.

## Offline functionality

The app's waste guide, search and filtering, details, favorites and quiz operate on local data. The application does **not** use a public API or an online database for these features.

To validate offline behavior in an installed build:

1. Open the app and confirm the data has been initialized.
2. Turn on Airplane Mode.
3. Reopen the installed application.
4. Navigate between screens, search materials and open waste details.
5. Save a favorite, restart the app and check whether it remains saved.
6. Complete the quiz and view the result.

## Testing checklist

- [ ] Home dashboard displays the number of stored waste items.
- [ ] All eight screens open correctly.
- [ ] Categories link to the matching filtered materials.
- [ ] Search returns relevant materials.
- [ ] Category and favorites filters work.
- [ ] Details display the correct locally stored record.
- [ ] Favorites persist when the application is restarted.
- [ ] Reuse Ideas displays waste-material suggestions.
- [ ] Eco Quiz shows questions and calculates the final score.
- [ ] Installed app works without internet access.

## GitHub workflow

Commit and push after completing and testing meaningful improvements:

```bash
git status
git add .
git commit -m "Describe the completed feature"
git push origin main
```

## Project information

- **Project:** EcoSort LK – Offline Waste Sorting & Recycling Guide
- **Assignment:** ICA 03 – Individual React Native Project
- **Institution:** University of Vavuniya
- **Developer:** *Add your full name*
- **Registration Number:** *Add your registration number*

## Disclaimer

This is an educational application. Users should follow their municipality's instructions and use approved recycling or hazardous-waste services when applicable. Never burn plastics or dispose of batteries, electronics or hazardous materials irresponsibly.
