const fs = require('fs');

// //blocking
// //read input.txt
// const data = fs.readFileSync('./myFile/input.txt', 'utf8')
// console.log(data);
// console.log("End of the file");

// //write output.txt
// const outputText = `Hello Node.js\n${data}\nไฟล์ถูกเขียนเมื่อ ${new Date()}`
// fs.writeFileSync('./myFile/output.txt', outputText)
// console.log("Write file successfully");

//non-blocking
fs.readFile('./myFile/input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(data)
    const outputText = `Hello Node.js\n${data}\nไฟล์ถูกเขียนเมื่อ ${new Date()}`
    fs.writeFile('./myFile/output.txt', outputText, (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log("Write file successfully");
    })
})
console.log("End of the file");