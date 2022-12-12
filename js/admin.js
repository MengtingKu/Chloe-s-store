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
        console.log(newDataChart1);
        let chart1 = c3.generate({
            bindto: '#chart1', // HTML 元素綁定
            data: {
                type: "pie",
                columns: newDataChart1,
            },
        });
    }
}
init()

