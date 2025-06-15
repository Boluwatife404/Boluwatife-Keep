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
    const loader = document.getElementById('loader');
    const btnText = document.querySelector('.btn-text');

    // Show loader and hide submit text
    loader.style.display = 'inline-block';
    btnText.style.display = 'none';
    submiT.disabled = true;

    const email = emaiL.value.trim();
    const password = passworD.value.trim();

    if (email === '' || password === '') {
        toast('This fill in can not be empty joor😠', '#f00', '#fff');
        setTimeout(() => {
            loader.style.display = 'none';
            btnText.style.display = 'inline-block';
            submiT.disabled = false;
        }, 1000);
        return;
    }

    const found = gottenUsers.find(user => user.emaild === email && user.passw === password);
    console.log(found);


    // if (!found) {
    //     toast('User not found', '#f01400', '#fff');
    //     setTimeout(() => {
    //         loader.style.display = 'none';
    //         btnText.style.display = 'inline-block';
    //         submiT.disabled = false;
    //     }, 1000);
    // } else {
    //     toast('Sign in successful😁', '#006400', '#fff');
    //     localStorage.setItem('person', JSON.stringify(found));
    //     window.location.href = 'dashboard.html';
    // }
    if (!found) {
        toast('User not found', '#f01400', '#fff');
        setTimeout(() => {
            loader.style.display = 'none';
            btnText.style.display = 'inline-block';
            submiT.disabled = false;
        }, 1000);
    } else {
        toast('Sign in successful😁', '#006400', '#fff');
        localStorage.setItem('person', JSON.stringify(found));
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1200); 
    }
   

    emaiL.value = '';
    passworD.value = '';
}