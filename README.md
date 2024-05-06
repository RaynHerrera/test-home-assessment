# Contacts Management System

This project is a Contacts Management System built using Next.js, Tailwind CSS, and Firebase. It allows users to manage their contacts by adding, viewing, and updating contact information.

## Tech Stack

- **Next.js**: Next.js is used as the React framework for server-side rendering, routing, and tooling.
- **Tailwind CSS**: Tailwind CSS is used for styling the components with utility-first CSS classes.
- **Firebase**: Firebase is utilized for backend services including Firestore for database management and Firebase Storage for storing contact images.

## Project Structure

The project is structured as follows:

- **`pages/`**: Contains the Next.js pages including the main page (`index.tsx`).
- **`components/`**: Contains reusable React components including:
  - `ContactsList`: Component to display the list of contacts.
  - `AddOrUpdateContact`: Component to add or update contact information.
  - `Modal`: Component for modal implementation.
  - `Spinner`: Component for displaying a loading spinner.
- **`config/firebaseConfig.ts`**: Firebase configuration file to initialize Firebase app and retrieve Firestore and Storage instances.
- **`types/`**: Contains TypeScript type definitions for contacts and modals.

## Running the Project Locally

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/RaynHerrera/test-home-assessment.git
   ```

2. Navigate to the project directory:

   ```bash
   cd test-home-assessment
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a Firebase project and obtain the Firebase configuration details.

5. Update the Firebase configuration in `config/firebaseConfig.ts`.
If you don't have your own firebase, just use default one.

6. Run the development server:

   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000` to view the application.

## Features

- **Add Contact**: Users can add new contacts by providing their name, image, and last contact date.
- **View Contact**: Users can view contact details by clicking on a contact in the list, which opens a modal with contact information.
- **Update Contact**: Users can update existing contact information by clicking the "Update Contact" button in the view modal.
- **Error Handling**: The application includes error handling for form validation and Firebase operations.
- **Performance Optimization**: Performance optimization techniques such as lazy loading and code splitting are implemented by Next.js.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
