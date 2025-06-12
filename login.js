let gottenUsers = JSON.parse(localStorage.getItem('users')) || [];
console.log(gottenUsers);

const toast = (text, background, color, position = 'right') => {
    Toastify({
        text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", 
        position,
        stopOnFocus: true,
        style: {
            background,
            color,
        },
        onClick: function () { }
    }).showToast();
};

const ClickToLogin = () => {
    const passworD = document.getElementById("confirmPassword");
    const emaiL = document.getElementById("confirmemail");
    const submiT = document.getElementById("sub");

    const email = emaiL.value.trim();
    const password = passworD.value.trim();

    if (email === '' || password === '') {
        submiT.innerHTML = '...loading';
        toast('Haba now, fill in the inputs joor😠👿', '#f00', '#fff');
        setTimeout(() => {
            submiT.innerHTML = 'Log In';
        }, 1000);
        return;
    }

    submiT.innerHTML = '...loading';

    const found = gottenUsers.find(user => user.emaild === email && user.passw === password);
    console.log(found);

    if (!found) {
        toast('User not found', '#f01400', '#fff');
        setTimeout(() => {
            submiT.innerHTML = 'Log In';
        }, 1000);
    } else {
        toast('Sign in successful😁', '#006400', '#fff');
        localStorage.setItem('person', JSON.stringify(found));
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Clear input fields
    emaiL.value = '';
    passworD.value = '';
}