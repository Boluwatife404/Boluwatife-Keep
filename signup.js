let allUser = [];

if (localStorage.getItem("users")) {
  allUser = JSON.parse(localStorage.getItem("users"));
  console.log(allUser);
}

const toast = (text, background = "#333", color = "#fff", position = 'right') => {
  Toastify({
    text,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position,
    stopOnFocus: true,
    style: {
      background,
      color,
    },
  }).showToast();
};

const ClickToRegister = () => {
  const fName = document.getElementById("firstname");
  const lName = document.getElementById("lastname");
  const pNumber = document.getElementById("phonenumber");
  const Email = document.getElementById("email");
  const ePassword = document.getElementById("enterPassword"); 
  const cPassword = document.getElementById("confirmPassword");

  const loader = document.getElementById("loader");
  const submitBtn = document.getElementById("submitBtn");

  // Show loader
  loader.style.display = "block";
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  setTimeout(() => {
    const fnamed = fName.value.trim();
    const lnamed = lName.value.trim();
    const num = pNumber.value.trim();
    const emaild = Email.value.trim();
    const passw = ePassword.value.trim();
    const pass2 = cPassword.value.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!fnamed || !lnamed || !num || !emaild || !passw || !pass2) {
      toast("Please fill all fields", "#f00", "#fff");
      loader.style.display = "none";
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      return;
    }

    if (!emailRegex.test(emaild)) {
      toast("Invalid email", "#FFA500", "#000");
      loader.style.display = "none";
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      return;
    }

    if (!nameRegex.test(fnamed) || !nameRegex.test(lnamed)) {
      toast("Input correct name", "#ffa400", "#001");
      loader.style.display = "none";
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      return;
    }

    if (!passwordRegex.test(passw)) {
      toast("Password must be strong", "#ffa400", "#111");
      loader.style.display = "none";
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      return;
    }

    if (passw !== pass2) {
      toast("Passwords do not match", "#f00", "#fff");
      loader.style.display = "none";
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      return;
    }

    if (!phoneRegex.test(num)) {
      toast("Number must include country code e.g. +234", "#ffa300", "#f00");
      loader.style.display = "none";
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      return;
    }

    let found = allUser.find(eachUser => eachUser.emaild === emaild);

    if (!found) {
      const userObj = { fnamed, lnamed, emaild, passw, num };
      allUser.push(userObj);
      toast("Congrats! Signup successful ✅");

      fName.value = "";
      lName.value = "";
      pNumber.value = "";
      Email.value = "";
      ePassword.value = "";
      cPassword.value = "";

      localStorage.setItem("users", JSON.stringify(allUser));

      setTimeout(() => {
        window.location.href = "login.html";
      }, 4000);
    } else {
      toast("Account already exists, kindly sign in", "#f00", "#F88");
    }

    // Hide loader after processing
    loader.style.display = "none";
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;

  }, 3000);
};