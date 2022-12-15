var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
            null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function () {
    if (!document[hiddenProperty]) {
        getCartList()
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);
// js 怎样判断用户是否在浏览当前页面 (https://blog.csdn.net/wang1006008051/article/details/117740870)


const cartableList = document.querySelector(".cartableList");
let renderCartList = [];
getCartList()
function getCartList() {
    axios.get(`${base_url}/600/users/${localId}/carts?_expand=product`, {
        headers: {
            "authorization": `Bearer ${localJWT}`
        }
    })
        .then(function (response) {
            renderCartList = response.data;
            const totalCost = document.querySelectorAll(".totalCost");
            let total = 0

            // 總金額計算
            if (renderCartList.length >= 1) {
                document.querySelector('.noProduct').style.display = 'none';
                document.querySelector('.table').style.display = 'block';
                deleteCartsAll.disabled = false;
                renderCartList.forEach(item => {
                    total += item.quantity * item.product.price;
                });
                totalCost[0].textContent = toThousands(total);
                totalCost[1].textContent = toThousands(total)
            } else {
                document.querySelector('.noProduct').style.display = 'block';
                document.querySelector('.table').style.display = 'none';
                deleteCartsAll.disabled = true;
                totalCost[0].textContent = toThousands(total);
                totalCost[1].textContent = toThousands(total)
            }

            // tbody 購物車明細更新渲染
            let str = "";
            renderCartList.forEach(item => {
                str += `
                <tr class="border-bottom">
                                <td class="d-flex justify-content-md-evenly align-items-center">
                                    <a class="delCartsItem" href="#" data-title="${item.product.title}" data-id="${item.id}" data-bs-toggle="modal"
                                        data-bs-target="#removeModal" aria-label="product">
                                        <i class="fa-solid fa-trash-can p-1 me-2" data-title="${item.product.title}" data-id="${item.id}"></i>
                                    </a>
                                    <a href="productItem1.html?id=${item.product.id}" target="_blank">
                                        <img class="ms-2" src="${item.product.cart_likes_imgurl}" alt="${item.product.category}" width="88%">
                                    </a>
                                </td>
                                <td class="align-middle"> ${item.product.title}</td>
                                <td class="price text-end pe-5"> ${toThousands(item.product.price)}</td>
                                <td class="number text-end">${item.quantity}
                                </td>
                                <td class="text-end">$ <span class="itemTotalCost">${toThousands(item.quantity * item.product.price)}</span></td>
                            </tr>
                `
            });
            cartableList.innerHTML = str;
        })
        .catch(function (error) {
            console.log(error.response.data);
            if (error.response.data === "jwt expired") {
                sweet2Error(`時間到！請登出後重新登入！`)
            }
            if (error.response.data === "jwt malformed") {
                sweet2Error(`請登入後操作！`)
            }
        })
}

window.onload = function () {
    cartableList.addEventListener("click", quantity);
    cartableList.addEventListener("click", delCartsItem)
}
/* +1 || -1 */
function quantity(e) {
    let btn = e.target.dataset.btn;
    let number = e.target.parentNode.querySelector('.number').value;
    let price = e.target.parentNode.parentNode.parentNode.querySelector('.price').textContent;
    let count = Number(number);
    if (btn === "add") {
        count += 1
    }
    if (btn === "remove" && count > 1) {
        count -= 1
    }
    e.target.parentNode.querySelector('.number').value = count;
    e.target.parentNode.parentNode.parentNode.querySelector('.itemTotalCost').textContent = toThousands(count * Number(price));
}


/* 刪除所有購物車內容 */
const deleteCartsAll = document.querySelector('.deleteCartsAll');
deleteCartsAll.addEventListener("click", function () {
    renderCartList.forEach(item => {
        console.log(item.id);
        let id = item.id;
        axios.delete(`${base_url}/carts/${id}`)
            .then(function (response) {
                if (response.status === 200) {
                    sweet2Success(`已經把所有商品移除囉！ 
                    ʕ·͡ˑ·ཻʔ `);
                    deleteCartsAll.disabled = true
                    getCartList();
                }
            })
            .catch(function (error) {
                console.log(error.response.data);
            })
    });
})

/* 刪除單項商品明細 */
function delCartsItem(e) {
    console.log(e.target);
    let cartsListId = e.target.dataset.id;
    if (cartsListId !== undefined) {
        axios.delete(`${base_url}/carts/${cartsListId}`)
            .then(function (response) {
                if (response.status === 200) {
                    sweet2Success(`刪除單筆購物車成功 ʕ·͡ˑ·ཻʔ`);
                    getCartList()
                }
            })
            .catch(function (error) {
                console.log(error.response.data);
            })
    }
}

/* 訂購人表單資訊 */
// 1. 把註冊 mail 帶入訂購人資料的 e-mail 欄位
const orderInf = document.querySelector(".orderInf");
const orderIputs = document.querySelectorAll("input[type=name],input[type=email],input[type=tel],input[type=text]");

renderUserData()
function renderUserData() {
    axios.get(`${base_url}/users/${localId}`)
        .then(function (response) {
            console.log(response);
            if (response.status === 200) {
                orderInf.inputEmail.value = response.data.email;
            }
        })
        .catch(function (error) {
            console.log(error.response.data);

        })
}

// 2.1 建立資料庫 - 按下送出後建立 order 資料
const orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener("click", buildOrderData)
function buildOrderData() {

    /* 送出成功 - 條件1：購物車要有商品 */
    if (renderCartList.length === 0) {
        alert(`請將您喜歡的商品加入購物車喲 ･◡･`);
        return;
    }

    /* 送出成功 - 條件2 */
    for (let i = 0; i < orderIputs.length; i++) {
        if (orderIputs[i].value == '') return alert("填好所有內容才能送件喔 ⚆_⚆");
    }

    /* 通關後，訂單成立要 post 到資料庫開始 */
    axios.get(`${base_url}/600/users/${localId}/carts?_expand=product`, {
        headers: {
            "authorization": `Bearer ${localJWT}`
        }
    })
        .then(function (response) {

            // 產品訂單資料
            if (response.status === 200) {
                const carts = response.data;
                console.log(carts);
                localStorage.setItem('carts', JSON.stringify(response.data));
                const orderItems = carts.map((item) => {
                    return {
                        productId: item.productId,
                        quantity: item.quantity,
                        title: item.product.title,
                        price: item.product.price,
                    };
                });
                console.log(orderItems);
                let sum = 0;
                carts.forEach((item) => {
                    const intQty = Number(item.quantity) || 0;
                    const intPrice = Number(item.product.price);
                    const total = intQty * intPrice;
                    sum += total;
                });

                // 訂購人填寫表單的資料
                const newOrder = {
                    createdAt: Date.now(),
                    userId: localId,
                    info: {
                        username: orderInf.username.value,
                        email: orderInf.inputEmail.value,
                        tel: orderInf.inputTel.value,
                        address: orderInf.inputAddress.value,
                    },
                    products: orderItems,
                    payment: sum,
                    hasDelivered: false,
                };
                console.log(newOrder);
                sendOrder(newOrder)
            }
        })
        .catch(function (error) {
            console.log(error.response.data);
        })
}

// 2.2 建立資料庫 - 建好的資料 post 去 orders
function axiosDeleteCart(cartId = 0) {
    const url = `${base_url}/carts/${cartId}`;
    return axios.delete(url);
}
function sendOrder(orderData) {
    const data = orderData;
    console.log(data);
    axios.post(`${base_url}/600/orders`, data, {
        headers: {
            "authorization": `Bearer ${localJWT}`
        }
    })
        .then(function (response) {
            console.log(response);
            if (response.status === 201) {
                const localCarts = localStorage.getItem('carts');
                const carts = JSON.parse(localCarts);
                console.log(carts);

                // 把購物車清空，因為已經轉去訂單
                let arrayOfDelete = [];
                carts.forEach((item) => {
                    const request = axiosDeleteCart(item.id);
                    arrayOfDelete.push(request);
                });
                console.log('arrayOfDelete:::', arrayOfDelete);

                Promise.all(arrayOfDelete)
                    .then(function (response) {
                        console.log('results:::', response);
                        if (response.length === arrayOfDelete.length) {
                            console.log(`已全部刪除！`);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                orderInf.reset();
                getCartList();
                window.location.replace("http://localhost:5500/shoppingOrder.html")
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

// 訂購表單驗證
const orderChrck = document.querySelectorAll("#username,#inputEmail,#inputTel,#inputAddress")
const orderConstraints = {
    姓名: {
        presence: {
            allowEmpty: false,
            message: `是必填欄位`,
        },
    },
    電子信箱: {
        presence: {
            allowEmpty: false,
            message: "必填"
        },
        email: true,
    },
    手機電話: {
        presence: {
            allowEmpty: false,
            message: "必填"
        },
        length: {
            is: 10,
            message: "請填入您的手機電話"
        },
        numericality: {
            onlyInteger: true,
        },
        // format:{
        //     pattern: "/^[09]{2}\d(8)$/",
        //     message: "請填寫正確的手機格式"
        // }
    },
    送達地址: {
        presence: {
            allowEmpty: false,
            message: "必填"
        }
    }
};
/* 對每一個 input 綁定監聽事件並且讓她啟動回傳訊息 */
orderChrck.forEach((item) => {
    item.addEventListener("blur", function () {
        item.nextElementSibling.textContent = "";
        let errors = validate(orderInf, orderConstraints) || "";
        if (errors) {
            console.log(errors);
            Object.keys(errors).forEach((item, idx) => {
                document.querySelector(`[data-msg=${item}]`).textContent = Object.values(errors)[idx];
            });
        }
    });
});