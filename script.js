/* ==========================================================================
   SCRIPT.JS - Portfolio Website
   --------------------------------------------------------------------------
   Isi file ini:
   1. Menandai bahwa JavaScript aktif
   2. Hamburger menu (mobile)
   3. Bayangan navbar saat halaman di-scroll
   4. Menyorot menu sesuai bagian yang sedang dilihat
   5. Animasi muncul saat scroll
   6. Tautan placeholder (href="#")
   7. Tahun otomatis di footer

   Catatan: Smooth scrolling saat menu diklik ditangani oleh CSS
   (properti scroll-behavior di style.css).
   Anda tidak perlu mengubah apa pun di file ini untuk mengganti konten.
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. Tandai bahwa JavaScript aktif.
   CSS memakai kelas "js" agar animasi scroll hanya berjalan
   jika JavaScript berfungsi (konten tidak akan tersembunyi jika JS mati).
   -------------------------------------------------------------------------- */
document.documentElement.classList.add("js");


/* --------------------------------------------------------------------------
   Elemen-elemen yang akan sering dipakai
   -------------------------------------------------------------------------- */
const header = document.querySelector(".site-header");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

// Apakah pengguna meminta animasi dikurangi (pengaturan aksesibilitas)?
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* --------------------------------------------------------------------------
   2. Hamburger menu (tampilan mobile)
   -------------------------------------------------------------------------- */

// Membuka atau menutup menu. Parameter "open" bernilai true (buka) atau false (tutup).
function setMenu(open) {
  navMenu.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
}

// Klik tombol hamburger: buka jika tertutup, tutup jika terbuka
navToggle.addEventListener("click", () => {
  setMenu(!navMenu.classList.contains("is-open"));
});

// Klik salah satu menu: tutup menu
navMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenu(false);
  }
});

// Klik di luar navbar: tutup menu
document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) {
    setMenu(false);
  }
});

// Tekan tombol Escape: tutup menu
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

// Jika layar diperlebar ke ukuran tablet/desktop, pastikan menu kembali normal
window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
  if (event.matches) {
    setMenu(false);
  }
});


/* --------------------------------------------------------------------------
   3. Bayangan navbar saat halaman di-scroll
   -------------------------------------------------------------------------- */
function updateHeaderShadow() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", updateHeaderShadow, { passive: true });
updateHeaderShadow(); // jalankan sekali saat halaman dibuka


/* --------------------------------------------------------------------------
   4. Menyorot menu sesuai bagian yang sedang dilihat
   Setiap <section> yang punya id akan diamati. Jika section memiliki
   atribut data-nav (contoh: Education memakai data-nav="about"),
   menu yang disorot adalah menu yang tertulis di data-nav tersebut.
   -------------------------------------------------------------------------- */
const sections = document.querySelectorAll("main section[id]");

// Buat daftar: id section -> elemen menu navbar-nya
const linkBySectionId = {};
navLinks.forEach((link) => {
  const id = link.getAttribute("href").slice(1); // "#about" menjadi "about"
  linkBySectionId[id] = link;
});

function highlightNav(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link === linkBySectionId[sectionId];
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          highlightNav(entry.target.dataset.nav || entry.target.id);
        }
      });
    },
    // Section dianggap "aktif" ketika melewati sekitar tengah layar
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}


/* --------------------------------------------------------------------------
   5. Animasi muncul saat scroll
   Elemen dengan kelas "reveal" akan muncul perlahan saat masuk ke layar.
   -------------------------------------------------------------------------- */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // cukup sekali saja
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  // Browser lama atau pengguna meminta tanpa animasi: tampilkan semuanya langsung
  revealElements.forEach((element) => element.classList.add("is-visible"));
}


/* --------------------------------------------------------------------------
   6. Tautan placeholder (href="#")
   Tombol "View Project" dan "Source Code" awalnya berisi href="#".
   Agar halaman tidak melompat ke atas saat diklik, klik tersebut diabaikan.
   Setelah Anda mengganti href dengan URL asli, kode ini tidak lagi berpengaruh.
   -------------------------------------------------------------------------- */
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});


/* --------------------------------------------------------------------------
   7. Tahun otomatis di footer
   -------------------------------------------------------------------------- */
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
