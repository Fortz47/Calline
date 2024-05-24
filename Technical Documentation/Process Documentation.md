### Cloned the webrtc starter app repo from [webrtc/FirebaseRTC](https://github.com/webrtc/FirebaseRTC).

### initial Project Structure
```
FirebaseRTC/
├── public/
│   └── app.js
│   └── index.html
│   └── main.css
├── database.rules.json
├── firebase.json
├── .firebaserc
└── README.md
```

### Create and set up a Firebase project

In the [Firebase console](https://console.firebase.google.com/), click **Add project**, then name the Firebase project **FirebaseRTC**.

The application uses two Firebase services available on the web:
- Cloud Firestore to save structured data on the Cloud and get instant notification when the data is updated.
- Firebase Hosting to host and serve your static assets.

**Firebase Hosting** has already been configured in the project starter app repo.
For **Cloud Firestore**, the configuration and enabling of the services using the Firebase console is as follows:

### Enable Cloud Firestore
The app uses Cloud Firestore to save the chat messages and receive new chat messages.

You'll need to enable Cloud Firestore:

- In the Firebase console menu's Develop section, click **Database**.
- Click **Create database** in the Cloud Firestore pane.
- **Select the Start** in test mode option, then click Enable after reading the disclaimer about the security rules.

### Install firebase CLI
```sh
npm install firebase-tools
npx firebase --version
```

### Authorize the Firebase CLI by running the following command:
```sh
npx firebase login
```

### Associate your app with your Firebase project by running the following command:
```sh
npx firebase use --add
```
When prompted, select your Project ID, then give your Firebase project an alias ('default' was used as alias).
Follow remaining command line instructions.

### Run the local server
```sh
npx firebase serve --only hosting
```
Open your app at [http://localhost:5000](http://localhost:5000).