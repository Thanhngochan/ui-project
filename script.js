// 4 sản phẩm sổ tay 
const PRODUCTS = [
  { id: 1, name: 'sổ tay my little note',   price: 35000, image: 'note_book1.jpg', sales: 300, stock: 200 },
  { id: 2, name: 'note for better days',    price: 45000, image: 'note_book3.jpg', sales: 180, stock: 50 },
  { id: 3, name: 'nhật ký be gentle',       price: 39900, image: 'note_book4.jpg', sales: 120, stock: 40 },
  { id: 4, name: 'note “things i wanna do”',price: 49900, image: 'note_book5.jpg', sales: 90,  stock: 35 }
];

const grid = document.getElementById('grid');
const sortSelect = document.getElementById('sort');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
let cart = 0;

function formatVND(n){
  return n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
function productCard(p){
  return `
    <article class="card" data-name="${p.name}" data-price="${p.price}" data-created="${p.id}"
             data-sales="${p.sales||0}" data-stock="${p.stock||0}">
      <div class="media">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="content">
        <h3 class="name">${p.name}</h3>
        <div class="price"><span>${formatVND(p.price)}</span></div>
        <div class="actions">
          <button class="btn" data-add="${p.id}" type="button">Mua ngay</button>
          <button class="btn secondary" data-view="${p.id}" type="button">Xem</button>
        </div>
      </div>
    </article>`;
}
function render(list){ grid.innerHTML = list.map(productCard).join(''); }
render(PRODUCTS);

// Sorting
sortSelect.addEventListener('change', e => {
  const v = e.target.value;
  let sorted = [...PRODUCTS];
  if(v === 'best')        sorted.sort((a,b)=> (b.sales||0) - (a.sales||0));
  if(v === 'price-asc')   sorted.sort((a,b)=> a.price - b.price);
  if(v === 'price-desc')  sorted.sort((a,b)=> b.price - a.price);
  if(v === 'name-asc')    sorted.sort((a,b)=> a.name.localeCompare(b.name));
  if(v === 'name-desc')   sorted.sort((a,b)=> b.name.localeCompare(a.name));
  if(v === 'oldest')      sorted.sort((a,b)=> a.id - b.id);
  if(v === 'newest')      sorted.sort((a,b)=> b.id - a.id);
  if(v === 'stock-desc')  sorted.sort((a,b)=> (b.stock||0) - (a.stock||0));
  render(sorted);
});

// Grid toggle
document.querySelectorAll('.grid-toggle button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.grid-toggle button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cols = +btn.dataset.cols;
    grid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  });
});

// Search realtime
document.getElementById('q').addEventListener('input', (e)=>{
  const keyword = e.target.value.toLowerCase();
  const filtered = PRODUCTS.filter(p=> p.name.toLowerCase().includes(keyword));
  render(filtered);
});

// Add to cart (demo)
document.addEventListener('click', (e)=>{
  const add = e.target.closest('[data-add]');
  if(add){
    cart++;
    cartCount.textContent = cart;
    add.textContent = 'Đã thêm ✓';
    setTimeout(()=> add.textContent = 'Mua ngay', 900);
  }
});

// Menu hamburger
const menuBtn = document.getElementById('menuBtn');
const navbar = document.querySelector('.navbar-minimal');
menuBtn?.addEventListener('click', ()=>{
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  navbar.classList.toggle('open');
});

