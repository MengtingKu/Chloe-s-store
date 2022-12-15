var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
            null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function () {
    if (!document[hiddenProperty]) {
        init();
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);

// 優質商品廠商來源比例分析
function init() {
    let data = [];
    axios.get(`${base_url}/products`)
        .then(function (response) {
            data = response.data;
            c3Chart()
        }).catch(function (error) {
            console.log(error);
        })
    function c3Chart() {
        /* 第一步：蒐集資料 */
        const collectData = {};
        data.forEach(item => {
            if (collectData[item.maker] === undefined) {
                collectData[item.maker] = 1
            } else {
                collectData[item.maker] += 1
            }
        });

        /* 第二步：處理成C3.js要的資料 */
        let newData = [];
        Object.keys(collectData).forEach(item => {
            let arr = [];
            arr.push(item);
            arr.push(collectData[item]);
            newData.push(arr);
        });

        /* 第三步：套用在 C3.js donut chart setup */
        let chart = c3.generate({
            bindto: '#chart', // HTML 元素綁定
            data: {
                type: "pie",
                columns: newData,
            },
        });
    }
    // 客戶收藏商品分析
    let productData = [];
    axios.get(`${base_url}/likes?_expand=product`)
        .then(function (response) {
            productData = response.data;
            c3Chart1()
        })
        .catch(function (error) {
            console.log(error.response);
        })
    function c3Chart1() {
        const collectData = {};
        productData.forEach(item => {
            if (collectData[item.product.title] === undefined) {
                collectData[item.product.title] = 1
            } else {
                collectData[item.product.title] += 1
            }
        });
        let newDataChart1 = Object.entries(collectData);
        let chart1 = c3.generate({
            bindto: '#chart1', // HTML 元素綁定
            data: {
                type: "pie",
                columns: newDataChart1,
            },
        });
    }
    getOrderList()
}
init()

// 表格
let orderList = [];
const jsOrderList = document.querySelector('.js-orderList');

function getOrderList() {
    axios.get(`${base_url}/orders`)
        .then(function (response) {
            orderList = response.data;
            let str = "";
            orderList.forEach(item => {
                /* 多項訂單品項重組 */
                let productsItem = '';
                item.products.forEach(item => {
                    productsItem += `
                    ${item.title}*${item.quantity} /
                    `;
                });

                /* 判斷訂單狀態處理 */
                let orderStatus = '';
                if (item.hasDelivered === false) orderStatus = `未處理`
                else orderStatus = `已處理`

                /* 訂單建立時間重組 */
                let orderCreatTime = new Date(item.createdAt);
                orderTime = `${orderCreatTime.getFullYear()}/${orderCreatTime.getMonth() + 1}/${orderCreatTime.getDate()}`;

                /* 字串重組並且渲染 */
                str += `
            <tr>
                <td class="align-middle">${item.id}</td>
                <td class="align-middle pad-none">
                    <p>${item.info.username}</p>
                     <p>${item.info.tel}</p>
                </td>
                <td class="align-middle pad-none">${item.info.address}</td>
                <td class="align-middle pad-none">${item.info.email}</td>
                <td class="align-middle phone-none">${productsItem}</td>
                <td class="align-middle text-center">${orderTime}</td>
                <td class="text-center pe-3 orderStatus align-middle">
                <a href="#" class="js-status" data-status="${item.hasDelivered}" data-id="${item.id}">${orderStatus}</a>
                </td>
                <td class="text-center pe-3 align-middle">
                    <input type="button" class="delSingleOrder-Btn js-delete btn btn-outline-secondary btn-sm"
                    data-btn="delSingleOrder" value="刪除" data-id="${item.id}">
                </td>
            </tr>
            `
            });
            jsOrderList.innerHTML = str
        })
        .catch(function (error) {
            console.log(error);
        })
}

/* 刪除、修改按鈕監聽 */
jsOrderList.addEventListener("click", function (e) {
    e.preventDefault();
    let toggleBtn = e.target.getAttribute("class");
    let id = e.target.getAttribute("data-id");

    // 修改狀態按鈕
    if (toggleBtn === "js-status") {
        let status = e.target.getAttribute("data-status");
        console.log(typeof status, status);
        let newStatus = "";
        if (status === "false") newStatus = true;
        else if (status === "true") newStatus = false;
        axios.patch(`${base_url}/orders/${id}`, {
            "hasDelivered": newStatus
        })
            .then(function (response) {
                console.log(response);
                alert(`訂單修改成功 g˙Ꙫ˙d`);
                getOrderList()
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    // 刪除項目按鈕
    let delSingleOrder = e.target.dataset.btn;
    console.log(delSingleOrder);
    if (delSingleOrder === "delSingleOrder") {
        axios.delete(`${base_url}/orders/${id}`)
            .then(function (response) {
                console.log(response);
                alert(`訂單刪除成功 ʕ̯•͡ˑ͓•̯᷅ʔ`);
                getOrderList()
            })
            .catch(function (error) {
                console.log(error);
            })
        return
    }
})

/* 刪除全部項目按鈕 */
const delOrderAll = document.querySelector(".delOrderAll");
delOrderAll.addEventListener("click", deleteOrderAll)
function deleteOrderAll() {
    orderList.forEach(item => {
        console.log(item.id);
        axios.delete(`${base_url}/orders/${item.id}`)
            .then(function (response) {
                sweet2Success(`所有訂單移除成功 
                    ʕ·͡ˑ·ཻʔ `);
                delOrderAll.disabled = true
                getOrderList();
            })
            .catch(function (error) {
                console.log(error.response.data);
            })
    });
}