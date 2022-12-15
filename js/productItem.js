var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
            null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function () {
    if (!document[hiddenProperty]) {
        getLikeList()
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);

const productItem = document.querySelector(".productItem")
/* 渲染產品明細內容 */
const id = location.href.split("=")[1];
// const breadcrumbStyle = document.querySelector('.breadcrumbStyle');

axios.get(`${base_url}/products/${id}`)
    .then(function (response) {
        console.log(response.data);
        let item = response.data;
        productItem.innerHTML = `
        <div class="col-md-4">
                    <div class="sticky-top mb-3" style="top: 66px;">
                        <!-- 麵包屑 -->
                        <nav class="my-3" aria-label="breadcrumb">
                            <ol class="breadcrumb fw-light">
                                <li class="breadcrumb-item"><a href="index.html">首頁</a></li>
                                <li class="breadcrumb-item"><a href="productList.html">所有商品</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${item.title}</li>
                            </ol>
                        </nav>
                        <!-- 產品 -->
                        <h1 class="h3 fw-bold mainFontColor">${item.title}</h1>
                        <small class="text-secondary fw-light mb-5 smallFS">${item.maker}</small>
                        <div class="d-flex justify-content-md-end align-items-md-end mt-5 mb-3">
                            <p class="text-secondary text-decoration-line-through fw-light">售價 $ <span> ${toThousands(item.origin_price)}</span></p>
                            <p class="text-danger fs-4 ms-auto">優惠價 NT$ <strong class="fw-bold fs-3"> ${toThousands(item.price)}</strong></p>
                        </div>
                        <hr>
                        <div class="mb-3 row">
                            <label for="staticNum" class="col-md-3 text-center mb-3 subFontColor">數量：</label>
                            <div class="col-md-8">
                                <div class="input-group input-group-sm mb-3">
                                    <button class="input-group-text material-icons fs-5" data-btn="add">
                                    add
                                    </button>
                                    <input class="form-control text-center number" type="text" placeholder="1" min="1" value="1">
                                    <button class="input-group-text material-icons fs-5" data-btn="remove">
                                    remove
                                    </button>
                                </div>
                            </div>
                            <div class="col-lg-6 mb-2">
                                <button type="button" class="btn btn-outline-success btn-sm w-100" data-btn="addCardBtn" data-id="${item.id}"> 加入購物車 <i
                                class="fa-solid fa-cart-shopping ps-2"></i></button>
                            </div>
                            <div class="col-lg-6 mb-2">
                                <button type="button" class="btn btn-success btn-sm w-100" data-btn="likes" data-id="${item.id}"> 加入收藏 <i class="fa-solid fa-heart ps-2"></i> </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div class="col-md-8 itemContent">
                    <h2 class="fw-bolder h1 mainFontColor">${item.title}</h2>
                    <small class="mainColor fw-lighter smallFS">${item.sub_title}</small>
                    <p class="lh-lg fw-light my-3">
                    ${item.description1}
                    </p>
                    <img src="${item.product_imgurl1}" alt="${item.category}">
                    <p class="lh-lg fw-light my-3">
                        ${item.description2}
                    </p>
                    <div class="row">
                        <div class="col-sm-6">
                            <img class="imgShader" src="${item.product_imgurl21}" alt="${item.category}">
                        </div>
                        <div class="col-sm-6">
                            <img class="imgShader" src="${item.product_imgurl22}" alt="${item.category}">
                        </div>
                    </div>
                    <p class="lh-lg fw-light my-3">
                        ${item.description3}
                    </p>
                    <div class="row gx-2">
                        <div class="col-sm-6">
                            <img src="${item.product_imgurl31}" alt="sample">
                            <small class="fw-light smallFS">${item.sample_text31}</small>
                        </div>
                        <div class="col-sm-6">
                        <img src="${item.product_imgurl32}" alt="sample">
                            <small class="fw-light smallFS">${item.sample_text32}</small>
                        </div>
                        <div class="col-sm-6">
                        <img src="${item.product_imgurl33}" alt="sample">
                            <small class="fw-light smallFS">${item.sample_text33}</small>
                        </div>                        
                    </div>
                </div>
                `
    })
    .catch(function (error) {
        console.log(error);
    })

/* 點擊加入收藏列表 */
window.onload = function () {
    productItem.addEventListener("click", addLike);
    productItem.addEventListener("click", quantity);
    productItem.addEventListener("click", addCartList)
}
let likeList = [];
getLikeList()
function getLikeList() {
    axios.get(`${base_url}/600/users/${localId}/likes?_expand=product`, {
        headers: {
            "authorization": `Bearer ${localJWT}`
        }
    })
        .then(function (response) {
            likeList = response.data;
        })
        .catch(function (error) {
            console.log(error.response.data);
        })
}
function addLike(e) {
    let btn = e.target.dataset.btn;
    if (btn !== "likes") {
        return
    };
    let productId = e.target.getAttribute('data-id');
    console.log(productId);

    try {
        likeList.forEach(item => {
            if (productId === item.productId) {
                sweet2Error(`已經在收藏中，不做重複加入囉！ ･ᴥ･`);
                throw new Error("Endlterative");
            }
        });
    } catch (e) {
        if (e.message != Endlterative) throw e;
    }
    axios.post(`${base_url}/600/users/${localId}/likes?_expand=product`,
        {
            "productId": productId
        }, {
        headers: {
            "authorization": `Bearer ${localJWT}`
        }
    })
        .then(function (response) {
            //console.log(response.data);
            sweet2Success(`加入收藏 ･ᴥ･`);
            getLikeList();
        })
        .catch(function (error) {
            console.log(error.response.data);
            sweet2Error(`${error.response.data}`)
        });
}

/* +1 || -1 */
function quantity(e) {
    let btn = e.target.dataset.btn;
    let number = e.target.parentNode.querySelector('.number').value;
    let count = Number(number);
    if (btn === "add") {
        count += 1
    }
    if (btn === "remove" && count > 1) {
        count -= 1
    }
    e.target.parentNode.querySelector('.number').value = count;
}

/* 點擊加入購物車 */
function addCartList(e) {
    let btn = e.target.dataset.btn;
    if (btn !== "addCardBtn") {
        return
    };

    // 確認購物車內容
    let cartList = [];

    axios.get(`${base_url}/600/users/${localId}/carts?_expand=product`, {
        headers: {
            "authorization": `Bearer ${localJWT}`
        }
    })
        .then(function (response) {

            // 1-先取得購物車明細
            cartList = response.data;

            let productId = e.target.dataset.id;
            let number = e.target.parentNode.parentNode.querySelector('.number').value;
            let count = Number(number);

            // 2-確認購物車有沒有同產品 id 資料
            let checkproduct = 0;
            cartList.forEach(item => {
                let orderId = item.id;

                // 2-1 相同產品 id 做 patch(db.json會轉字串，留意型態)
                if (item.productId == productId) {
                    checkproduct++;
                    count += item.quantity;
                    axios.patch(`${base_url}/600/carts/${orderId}`,
                        {
                            "quantity": count
                        }, {
                        headers: {
                            "authorization": `Bearer ${localJWT}`
                        }
                    })
                        .then(function (response) {
                            // console.log(response.data);
                            sweet2Success(`加入購物車 ･ᴥ･`);
                            e.target.parentNode.parentNode.querySelector('.number').value = 1;
                        })
                        .catch(function (error) {
                            console.log(error.response.data);
                        })
                }
            });

            // 2-2 沒有產品 id 做 post
            if (checkproduct === 0) {
                let obj = {};
                obj.productId = Number(productId);
                obj.quantity = count;
                obj.userId = Number(localId);
                axios.post(`${base_url}/600/carts?_expand=product`, obj, {
                    headers: {
                        "authorization": `Bearer ${localJWT}`
                    }
                })
                    .then(function (response) {
                        console.log(response.data);
                        sweet2Success(`加入購物車 ･ᴥ･`);
                        e.target.parentNode.parentNode.querySelector('.number').value = 1;
                    })
                    .catch(function (error) {
                        console.log(error.response.data);
                    })
            }
        })
        .catch(function (error) {
            console.log(error.response.data);
        })
}

