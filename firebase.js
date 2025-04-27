const firebaseConfig = {
  apiKey: "AIzaSyBA7gyhzjs9pG2-yIMWaO1hUYrHlWZn5Xk",
  authDomain: "localhost",
  projectId: "linear-scooter",
  storageBucket: "linear-scooter.appspot.com",
  messagingSenderId: "628492605890",
  appId: "1:628492605890:web:194aa2b1b353f960479e5b",
  measurementId: "G-GQ44WGR75R",
};

firebase.initializeApp(firebaseConfig);

const sendOTP = async (phoneNumber) => {
  try {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      firebase.auth()
    );

    const confirmationResult = await firebase
      .auth()
      .signInWithPhoneNumber(
        firebase.auth(),
        phoneNumber,
        window.recaptchaVerifier
      );
    window.confirmationResult = confirmationResult;
    alert("OTP Sent!");
  } catch (error) {
    console.error("Error sending OTP:", error.message);
  }
};

const verifyOTP = async (otp) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    console.log("User Verified:", result.user);
    alert("Phone number verified successfully!");
  } catch (error) {
    console.error("Invalid OTP:", error.message);
  }
};
