const timeline = document.querySelector('.timeline');
/* 篩選好物 */
let goods = [];
let hotGoods = [];
axios.get(`${base_url}/products`)
    .then(function (response) {
        goods = response.data;
        goods.forEach(item => {
            if (item.isgoods === true) {
                hotGoods.push(item)
            }
        });
        getHotGood()
    })
function getHotGood() {
    let str = '';
    hotGoods.forEach(item => {
        str += `
        <div class="row timeline-pointer">
                    <div class="col-md-6">
                        <img src="${item.productList_imgurl}" class="figure-img img-fluid rounded" alt="mask">
                    </div>
                    <div class="col-md-6 my-2 pt-3">
                        <div class="container">
                            <div class="row">
                                <h2 class="h3 fw-bold mb-3 mainFontColor phone-none">歡迎來到 Chloe 寶藏選品1 ← 快閃激推</h2>
                                <p class="fw-light subFontColor mb-2 lh-lg phone-none">
                                    ${item.description1}
                                </p>

                                <h3 class="h2 fw-bold my-3 mainFontColor"> ${item.title}</h3>
                                <p class="lh-lg fw-light mb-1 subFontColor">${item.description2}</p>
                                <div class="px-2">
                                    <a href="productItem1.html?id=${item.id}" class="btn btn-outline-success my-5 subColor">了解更多
                                        <i class="fa-solid fa-arrow-up-right-from-square ps-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
    });
    timeline.innerHTML = str
}

/* 產品列表 */
const productWrap = document.querySelector('.productWrap');
let productList = [];
function init() {
    axios.get(`${base_url}/products`)
        .then(function (response) {
            productList = response.data;
            getProductList(productList);
        })
        .catch(function (error) {
            console.log(error);
        })
}
init()

/* 渲染產品列表 */
function getProductList(product) {
    let str = '';
    product.forEach(item => {
        str += `
        <li class="col-md-6 mb-3">
                            <div class="card mb-2 border-0 shadow-sm bg-body rounded h-100">
                                <a href="productItem1.html?id=${item.id}" class="productImg" target="_blank" rel="noopener">
                                    <img src="${item.productList_imgurl}" class="card-img-top" alt="產品圖片" height="250" data-num="${item.id}">
                                </a>
                                <div class="card-body mb-2">
                                    <h5 class="card-title text-center h5 fw-semibold py-2 mainFontColor productTitle">
                                        ${item.title}</h5>
                                    <p class="card-text fw-light mt-1 mb-2 fs-6 text-center subFontColor lh-lg">
                                        ${item.sub_title}
                                    </p>
                                    <div class="row mb-2 justify-content-evenly bg-white border-0 mb-3">
                                    <p class="card-text text-center mainFontColor fs-5 mt-5 mb-3"><strong>售價:</strong> ${toThousands(item.price)}
                                        <strong>元</strong>
                                    </p>
                                    <div class="col-md-6 my-2">
                                        <div class="input-group input-group-sm">
                                            <button class="input-group-text material-icons fs-5" data-btn="add">
                                                add
                                            </button>
                                            <input class="form-control text-center number" type="text" placeholder="1" min="1" value="1">
                                            <button class="input-group-text material-icons fs-5" data-btn="remove">
                                                remove
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6 my-2">
                                        <button type="button" class="btn btn-outline-success w-100" data-btn="addCardBtn" data-id="${item.id}">加入購物車 <i class="fa-solid fa-cart-plus"></i></button>
                                    </div>
                                    <div class="col-md-6"></div>
                                    <div class="col-md-6 d-flex justify-content-end">
                                    <button class="btn btn-outline-success w-50" type="button" title="share">
                                    分享 <i class="fa-solid fa-share-nodes"></i>
                                </button>
                                <button class="btn btn-outline-success likes ms-1 w-50" type="button" title="likes" data-btn="likes" data-id="${item.id}">
                                    收藏 <i class="fa-solid fa-heart"></i>
                                </button>
                                    </div>
                                </div>
                                </div>
                                
                            </div>
        </li>`
    });
    productWrap.innerHTML = str;
}

/* 搜尋功能 */
btnSearch = document.querySelector("#btnSearch");
btnSearch.addEventListener("click", function () {
    keywordSearch();
})
function keywordSearch() {
    let keyword = document.querySelector("#searchArea").value.trim().toLowerCase();
    let targetProduct = [];
    targetProduct = productList.filter(function (item) {
        let title = item.title.toLowerCase();
        return title.match(keyword);
    });
    console.log(targetProduct);
    getProductList(targetProduct)
}

/* 點擊加入收藏列表 */
window.onload = function () {
    productWrap.addEventListener("click", addLike);
    productWrap.addEventListener("click", quantity);
    productWrap.addEventListener("click", addCartList)
}

function addLike(e) {
    let btn = e.target.dataset.btn;
    if (btn !== "likes") {
        return
    };
    let productId = e.target.getAttribute('data-id');
    try {
        likeList.forEach(item => {
            if (productId === item.productId) {
                sweet2Error(`已經在收藏中，不做重複加入囉！ ･ᴥ･`);
                throw new Error("Endlterative");
            }
        });
    } catch (e) {
        if (e.message !== Endlterative) throw e;
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

// throw new Error() 真实的用法和throw error 的方法(https://blog.csdn.net/JackieDYH/article/details/114941244)

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
    console.log(e.target.dataset.btn);
    let btn = e.target.dataset.btn;
    if (btn !== "addCardBtn") {
        return
    };
    let productId = e.target.dataset.id;
    let number = e.target.parentNode.parentNode.querySelector('.number').value;
    let count = Number(number);
    console.log(productId, number, count);
}