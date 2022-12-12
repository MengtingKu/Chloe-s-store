const cartableList = document.querySelector(".cartableList");
let cartList = [];
getCartList()
function getCartList() {
    axios.get(`${base_url}/600/users/${localId}/carts?_expand=product`, {
        headers: {
            "authorization": `Bearer ${localJWT}`
        }
    })
        .then(function (response) {
            cartList = response.data;
            if (cartList.length >= 1) {
                document.querySelector('.noProduct').classList.add("d-none");
            } else {
                document.querySelector('.noProduct').classList.remove("d-none");
            }
            let str = "";
            cartList.forEach(item => {
                console.log(item);
                str += `
                <tr class="border-bottom">
                                <td class="d-flex justify-content-md-evenly align-items-center">
                                    <a class="subColor" href="#" data-title="${item.product.title}" data-id="${item.id}" data-bs-toggle="modal"
                                        data-bs-target="#removeModal" aria-label="product">
                                        <i class="fa-solid fa-trash-can p-1 fa-xl"></i>
                                    </a>
                                    <a href="productItem1.html?id=${item.product.id}" target="_blank">
                                        <img class="ms-2" src="${item.product.cart_likes_imgurl}" alt="${item.product.category}" width="88%">
                                    </a>
                                </td>
                                <td> ${item.product.title}</td>
                                <td class="price"> ${toThousands(item.product.price)}</td>
                                <td>
                                <div class="input-group input-group-sm">
                                    <button class="input-group-text material-icons fs-5" data-btn="add">
                                    add
                                    </button>
                                    <input class="form-control form-control-sm text-center number" type="text" placeholder="1" min="1" value="${item.quantity}">
                                    <button class="input-group-text material-icons fs-5" data-btn="remove">
                                    remove
                                    </button>
                                </div>
                                </td>
                                <td class="text-end">$ <span class="itemTotalCost">${toThousands(item.quantity * item.product.price)}</span></td>
                            </tr>
                `
            });
            cartableList.innerHTML = str
        })
        .catch(function (error) {
            console.log(error);
        })
}

window.onload = function () {
    cartableList.addEventListener("click", quantity)
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
