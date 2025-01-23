const connect = false
const url = "https://www.google.com"
const url2 = "https://www.facebook.com"
const url3 = "https://www.instagram.com"
const url4 = "https://www.twitter.com"

function downloading(url) {
    return new Promise((resolve, reject) => {
        console.log('Downloading Started');
        setTimeout(() => {
            if (connect) {
                resolve(`Downloading ${url} Success`);
            } else {
                reject('Connection Failed');
            }
        }, 2000)
    })
}

// downloading(url)
//     .then((data) => {
//         console.log(data);
//         return downloading(url2);
//     })
//     .then((data) => {
//         console.log(data);
//         return downloading(url3);
//     })
//     .then((data) => {
//         console.log(data);
//         return downloading(url4);
//     })
//     .catch((err) => {
//         console.log(err);
//     })

//Async & Await
async function start() {
    console.log(await downloading(url));
    console.log(await downloading(url2));
    console.log(await downloading(url3));
    console.log(await downloading(url4));
}
start()

//api ภาพสินค้า(backend) -> frontend (แสดงผล)
//api (promise) -> (pending) -> รอข้อมูลมาครบ (await) -> แสดงภาพ
//หน้า loading.... -> (แสดงผล)