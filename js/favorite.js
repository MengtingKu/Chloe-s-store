var hiddenProperty = 'hidden' in document ? 'hidden' :    
        'webkitHidden' in document ? 'webkitHidden' :    
        'mozHidden' in document ? 'mozHidden' :    
        null;
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    var onVisibilityChange = function(){
        if (!document[hiddenProperty]) {    
            getLikeList()   
        }    
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
// js 怎样判断用户是否在浏览当前页面 (https://blog.csdn.net/wang1006008051/article/details/117740870)


const favoriteList = document.querySelector('.favoriteList');

/* 收藏列表 */
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
            console.log(likeList);
            if (likeList.length >= 1) {
                document.querySelector('.noData').classList.add("d-none");
                deleteAll.disabled = false
            } else {
                document.querySelector('.noData').classList.remove("d-none");
                deleteAll.disabled = true
            }
            let str = "";
            likeList.forEach(item => {
                console.log(item.product.id);
                str += `
                <li class="row border rounded-3 gx-5 mb-4 shadow-sm">
                    <!-- 左側照片 -->
                    <div class="col-md-3 flex-shrink-0 d-flex align-items-center">
                        <a href="productItem1.html?id=${item.product.id}" class="goodsImg">
                            <img src="${item.product.cart_likes_imgurl}" class="img-fluid rounded-3" alt="goods">
                        </a>
                    </div>
                    <!-- 右側商品文案 -->
                    <div class="col-md-8 goodsContent">
                        <div class="flex-grow-1">
                            <h5 class="card-title h4 my-3 mb-4 mainFontColor fw-bold"> ${item.product.title}</h5>
                            <p class="card-text fw-light subFontColor lh-lg my-3">
                                ${item.product.description1}
                            </p>
                        </div>
                        <div class="ms-auto my-4">
                            <button type="button" class="btn btn-outline-warning w-100" data-id="${item.id}">
                            移除收藏 <i class="fa-solid fa-trash-can ps-2"></i>
                            </button>
                        </div>
                    </div>
                </li>
                `
            });
            favoriteList.innerHTML = str;
        })
        .catch(function (error) {
            console.log("error");
            console.log(error.response.data);
            if (error.response.data === "jwt expired") {
                sweet2Error(`時間到！請登出後重新登入！`)
            }
        })
}

/* 刪除單個品項收藏 */
favoriteList.addEventListener("click", function (e) {
    console.log(e.target.dataset.id);
    let likeListId = e.target.dataset.id;
    if (likeListId !== undefined) {
        axios.delete(`${base_url}/likes/${likeListId}`)
            .then(function (response) {
                console.log(response.status);
                if (response.status === 200) {
                    sweet2Success(`成功移除收藏 ʕ·͡ˑ·ཻʔ ･ᴥ･`);
                    getLikeList()
                }
            })
            .catch(function (error) {
                console.log(error.response.data);
            })
    }
})

/* 刪除全部收藏 */
const deleteAll = document.querySelector('.deleteAll');
deleteAll.addEventListener("click", function () {
    likeList.forEach(item => {
        console.log(item.id);
        let id = item.id;
        axios.delete(`${base_url}/likes/${id}`)
            .then(function (response) {
                if (response.status === 200) {
                    sweet2Success(`已經把所有收藏移除囉！ 
                    ʕ·͡ˑ·ཻʔ ･ᴥ･`);
                    getLikeList();
                    deleteAll.setAttribute("disabled","disabled")
                }
            })
            .catch(function (error) {
                console.log(error.response.data);
            })
    });
})