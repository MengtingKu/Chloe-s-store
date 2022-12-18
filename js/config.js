// const base_url= `http://localhost:3000`;
const base_url = `https://json-server-vercel-b2mlt8a4o-mengtingku.vercel.app/`;
const localJWT = localStorage.getItem("token");
const localId = localStorage.getItem("userId");
const localstatus = localStorage.getItem("isAdmin");


/* 註冊 register */
const registerAccount = document.querySelector(".registerAccount");
const registerPassword = document.querySelector(".registerPassword");
const registerBtn = document.querySelector(".registerBtn");
const registerForm = document.querySelector(".registerForm");
const loginForm = document.querySelector(".loginForm");
const changePasswordForm = document.querySelector(".changePasswordForm");
const registerPasswordCheck = document.querySelector(".registerPasswordCheck");

registerBtn.addEventListener("click", function () {
    if (registerAccount.value === "" || registerPassword.value === "") {
        sweet2Error("請輸入完整資料");
        return;
    }
    if (registerPassword.value !== registerPasswordCheck.value) {
        sweet2Error(`註冊失敗，兩者密碼不一致`);
        registerForm.reset()
        return;
    }
    let obj = {};
    obj.email = registerAccount.value.trim();
    obj.password = registerPassword.value.trim();
    obj.isAdmin = false,
        axios.post(`${base_url}/register`, obj)
            .then(function (response) {
                if (response.status === 201) {
                    saveUserToLocal(response.data);
                    sweet2Success(`註冊成功`);
                    window.location.replace("index.html");
                }
            })
            .catch(function (error) {
                localStorage.clear();
                sweet2Error(error.response.data)
            })
    registerForm.reset();
});
document.querySelector(".watchR").addEventListener("click", function () {
    const watchR = document.querySelector(".watchR");
    iSeeU(registerPassword, watchR)
})
document.querySelector(".watchRC").addEventListener("click", function () {
    const watchRC = document.querySelector(".watchRC");
    iSeeU(registerPasswordCheck, watchRC)
})

/* 登入login */
const loginAccount = document.querySelector("#accountInput");
const loginPassword = document.querySelector("#codeInput")
const loginBtn = document.querySelector(".loginBtn");
const btnUserMenu = document.querySelector(".js-user-menu");
// token saveUserToLocal()
function saveUserToLocal({ accessToken, user }) {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("isAdmin", user.isAdmin);
}
// #Step-1: `POST` data to API
loginBtn.addEventListener("click", login)
function login() {
    if (loginAccount.value === "" || loginPassword.value === "") {
        sweet2Error("請輸入資料 (ﾉ◕ヮ◕)ﾉ");
        return;
    }
    let obj = {};
    obj.email = loginAccount.value.trim();
    obj.password = loginPassword.value.trim();
    axios.post(`${base_url}/login`, obj)
        .then(function (response) {
            if (response.status === 200) {
                console.log(response.data);
                saveUserToLocal(response.data);
                setTimeout(() => {
                    sweet2Success(`歡迎回來`);
                    window.location.reload();
                }, 150);
            }
        })
        .catch(function (error) {
            sweet2Error(error.response.data);
        })
    loginForm.reset();
}

checkAdmin(localstatus);
function checkAdmin(localstatus) {
    if (localstatus == "true") {
        document.querySelector(".admin").classList.remove("d-none");
        document.querySelector(".admin").classList.add("d-block");
    } else {
        document.querySelector(".admin").classList.add("d-none");
        document.querySelector(".admin").classList.remove("d-block");
    }
}


function templateUserMenu() {
    document.querySelector(".headerBtnGroup").style.display = "none";
    return `<li class="nav-item dropdown">
                <div>
                <!-- Avatar -->
                    <a href="#" class="nav-link d-flex align-items-center" role="button">
                        <div class="circular-landscape">
                            <P data-action="logout"><i class="fa-solid fa-user"></i> Hi！ |  登出</P>
                        </div>
                    </a>
                </div>
                <li class="nav-link d-flex align-items-center" data-bs-toggle="modal"
            data-bs-target="#changePasswordModal"> |  修改密碼</li>
            </li>
            `
}
/* end of templateUserMenu() */
function localLoginChecker() {
    console.log("localLoginChecker!");
    const localJWT = localStorage.getItem("token");
    if (localJWT) {
        btnUserMenu.innerHTML = templateUserMenu();
    }
}
localLoginChecker();
document.querySelector(".watchL").addEventListener("click", function () {
    const watchL = document.querySelector(".watchL");
    iSeeU(loginPassword, watchL)
})

/* 登出 logout */
btnUserMenu.addEventListener("click", function (e) {
    if (e.target.dataset.action === "logout") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("isAdmin");
        document.querySelector(".headerBtnGroup").style.display = "block";
        document.querySelector(".js-user-menu").style.display = "none";
        document.querySelector(".admin").classList.add("d-none");
        window.location.replace("http://localhost:5500/index.html")
    }
})

/* 修改密碼 change password */
const changePassword = document.querySelector('.changePassword');
const changePasswordCheck = document.querySelector('.changePasswordCheck');
document.querySelector(".changeCodeBtn").addEventListener("click", function (e) {
    console.log(e.target.getAttribute("data-btn"));
    if (changePassword.value === "" || changePasswordCheck.value === "") {
        sweet2Error("請輸入完整資料");
        return;
    }
    if (changePassword.value !== changePasswordCheck.value) {
        sweet2Error(`密碼變更失敗，兩者密碼不一致`)
        return;
    }
    let obj = {}
    obj.password = changePassword.value.trim();
    axios.patch(`${base_url}/600/users/${localId}`, obj, {
        headers: {
            "authorization": `Bearer ${localJWT}`
        }
    })
        .then(function (response) {
            console.log(response.data);
            if (response.status === 200) {
                changePasswordForm.reset();
                sweet2Success(`密碼變更成功`);
                setTimeout(() => {
                    window.location.replace("index.html");
                }, 1000);
            }
        })
        .catch(function (error) {
            sweet2Error(`${error.response.data}`)
        })

})
document.querySelector(".watch").addEventListener("click", function () {
    const watch = document.querySelector(".watch");
    iSeeU(changePassword, watch)
})
document.querySelector(".watch1").addEventListener("click", function () {
    const watch1 = document.querySelector(".watch1");
    iSeeU(changePasswordCheck, watch1)
})

/* 密碼給看嗎？ */
function iSeeU(input, status) {
    if (input.type === "password") {
        input.setAttribute("type", "text");
        status.classList.add("fa-eye");
        status.classList.remove("fa-eye-slash");
    } else {
        input.setAttribute("type", "password");
        status.classList.add("fa-eye-slash");
        status.classList.remove("fa-eye");
    }
}

/* jQ-gototop */
$(document).ready(function () {
    $(window).scroll(function () {
        last = $("body").height() - $(window).height();
        if ($(window).scrollTop() >= last - 1000) { $(".gotop a").addClass("active").css("opacity", "1"); }
        else {
            $(".gotop a").removeClass("active").css("opacity", "0");
        }
    });
});

/* sweetAlert 成功 */
function sweet2Success(title, text, timer = 1500) {
    Swal.fire({
        icon: "success",
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 3500
    })
}
/* sweetAlert 失敗*/
function sweet2Error(title, text) {
    Swal.fire({
        icon: "warning",
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 3500
    })
}

/* 千分位 */
function toThousands(x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

// 註冊表單驗證
const registerInputs = document.querySelectorAll("#email,#entercode,#entercodeagain");
const registerConstraints = {
    帳號: {
        presence: {
            message: "必填"
        },
        email: true,
    },
    密碼: {
        presence: {
            message: "必填"
        },
        length: {
            is: 8,
            message: "英文搭配數字共8碼"
        }
    },
    確認密碼: {
        presence: {
            message: "必填"
        },
        length: {
            is: 8,
            message: "英文搭配數字共8碼"
        }
    }
};

/* 對每一個 input 綁定監聽事件並且讓她啟動回傳訊息 */
registerInputs.forEach((item) => {
    item.addEventListener("blur", function () {
        // input綁定監聽，然後在下一個同階元素輸入訊息
        item.nextElementSibling.textContent = "";

        // 按照文件放入 form 元素和條件都放進驗證，所有條件都回到error上
        let errors = validate(registerForm, registerConstraints) || "";

        // 回傳印在畫面上
        if (errors) {
            Object.keys(errors).forEach((item, idx) => {
                // 因為是在回圈內做網頁元素選取，所以每一個都會進來被綁一次
                document.querySelector(`[data-msg=${item}]`).textContent = Object.values(errors)[idx];
            });
        }

    });
});

// 登入表單驗證 (ok)
const loginInputs = document.querySelectorAll("#accountInput,#codeInput");
const loginConstraints = {
    登入帳號: {
        presence: {
            message: "必填"
        },
        email: true,
    },
    登入密碼: {
        presence: {
            message: "必填"
        },
        length: {
            is: 8,
            message: "英文搭配數字共8碼"
        }
    }
}
loginInputs.forEach(item => {
    item.addEventListener("blur", function () {
        item.nextElementSibling.textContent = "";
        let errors = validate(loginForm, loginConstraints) || "";
        if (errors) {
            Object.keys(errors).forEach((item, idx) => {
                document.querySelector(`[data-msg=${item}]`).textContent = Object.values(errors)[idx];
            });
        }
    });
});

// 變更密碼表單驗證
const changeCodeInputs = document.querySelectorAll("#changeCode,#changeCodeAgain");
const changeCodeConstraints = {
    設定新密碼: {
        presence: {
            message: "必填"
        },
        length: {
            is: 8,
            message: "英文搭配數字共8碼"
        }
    },
    確認新密碼: {
        presence: {
            message: "必填"
        },
        length: {
            is: 8,
            message: "英文搭配數字共8碼"
        }
    }
}
changeCodeInputs.forEach(item => {
    item.addEventListener("blur", function () {
        item.nextElementSibling.textContent = "";
        let errors = validate(changePasswordForm, changeCodeConstraints) || "";
        if (errors) {
            Object.keys(errors).forEach((item, idx) => {
                document.querySelector(`[data-msg=${item}]`).textContent = Object.values(errors)[idx];
            });
        }
    });
});
