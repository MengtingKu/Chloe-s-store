/* jQ-gototop */
$(document).ready(function () {
    $(window).scroll(function () {
        last = $("body").height() - $(window).height();
        if ($(window).scrollTop() >= last - 1000) { $('.gotop a').addClass('active').css('opacity', '1'); }
        else {
            $('.gotop a').removeClass('active').css('opacity', '0');
        }
    });
});

/* sweetAlert 成功 */
function sweet2Success(title, text, timer = 1500) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        showConfirmButton: true,
        timer: timer
    })
}
/* sweetAlert 失敗*/
function sweet2Error(title, text) {
    Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        showConfirmButton: true,
        timer: 2000
    })
}

/* 註冊登入 */
const registerAccount = document.querySelector(".registerAccount");
const registerPassword = document.querySelector(".registerPassword");
const registerBtn = document.querySelector(".registerBtn");
const base_url = `http://localhost:3000`;

//aveUserToLocal()
function saveUserToLocal({ accessToken, user }) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', user.id);
}

// #Step-1: `POST` data to API
registerBtn.addEventListener("click", function () {
    if (registerAccount.value === "" || registerPassword.value === "") {
        sweet2Error('請輸入完整資料');
        return;
    }
    let obj = {};
    obj.email = registerAccount.value.trim();
    obj.password = registerPassword.value.trim();
    axios.post(`${base_url}/register`, obj)
        .then(function (response) {
            if (response.status === 201) {
                saveUserToLocal(response.data);
                sweet2Success(`註冊成功`);
                window.location.replace('/login.html');
            }
        })
        .catch(function (error) {
            console.log(error);
        })
});


