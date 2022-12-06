/* 產品列表 */
const productWrap = document.querySelector('.productWrap');
let productList = [];
axios.get(`${base_url}/products`)
    .then(function (response) {
        console.log(response.data);
        productList = response.data;
        getProductList()
    })
    .catch(function (error) {
        console.log(error);
    })

/* 渲染產品列表 */
function getProductList() {
    let str = '';
    productList.forEach(item => {
        console.log(item);
        str += `
        <li class="col-md-6 mb-3">
                            <div class="card mb-2 border-0 shadow-sm bg-body rounded h-100">
                                <a href="productItem1?id=${item.id}" class="productImg">
                                    <img src="${item.productList_imgurl}" class="card-img-top" alt="產品圖片" height="250" data-num="${item.id}">
                                </a>
                                <div class="card-body mb-5">
                                    <h5 class="card-title text-center h5 fw-semibold py-2 mainFontColor productTitle">
                                        ${item.title}</h5>
                                    <p class="card-text fw-light mt-1 fs-6 text-center subFontColor lh-lg">
                                        ${item.sub_title}
                                    </p>

                                </div>
                                <div class="row mb-2 justify-content-evenly bg-white border-0 mb-3">
                                    <p class="card-text text-center mainFontColor fs-5 my-3"><strong>售價:</strong> ${toThousands(item.price)}
                                        <strong>元</strong>
                                    <div class="col-md-6">
                                        <div class="input-group input-group-sm">
                                            <button class="input-group-text material-icons fs-5" id="addon-wrapping">
                                                add
                                            </button>
                                            <input class="form-control text-center" type="text" placeholder="1">
                                            <button class="input-group-text material-icons fs-5" id="remove-wrapping">
                                                remove
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <button type="button" class="btn btn-outline-success w-100">加入購物車</button>
                                    </div>
                                    <div class="d-flex justify-content-end my-1">
                                        <a class="ps-2 mx-1 fs-5" href="#" aria-label="heart"><i
                                                class="fa-regular fa-heart"></i></a>
                                        <a class="ps-2 me-3 fs-5" href="#" aria-label="share"><i
                                                class="fa-solid fa-share-nodes text-success"></i></a>
                                    </div>
                                </div>
                            </div>
                        </li>`
    });
    productWrap.innerHTML = str
}






















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

/* 千分位 */
function toThousands(x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}