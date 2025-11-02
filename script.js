// 4 sản phẩm sổ tay 
const PRODUCTS = [
  { id: 1, name: 'sổ tay my little note',   price: 35000, image: 'note_book1.jpg', sales: 300, stock: 200 },
  { id: 2, name: 'note for better days',    price: 45000, image: 'note_book3.jpg', sales: 180, stock: 50 },
  { id: 3, name: 'nhật ký be gentle',       price: 39900, image: 'note_book4.jpg', sales: 120, stock: 40 },
  { id: 4, name: 'note "things i wanna do"',price: 49900, image: 'note_book5.jpg', sales: 90,  stock: 35 }
];

const grid = document.getElementById('grid');
const sortSelect = document.getElementById('sort');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const closeCart = document.getElementById('closeCart');

// Giỏ hàng: array chứa { product, quantity }
let cart = [];

// Load giỏ hàng từ localStorage
function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    cart = JSON.parse(saved);
    updateCartUI();
  }
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Tìm sản phẩm trong giỏ hàng
function findCartItem(productId) {
  return cart.findIndex(item => item.product.id === productId);
}

function formatVND(n){
  return n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
function productCard(p){
  const inCart = findCartItem(p.id) !== -1;
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
          <button class="btn ${inCart ? 'btn-added' : ''}" data-add-cart="${p.id}" type="button">
            ${inCart ? '✓ Đã thêm' : 'Thêm vào giỏ hàng'}
          </button>
          <button class="btn secondary" data-view="${p.id}" type="button">Xem</button>
        </div>
      </div>
    </article>`;
}
function render(list){ 
  grid.innerHTML = list.map(productCard).join(''); 
}

// Render lại sản phẩm sau khi load cart để cập nhật trạng thái nút
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

// Thêm vào giỏ hàng
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const index = findCartItem(productId);
  if (index !== -1) {
    // Nếu đã có, tăng số lượng
    cart[index].quantity++;
  } else {
    // Nếu chưa có, thêm mới
    cart.push({ product, quantity: 1 });
  }

  saveCart();
  render(PRODUCTS); // Re-render để cập nhật nút
}

// Xóa khỏi giỏ hàng
function removeFromCart(productId) {
  const index = findCartItem(productId);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart();
    render(PRODUCTS); // Re-render để cập nhật nút
  }
}

// Cập nhật số lượng
function updateQuantity(productId, delta) {
  const index = findCartItem(productId);
  if (index !== -1) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
    }
  }
}

// Tính tổng số lượng sản phẩm
function getTotalItems() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Tính tổng tiền
function getTotalPrice() {
  return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

// Cập nhật UI giỏ hàng
function updateCartUI() {
  // Cập nhật badge số lượng
  const total = getTotalItems();
  cartCount.textContent = total;
  cartCount.style.display = total > 0 ? 'block' : 'none';

  // Hiển thị danh sách sản phẩm
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <p>Giỏ hàng của bạn đang trống</p>
      </div>
    `;
    cartFooter.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.product.name}</h4>
          <p class="cart-item-price">${formatVND(item.product.price)}</p>
          <div class="cart-item-controls">
            <button class="qty-btn" data-qty-dec="${item.product.id}">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-qty-inc="${item.product.id}">+</button>
          </div>
        </div>
        <div class="cart-item-total">
          <span>${formatVND(item.product.price * item.quantity)}</span>
          <button class="cart-item-remove" data-remove="${item.product.id}" aria-label="Xóa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
    cartFooter.style.display = 'block';
    cartTotal.textContent = formatVND(getTotalPrice());
  }
}

// Xử lý click events
document.addEventListener('click', (e)=>{
  // Thêm vào giỏ hàng
  const addCart = e.target.closest('[data-add-cart]');
  if(addCart){
    const productId = +addCart.dataset.addCart;
    addToCart(productId);
    addCart.textContent = '✓ Đã thêm';
    addCart.classList.add('btn-added');
    setTimeout(()=> {
      if (findCartItem(productId) !== -1) {
        addCart.textContent = '✓ Đã thêm';
      } else {
        addCart.textContent = 'Thêm vào giỏ hàng';
        addCart.classList.remove('btn-added');
      }
    }, 1000);
    return;
  }

  // Xóa khỏi giỏ hàng
  const remove = e.target.closest('[data-remove]');
  if(remove){
    const productId = +remove.dataset.remove;
    removeFromCart(productId);
    return;
  }

  // Tăng số lượng
  const qtyInc = e.target.closest('[data-qty-inc]');
  if(qtyInc){
    updateQuantity(+qtyInc.dataset.qtyInc, 1);
    return;
  }

  // Giảm số lượng
  const qtyDec = e.target.closest('[data-qty-dec]');
  if(qtyDec){
    updateQuantity(+qtyDec.dataset.qtyDec, -1);
    return;
  }

  // Xem sản phẩm
  const view = e.target.closest('[data-view]');
  if(view){
    const productId = +view.dataset.view;
    alert(`Xem chi tiết sản phẩm: ${PRODUCTS.find(p => p.id === productId)?.name}`);
    return;
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

// Mở/Đóng giỏ hàng
cartBtn?.addEventListener('click', () => {
  cartSidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
});

closeCart?.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
});

cartSidebar?.querySelector('.cart-overlay')?.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
});

// Load giỏ hàng khi trang tải
loadCart();

