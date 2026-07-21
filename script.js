function aman(namaKomponen, fn) {
    try {
        fn();
    } catch (err) {
        console.error("Gagal inisialisasi " + namaKomponen + ":", err);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // PINDAH HALAMAN
    // =========================
    function pindahHalaman(namaHalaman) {

        document.querySelectorAll(".page-view").forEach(function (el) {
            el.classList.remove("active");
        });

        const target = document.getElementById("page-" + namaHalaman);

        if (target) {
            target.classList.add("active");
        }

        document.querySelectorAll(".nav-link-page").forEach(function (link) {

            const aktif =
                link.getAttribute("data-page") === namaHalaman;

            link.classList.toggle("active", aktif);
            link.classList.toggle("text-white", aktif);
            link.classList.toggle("text-white-50", !aktif);

        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if ($("#navbarLinks").hasClass("show")) {
            $("#navbarLinks").collapse("hide");
        }

    }

    document.querySelectorAll("[data-page]").forEach(function (el) {

        el.addEventListener("click", function (e) {

            e.preventDefault();

            pindahHalaman(
                this.getAttribute("data-page")
            );

        });

    });

    // =========================
    // CAROUSEL
    // =========================

    aman("Carousel", function () {

        $(".carousel").carousel({
            interval: 4000,
            ride: "carousel"
        });

    });

    // =========================
    // VALIDASI FORM
    // =========================

    const form = document.getElementById("contactForm");

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const nama =
                document.getElementById("nama").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const pesan =
                document.getElementById("pesan").value.trim();

            if (nama === "" || email === "" || pesan === "") {

                alert("Semua data harus diisi.");

                return;

            }

            alert("Terima kasih. Pesan berhasil dikirim.");

            form.reset();

        });

    }

    // =========================
    // ANIMASI CARD PRODUK
    // =========================

    document.querySelectorAll(".card").forEach(function (card) {

        card.addEventListener("mouseenter", function () {

            this.style.transform = "translateY(-8px)";
            this.style.transition = ".3s";

        });

        card.addEventListener("mouseleave", function () {

            this.style.transform = "translateY(0px)";

        });

    });

    // =========================
    // TOMBOL HERO
    // =========================

    document.querySelectorAll(".btn[data-page]").forEach(function (btn) {

        btn.addEventListener("click", function (e) {

            e.preventDefault();

            pindahHalaman(
                this.getAttribute("data-page")
            );

        });

    });

});

// ==========================
// KERANJANG BELANJA
// ==========================

let cart = [];

function updateCart(){

    let list = document.getElementById("cartItems");

    let total = 0;

    list.innerHTML = "";

    cart.forEach(function(item,index){

        let subtotal = item.price * item.qty;

        total += subtotal;

        list.innerHTML += `

<li class="list-group-item">

<div class="d-flex justify-content-between">

<strong>${item.name}</strong>

<strong>Rp${subtotal.toLocaleString()}</strong>

</div>

<div class="mt-2 text-center">

<button class="btn btn-sm btn-danger"
onclick="kurangQty(${index})">-</button>

<span class="mx-3 font-weight-bold">
${item.qty}
</span>

<button class="btn btn-sm btn-success"
onclick="tambahQty(${index})">+</button>

</div>

</li>

`;

    });

    document.getElementById("cartCount").innerHTML = cart.length;

    document.getElementById("cartTotal").innerHTML =
    "Rp" + total.toLocaleString();

}

function tambahQty(index){

    cart[index].qty++;

    updateCart();

}

function kurangQty(index){

    cart[index].qty--;

    if(cart[index].qty <= 0){

        cart.splice(index,1);

    }

    updateCart();

}

document.querySelectorAll(".add-cart").forEach(function(btn){

btn.addEventListener("click",function(){

let nama = this.dataset.name;
let harga = Number(this.dataset.price);

let item = cart.find(p => p.name === nama);

if(item){

    item.qty++;

}else{

    cart.push({

        name:nama,
        price:harga,
        qty:1

    });

}

updateCart();

alert("Produk ditambahkan ke keranjang.");

});

});

$(document).on("click", "#checkoutWA", function () {

    if (cart.length === 0) {
        alert("Keranjang masih kosong.");
        return;
    }

    let pesan = "Halo Martabak Riki.%0A";
    pesan += "Saya ingin memesan:%0A%0A";

    let total = 0;

    cart.forEach(function(item){

        let subtotal = item.price * item.qty;

pesan +=
"• " + item.name +
" x" + item.qty +
" = Rp" + subtotal.toLocaleString() +
"%0A";

total += subtotal;

    });

    pesan += "%0A";
    pesan += "Total: Rp" + total.toLocaleString();

    let nomor = "628127617082";

    window.open(
        "https://wa.me/" + nomor + "?text=" + pesan,
        "_blank"
    );

});