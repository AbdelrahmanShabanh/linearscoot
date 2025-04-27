// No import needed for CDN
const firebaseConfig = {
  apiKey: "AIzaSyBA7gyhzjs9pG2-yIMWaO1hUYrHlWZn5Xk",
  authDomain: "linearscoot.vercel.app",
  projectId: "linear-scooter",
  storageBucket: "linear-scooter.appspot.com",
  messagingSenderId: "628492605890",
  appId: "1:628492605890:web:194aa2b1b353f960479e5b",
  measurementId: "G-GQ44WGR75R",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export { auth };
