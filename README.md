# TUM Informatics Master ECTS Calculator

This project is a **React-based** web application that helps students of the TUM Informatics Master program manage their ECTS (European Credit Transfer and Accumulation System) credits. It allows users to add modules with associated ECTS and assign them to various domain labels. The application keeps track of the balance of credits per domain and adds overflow into non-major categories like "Wahlmodule ohne Zuordnung zu einem Fachgebiet" (WZ).
If you add all modules in one run and dont delete and readd a few times it works fine. Adding is pretty quick, I would say. 
Deleting modules has a bug I am detailed later. 

If you want to fork this project, claim it as your own and make it better, feel free to do so. Do not ask permission, just do it.

## Features

- **Add Modules**: Users can input module names and their corresponding ECTS credits.
- **Domain Labeling**: Each module can be assigned to one or more domain labels.
- **Balance Management**: The app tracks balances for each domain, with a visual representation of the balance as progress bars.
- **Overflow Handling**: Automatically manages overflow of ECTS credits from core domains to elective categories like WZ.
- **Edit Balances**: Users can edit the initial balance values for each domain using a dialog.
- **Delete Entries**: Users can remove module entries, and the corresponding ECTS values will be adjusted accordingly.

## Technologies

- **React**: Used for building the user interface.
- **Material UI**: For styling components like buttons, checkboxes, dialog boxes, and progress bars.
- **State Management**: Managed using React's `useState` hook.

## How to Run the Application

### Prerequisites

- Make sure you have **Node.js** and **npm** (or **yarn**) installed.

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/ects-calculator.git
    ```

2. Navigate to the project directory:
    ```bash
    cd ects-calculator
    ```

3. Install the necessary dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm start
    ```

5. Open your browser and go to `http://localhost:3000`.

### Editing Initial Balances

- Click on the **"Edit Balances"** button to adjust the initial balances for each domain.

### Adding Modules

1. Enter the module name and ECTS value in the respective fields.
2. Select one or more domain labels where the module belongs.
3. Click **"Add Entry"** to update the domain balances and add the entry to the list.

### Removing Modules and Main bug that is left

- Click the **trash icon** next to a module to remove it from the list. This will also update the domain balances accordingly. Usually this works just fine, but overflow is added to WZ and then deleting that is super buggy. There is a million ways this could be fixed and I might do it someday.

## Application Structure

The main structure of the app is located in the `App.js` file, and the components are structured as follows:

1. **Input Form**: Consists of input fields for the module name and ECTS, along with checkboxes to select the domains.
2. **Module Overview**: Displays a list of added modules with the corresponding domain labels and ECTS values.
3. **Progress Bars**: Visualizes the balance of each domain and the overall progress toward the total ECTS limit.
4. **Dialog Box**: For editing the initial domain balances.

## Customization

- The domain labels, colors, and initial balances are predefined but can easily be customized by modifying the `initialLabelsData` array in the `App.js` file.
- The total ECTS limit can be adjusted by changing the `totalEctsLimit` variable.

## Future Improvements

- **Persistence**: Add local storage or a database to persist data between sessions.
- **Validation**: Add more validation rules to prevent invalid input.
- **User Authentication**: Allow users to save their progress under unique accounts.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Enjoy tracking your TUM Informatics Master's ECTS efficiently!