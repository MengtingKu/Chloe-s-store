const okOrder = document.querySelector(".okOrder");

// http://localhost:3000/600/orders?userId=10
axios.get(`${base_url}/600/orders?userId=${localId}`, {
    headers: {
        "authorization": `Bearer ${localJWT}`
    }
})
    .then(function (response) {
        let item = response.data;
        let lastOrder = item[item.length - 1];
        console.log(lastOrder);
        lastOrder.products.forEach(item => {
            console.log(item);
            okOrder.innerHTML += `
                        <tr class="border-bottom">
                            <td> ${item.title}</td>
                            <td class="text-end"> ${item.quantity}</td>
                            <td class="text-end">$ <span> ${toThousands(item.price * item.quantity)}</span></td>
                        </tr>
                `
        });
        document.querySelector(".finishCost").textContent = `${toThousands(lastOrder.payment)}`
        document.querySelector(".okOrderInf").innerHTML = `
            <tr class="border-bottom" height="50">
                            <th class="fw-bold" scope="row" width="30%">姓名</th>
                            <td>${lastOrder.info.username}</td>
                        </tr>
                        <tr class="border-bottom" height="50">
                            <th class="fw-bold" scope="row" width="30%">Email</th>
                            <td>${lastOrder.info.email}</td>
                        </tr>
                        <tr class="border-bottom" height="50">
                            <th class="fw-bold" scope="row" width="30%">電話</th>
                            <td>${lastOrder.info.tel}</td>
                        </tr>
                        <tr class="border-bottom" class="border-white" height="50">
                            <th class="fw-bold" scope="row" width="30%">地址</th>
                            <td>${lastOrder.info.address}</td>
                        </tr>
            `
    })
    .catch(function (error) {
        console.log(error);
    })
