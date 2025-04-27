// function redirectToNextPage(){
//   document.getElementsByClassName("btn solid").submit();
//   Window.location.href="profile.html"
// }

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// error

function validateSignInForm() {
  let isValid = true;

  const name1 = document.getElementById("name1").value.trim();
  const password1 = document.getElementById("password1").value.trim();

  // Clear previous error messages
  document.getElementById("name-error1").style.display = "none";
  document.getElementById("password-error1").style.display = "none";

  if (name1.length < 3) {
    document.getElementById("name-error1").style.display = "block";
    isValid = false;
  }

  if (password1.length < 8) {
    document.getElementById("password-error1").style.display = "block";
    isValid = false;
  }

  if (isValid) {
    window.location.href = "profile.html";
  }

  return isValid;
}

function validateSignUpForm() {
  let isValid = true;

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Clear previous error messages
  document.getElementById("name-error").style.display = "none";
  document.getElementById("phone-error").style.display = "none";
  document.getElementById("email-error").style.display = "none";
  document.getElementById("password-error").style.display = "none";

  if (name.length < 3) {
    document.getElementById("name-error").style.display = "block";
    isValid = false;
  }

  if (phone.length !== 11 || isNaN(phone)) {
    document.getElementById("phone-error").style.display = "block";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("email-error").style.display = "block";
    isValid = false;
  }

  if (password.length < 8) {
    document.getElementById("password-error").style.display = "block";
    isValid = false;
  }

  return isValid;
}

//pass visible

document
  .getElementById("toggle-password1")
  .addEventListener("click", function () {
    const passwordField = document.getElementById("password1");
    const toggleIcon = this;

    // Toggle the type attribute
    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleIcon.classList.add("show-password"); // Add a class to change the icon
    } else {
      passwordField.type = "password";
      toggleIcon.classList.remove("show-password");
    }
  });

document
  .getElementById("toggle-password")
  .addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const toggleIcon = this;

    // Toggle the type attribute
    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleIcon.classList.add("show-password"); // Add a class to change the icon
    } else {
      passwordField.type = "password";
      toggleIcon.classList.remove("show-password");
    }
  });

const video = document.getElementById("video");

video.addEventListener("ended", function () {
  if (video.currentTime >= video.duration - 0.3) {
    video.currentTime = 0; // Rewind to the beginning just before the black frame
    video.play();
  }
});
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  setTimeout(() => {
    loader.classList.add("loader-hidden");
  }, 2000);

  loader.addEventListener("transitionend", () => {
    loader.remove();
  });
});

document.getElementById("createacc").addEventListener("submit", async (e) => {
  e.preventDefault();
  container.classList.remove("sign-up-mode");
  // const formdata = new FormData(document.getElementById("createacc"));
  // try {
  //   const response = await fetch("http://192.168.241.111:3000/api/user/signup", {
  //     method: "POST",
  //     body: formdata,
  //   });
  //   if (response.ok) {
  //     container.classList.remove("sign-up-mode");
  //   } else {
  //     alert("error");
  //   }
  // } catch (error) {
  //   alert("error");
  // }
});



// Function to check if the data is expired
 // Function to encrypt data
  function encryptData(data, secretKey) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  }

  // Function to decrypt data
  function decryptData(encryptedData, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // Function to set data in localStorage with expiration
  function setDataWithExpiration(key, data, hours, secretKey) {
    const expirationTime = Date.now() + hours * 60 * 60 * 1000; // Calculate expiration time
    const encryptedData = encryptData(data, secretKey);
    const dataWithExpiration = { encryptedData, expiration: expirationTime };
    localStorage.setItem(key, JSON.stringify(dataWithExpiration)); // Store data with expiration
  }

  // Function to get data from localStorage and check expiration
  function getDataWithExpiration(key, secretKey) {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null; // No data found

    const { encryptedData, expiration } = JSON.parse(storedData);
    if (Date.now() > expiration) {
      localStorage.removeItem(key); // Remove expired data
      return null; // Data is expired
    }
    return decryptData(encryptedData, secretKey); // Decrypt and return valid data
  }

  // Event listener for form submission
  document.getElementById("loginform").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formdata = {
      email: document.getElementById("loginform").email.value,
      password: document.getElementById("loginform").password.value,
    };

    console.log(formdata); // Log the formdata object

    try {
      // const response = await fetch("http://192.168.241.111:3000/api/user/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json", // Set the content type
      //   },
      //   body: JSON.stringify(formdata), // Convert formdata to JSON
      // });

      if (true) {
        //const jsonResponse = await response.json(); // Await the JSON response
        const jsonResponse={data:{user:{fullname:"ahmed hassan",wallet:500}}}
        console.log("Success:", jsonResponse); // Log the successful response

        const secretKey = "jnvmnjofmcivneirp"; // Define your secret key
        setDataWithExpiration("userData", jsonResponse, 20, secretKey);
        window.location.href = "/profile.html";
        // Store user data with expiration
      } else {
        const errorResponse = await response.json(); // Await the error response
        console.error("Error:", errorResponse); // Log the error response
        alert(errorResponse.error || 'An error occurred'); // Handle the error message
      }
    } catch (error) {
      console.error("Fetch error:", error); // Log the error for debugging
      alert(error.message || 'An error occurred'); // Handle the catch block
    }
  });

  // Example usage to retrieve and decrypt data
  // const secretKey = "jnvmnjofmcivneirp"; // Use the same secret key for decryption
  // const storedData = getDataWithExpiration("userData", secretKey);

  // if (storedData) {
  //   console.log("Valid User Data:", storedData);
  // } else {
  //   console.log("No valid user data found or data is expired.");
  // }


// // Example usage to check expiration

