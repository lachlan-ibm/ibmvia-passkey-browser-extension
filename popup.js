document.addEventListener("DOMContentLoaded", runFunction);
console.log("DOM is loaded");

function runFunction() {
    let button = document.getElementById("clickme");

    button.addEventListener("click", function () {
        console.log("Clicked button");
        document.body.style.backgroundColor = "#90e0ef";
    })
}
console.log("sskdskd")



