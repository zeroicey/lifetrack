# Lifetrack Web App

This app serves as a frontend interface. Users need to deploy their own server and provide backend details such as the server address and S3 bucket information.

On startup, the app checks local storage for server configuration. If no information is found, users are prompted to enter the required details.

If the backend has not been initialized (i.e., no account or password has been set), the app will guide users through an onboarding process to enter basic information.

## Pages

-   **Index (/):** Introduction to the app.
-   **Guide (/guide):** Step-by-step setup guide for the app.
-   **Login (/login):** User authentication page.
