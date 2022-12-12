// /* 產品列表 */
// const productWrap = document.querySelector('.productWrap');
// let productList = [];
// function init() {
//     axios.get(`${base_url}/products`)
//         .then(function (response) {
//             productList = response.data;
//             getProductList(productList);
//         })
//         .catch(function (error) {
//             console.log(error);
//         })
// }
// init()

// /* 渲染產品列表 */
// function getProductList(product) {
//     let str = '';
//     product.forEach(item => {
//         console.log(item);
//         str += `
//         <li class="col-md-6 mb-3">
//                             <div class="card mb-2 border-0 shadow-sm bg-body rounded h-100">
//                                 <a href="productItem1.html?id=${item.id}" class="productImg" target="_blank" rel="noopener">
//                                     <img src="${item.productList_imgurl}" class="card-img-top" alt="產品圖片" height="250" data-num="${item.id}">
//                                 </a>
//                                 <div class="card-body mb-2">
//                                     <h5 class="card-title text-center h5 fw-semibold py-2 mainFontColor productTitle">
//                                         ${item.title}</h5>
//                                     <p class="card-text fw-light mt-1 mb-2 fs-6 text-center subFontColor lh-lg">
//                                         ${item.sub_title}
//                                     </p>
//                                     <div class="row mb-2 justify-content-evenly bg-white border-0 mb-3">
//                                     <p class="card-text text-center mainFontColor fs-5 mt-5 mb-3"><strong>售價:</strong> ${toThousands(item.price)}
//                                         <strong>元</strong>
//                                     </p>
//                                     <div class="col-md-6 my-2">
//                                         <div class="input-group input-group-sm">
//                                             <button class="input-group-text material-icons fs-5 add">
//                                                 add
//                                             </button>
//                                             <input class="form-control text-center" type="text" placeholder="1">
//                                             <button class="input-group-text material-icons fs-5 remove">
//                                                 remove
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <div class="col-md-6 my-2">
//                                         <button type="button" class="btn btn-outline-success w-100" data-id="${item.id}">加入購物車 <i class="fa-solid fa-cart-plus"></i></button>
//                                     </div>
//                                     <div class="col-md-6"></div>
//                                     <div class="col-md-6 d-flex justify-content-end">
//                                     <button class="btn btn-outline-success w-50" type="button" title="share">
//                                     分享 <i class="fa-solid fa-share-nodes"></i>
//                                 </button>
//                                 <button class="btn btn-outline-success likes ms-1 w-50" type="button" title="likes" data-btn="likes" data-id="${item.id}">
//                                     收藏 <i class="fa-solid fa-heart"></i>
//                                 </button>
//                                     </div>
//                                 </div>
//                                 </div>
                                
//                             </div>
//         </li>`
//     });
//     productWrap.innerHTML = str;
// }

// /* 搜尋功能 */
// btnSearch = document.querySelector("#btnSearch");
// btnSearch.addEventListener("click", function () {
//     keywordSearch();
// })
// function keywordSearch() {
//     let keyword = document.querySelector("#searchArea").value.trim().toLowerCase();
//     let targetProduct = [];
//     targetProduct = productList.filter(function (item) {
//         let title = item.title.toLowerCase();
//         return title.match(keyword);
//     });
//     console.log(targetProduct);
//     getProductList(targetProduct)
// }

// /* 點擊加入收藏列表 */
// window.onload = function () {

//     productWrap.addEventListener("click", function (e) {
//         let btn = e.target.dataset.btn;
//         if (btn !== "likes") {
//             return
//         };
//         let productId = e.target.getAttribute('data-id');
//         console.log(productId);
//         likeList.forEach(item => {
            
//         });
//     })

// }


// const favoriteList = document.querySelector('.favoriteList');
// /* 收藏列表 */
// let likeList = [];
// function getLikeList() {
//     axios.get(`${base_url}/600/users/${localId}/likes?_expand=product`, {
//         headers: {
//             "authorization": `Bearer ${localJWT}`
//         }
//     })
//         .then(function (response) {
//             likeList = response.data;
//             console.log(likeList);
//             if (likeList.length >= 1) {
//                 document.querySelector('.noLikeList').classList.add("d-none");
//             } else {
//                 document.querySelector('.noLikeList').classList.remove("d-none");
//             }
//             let str = "";
//             likeList.forEach(item => {
//                 console.log(item.product);
//                 str += `
//                 <li class="row border rounded-3 gx-5 mb-4 shadow-sm">
//                     <!-- 左側照片 -->
//                     <div class="col-md-3 flex-shrink-0 d-flex align-items-center">
//                         <a href="productItem1.html?id=${item.id}" class="goodsImg">
//                             <img src="${item.product.cart_likes_imgurl}" class="img-fluid rounded-3" alt="goods">
//                         </a>
//                     </div>
//                     <!-- 右側商品文案 -->
//                     <div class="col-md-8 goodsContent">
//                         <div class="flex-grow-1">
//                             <h5 class="card-title h4 my-3 mb-4 mainFontColor fw-bold"> ${item.product.title}</h5>
//                             <p class="card-text fw-light subFontColor lh-lg my-3">
//                                 ${item.product.description1}
//                             </p>
//                         </div>
//                         <div class="ms-auto my-4">
//                             <button type="button" class="btn btn-outline-warning  w-100">
//                             移除收藏 <i class="fa-solid fa-trash-can ps-2"></i>
//                             </button>
//                         </div>
//                     </div>
//                 </li>
//                 `
//             });
//             favoriteList.innerHTML = str
//         })
//         .catch(function (error) {
//             console.log(error.response.data);
//             sweet2Error(`${error.response.data}`)
//         })
// }
// getLikeList()



