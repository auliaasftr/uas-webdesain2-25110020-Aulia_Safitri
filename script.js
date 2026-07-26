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

// Load cart dari localStorage
function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
    updateCart();
}

// Save cart ke localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {

    let list = document.getElementById("cartItems");
    let total = 0;

    list.innerHTML = "";

    if (cart.length === 0) {
        list.innerHTML = `
            <li class="list-group-item text-center text-muted py-4">
                <i class="fas fa-shopping-cart fa-2x mb-2 d-block"></i>
                Keranjang masih kosong
            </li>
        `;
        document.getElementById("cartCount").innerHTML = "0";
        document.getElementById("cartTotal").innerHTML = "Rp0";
        return;
    }

    cart.forEach(function (item, index) {

        let subtotal = item.price * item.qty;
        total += subtotal;

        list.innerHTML += `

            <li class="list-group-item">

                <div class="d-flex justify-content-between align-items-center">

                    <div>
                        <strong>${item.name}</strong>
                        <br>
                        <small class="text-muted">Rp${item.price.toLocaleString()} × ${item.qty}</small>
                    </div>

                    <div class="text-right">
                        <strong class="text-warning">Rp${subtotal.toLocaleString()}</strong>
                        <br>
                        <button class="btn btn-sm btn-danger" onclick="kurangQty(${index})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-2 font-weight-bold">${item.qty}</span>
                        <button class="btn btn-sm btn-success" onclick="tambahQty(${index})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ml-1" onclick="hapusItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>

                </div>

            </li>

        `;

    });

    document.getElementById("cartCount").innerHTML = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cartTotal").innerHTML = "Rp" + total.toLocaleString();
    saveCart();

}

function tambahQty(index) {
    cart[index].qty++;
    updateCart();
}

function kurangQty(index) {
    cart[index].qty--;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

function hapusItem(index) {
    if (confirm("Hapus produk ini dari keranjang?")) {
        cart.splice(index, 1);
        updateCart();
    }
}

function kosongkanKeranjang() {
    if (cart.length === 0) {
        alert("Keranjang sudah kosong.");
        return;
    }
    if (confirm("Yakin ingin mengosongkan keranjang?")) {
        cart = [];
        updateCart();
        alert("Keranjang telah dikosongkan.");
    }
}

// Event listener untuk tombol "Tambah ke Keranjang"
document.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-cart");
    if (btn) {
        e.preventDefault();
        let nama = btn.dataset.name;
        let harga = Number(btn.dataset.price);

        let item = cart.find(p => p.name === nama);

        if (item) {
            item.qty++;
        } else {
            cart.push({
                name: nama,
                price: harga,
                qty: 1
            });
        }

        updateCart();
        alert("✅ " + nama + " ditambahkan ke keranjang!");
    }
});

// Checkout via WhatsApp
$(document).on("click", "#checkoutWA", function () {

    if (cart.length === 0) {
        alert("Keranjang masih kosong.");
        return;
    }

    let pesan = "Halo Martabak Riki.%0A";
    pesan += "Saya ingin memesan:%0A%0A";

    let total = 0;

    cart.forEach(function (item) {

        let subtotal = item.price * item.qty;
        pesan += "• " + item.name + " x" + item.qty + " = Rp" + subtotal.toLocaleString() + "%0A";
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

// Load cart saat halaman dimuat
loadCart();

