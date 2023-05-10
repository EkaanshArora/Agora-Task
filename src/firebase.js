// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB7nnG3tKXomESdgtzOcKOEWBrEymbTb2A',
  authDomain: 'whatsapp-firebase-bcf00.firebaseapp.com',
  projectId: 'whatsapp-firebase-bcf00',
  storageBucket: 'whatsapp-firebase-bcf00.appspot.com',
  messagingSenderId: '315965994792',
  appId: '1:315965994792:web:db19bfe4c117c22cd9021d',
  measurementId: 'G-ERJPCKWXNS',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
