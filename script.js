const PRODUCTS = [
  { id: 1, name: 'Camiseta Premium', description: 'Qualidade superior', price: 129.90, icon: '👕', sizeType: 'shirt', image: 'murk_ben_a-removebg-preview.png', additionalImages: ['myrkbensa-removebg-preview.png'] },
  { id: 2, name: 'Tênis Exclusivo', description: 'Edição limitada', price: 699.90, icon: '👟', sizeType: 'shoe', image: 'nb1906r-removebg-preview.png', additionalImages: ['nb1906r2-removebg-preview.png', 'nb1906r3-removebg-preview.png'] },
  { id: 3, name: 'Calça Essencial', description: 'Corte moderno', price: 189.90, icon: '👖', sizeType: 'pants', image: 'shein3-removebg-preview.png', additionalImages: ['sheincalca-removebg-preview.png', 'sheincalca2-removebg-preview.png'] },
  { id: 4, name: 'Produto Deluxe', description: 'Máximo conforto e durabilidade', price: 799.90, icon: '👑', sizeType: 'shoe', image: 'mihara-removebg-preview.png', additionalImages: ['mihara2-removebg-preview.png', 'mihara3-removebg-preview.png'] },
  { id: 5, name: 'Produto Pro', description: 'Para profissionais exigentes', price: 249.90, icon: '🚀', sizeType: 'shirt', image: 'tonyboyshop2-removebg-preview.png', additionalImages: ['tonyboyshopveso-removebg-preview.png'] },
  { id: 6, name: 'Produto Classic', description: 'Estilo atemporal e confiável', price: 99.90, icon: '💎', sizeType: 'pants', image: 'shein2-removebg-preview.png', additionalImages: ['calcashein3-removebg-preview.png'] }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  loadCart();
  // delegação para botões de tamanho
  document.addEventListener('click', (e) => {
    if (e.target.matches('.size-btn')) {
      selectSize(e.target);
    }
  });
});

function renderProducts() {
  const grid = document.querySelector('.products-grid');
  grid.innerHTML = ''; // limpa antes de renderizar

  PRODUCTS.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';

    // montar markup do verso (chooser) dependendo do tipo
    let sizeBackHTML = '';
    if (product.sizeType === 'shirt') {
      sizeBackHTML = `
        <div class="size-chooser" aria-hidden="false">
          <div class="size-label">TAMANHO</div>
          <div class="sizes">
            <button class="size-btn" data-size="S">S</button>
            <button class="size-btn" data-size="M">M</button>
            <button class="size-btn" data-size="L">L</button>
            <button class="size-btn" data-size="XL">XL</button>
          </div>
        </div>
      `;
    } else if (product.sizeType === 'shoe') {
      sizeBackHTML = `
        <div class="size-chooser" aria-hidden="false">
          <div class="size-label">TAMANHO</div>
          <div class="sizes">
            ${[36,37,38,39,40,41,42,43,44].map(s => `<button class="size-btn" data-size="${s}">${s}</button>`).join('')}
          </div>
        </div>
      `;
    } else if (product.sizeType === 'pants') {
      const pants = [
        { size: 36, cm: 74 },
        { size: 38, cm: 78 },
        { size: 40, cm: 82 },
        { size: 42, cm: 86 },
        { size: 44, cm: 90 }
      ];
      sizeBackHTML = `
        <div class="size-chooser" aria-hidden="false">
          <div class="size-label">TAMANHO</div>
          <div class="sizes">
            ${pants.map(p => `<button class="size-btn" data-size="${p.size}">${p.size}<span style="font-weight:600;margin-left:6px;font-size:11px">(${p.cm}cm)</span></button>`).join('')}
          </div>
        </div>
      `;
    }

    // duplicate chooser for mobile (será mostrado abaixo do preço via CSS)
    const mobileSizeHTML = `<div class="mobile-size-chooser">${sizeBackHTML}</div>`;

    // photo-wrap: front (imagem/emoji) e back (chooser)
    const mediaHTML = product.image
      ? `<div class="card-media"><div class="photo-wrap">
           <div class="photo-front"><img class="product-photo" src="${product.image}" alt="${product.name}"></div>
           <div class="photo-back">${sizeBackHTML}</div>
         </div></div>`
      : `<div class="card-media"><div class="photo-wrap">
           <div class="photo-front"><div class="product-photo img">${product.icon}</div></div>
           <div class="photo-back">${sizeBackHTML}</div>
         </div></div>`;

    const infoHTML = `
      <div class="card-info">
        <div class="inner-card">
          <div>
            <div class="title">${product.name}</div>
            <div class="desc">${product.description}</div>
          </div>
          <div class="meta">
            <div class="price">R$ ${product.price.toFixed(2)}</div>
            ${mobileSizeHTML}
          </div>
        </div>
      </div>
    `;

    const buttonHTML = `
      <button class="card-btn outside-btn" onclick="addToCart(event, ${product.id})" aria-label="Adicionar ${product.name} ao carrinho">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path><path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path></svg>
      </button>
    `;

    card.innerHTML = mediaHTML + infoHTML + buttonHTML;

    // Add click-to-flip functionality for size selection only on non-mobile
    const cardMedia = card.querySelector('.card-media');
    if (window.innerWidth > 768) {
      cardMedia.addEventListener('click', () => {
        cardMedia.classList.toggle('flipped');
      });
    }

    // Add click handler to open product modal
    card.addEventListener('click', (e) => {
      // Prevent modal opening when clicking on size buttons or add to cart button
      if (e.target.closest('.size-btn') || e.target.closest('.card-btn')) {
        return;
      }
      openProductModal(product);
    });

    grid.appendChild(card);
  });
}

// seleciona botão de tamanho (aplica active)
function selectSize(btn) {
  const parent = btn.closest('.size-chooser') || btn.closest('.modal-size-chooser');
  if (!parent) return;
  parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Flip the card back to front after selecting size
  const cardMedia = btn.closest('.card-media');
  if (cardMedia && cardMedia.classList.contains('flipped')) {
    cardMedia.classList.remove('flipped');
  }
}

// adiciona ao carrinho incluindo tamanho (se selecionado)
// exige seleção de tamanho quando o produto tem sizeType definido
function addToCart(e, productId) {
  const btn = e.currentTarget || e.target;
  const card = btn.closest('.card');
  let selectedSize = null;

  const sizeBtn = card.querySelector('.size-btn.active');
  if (sizeBtn) selectedSize = sizeBtn.dataset.size;

  const sizeSelect = card.querySelector('.size-select');
  if (!selectedSize && sizeSelect) {
    selectedSize = sizeSelect.value || null;
  }

  const product = PRODUCTS.find(p => p.id === productId);

  // se o produto tem tipos de tamanho, obrigar seleção
  if (product.sizeType && !selectedSize) {
    // animação simples para chamar atenção ao chooser
    const chooser = card.querySelector('.photo-back .size-chooser') || card.querySelector('.inner-card .size-chooser');
    if (chooser) {
      chooser.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(-6px)' },
        { transform: 'translateY(0)' }
      ], { duration: 300, easing: 'ease' });
      chooser.classList.add('need-size');
      setTimeout(() => chooser.classList.remove('need-size'), 700);
    }
    alert('Por favor selecione um tamanho antes de adicionar ao carrinho.');
    return;
  }

  const existingItem = cart.find(item => item.id === productId && String(item.size) === String(selectedSize));

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1, size: selectedSize || null });
  }

  saveCart();
  updateBadge();
  renderCart();

  // Animação: botão fica verde por dentro ao adicionar
  btn.classList.add('added');
  setTimeout(() => btn.classList.remove('added'), 1000);
}

// remove do carrinho considerando tamanho
function removeFromCart(productId, size = null) {
  cart = cart.filter(item => !(item.id === productId && String(item.size) === String(size)));
  saveCart();
  updateBadge();
  renderCart();
}

// atualiza quantidade considerando tamanho
function updateQuantity(productId, size, quantity) {
  const item = cart.find(i => i.id === productId && String(i.size) === String(size));
  if (item) {
    if (quantity < 1) {
      removeFromCart(productId, size);
      return;
    }
    item.quantity = Math.max(1, quantity);
    saveCart();
    renderCart();
    updateBadge();
  }
}

function updateBadge() {
  const badge = document.querySelector('.cart-badge');
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const totalPrice = document.getElementById('totalPrice');
  
  cartItems.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0; font-weight: 500;">Carrinho vazio</p>';
    totalPrice.textContent = 'R$ 0.00';
    return;
  }
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const product = PRODUCTS.find(p => p.id === item.id);
    let sizeHTML = '';
    if (product && product.sizeType) {
      if (product.sizeType === 'shirt') {
        sizeHTML = `
          <div class="cart-size-section">
            <div class="size-label">TAMANHO</div>
            <div class="sizes">
              <button class="size-btn ${item.size === 'S' ? 'active' : ''}" data-size="S" onclick="changeCartItemSize(${item.id}, '${item.size}', 'S')">S</button>
              <button class="size-btn ${item.size === 'M' ? 'active' : ''}" data-size="M" onclick="changeCartItemSize(${item.id}, '${item.size}', 'M')">M</button>
              <button class="size-btn ${item.size === 'L' ? 'active' : ''}" data-size="L" onclick="changeCartItemSize(${item.id}, '${item.size}', 'L')">L</button>
              <button class="size-btn ${item.size === 'XL' ? 'active' : ''}" data-size="XL" onclick="changeCartItemSize(${item.id}, '${item.size}', 'XL')">XL</button>
            </div>
          </div>
        `;
      } else if (product.sizeType === 'shoe') {
        sizeHTML = `
          <div class="cart-size-section">
            <div class="size-label">TAMANHO</div>
            <div class="sizes">
              ${[36,37,38,39,40,41,42,43,44].map(s => `<button class="size-btn ${item.size == s ? 'active' : ''}" data-size="${s}" onclick="changeCartItemSize(${item.id}, '${item.size}', '${s}')">${s}</button>`).join('')}
            </div>
          </div>
        `;
      } else if (product.sizeType === 'pants') {
        const pants = [
          { size: 36, cm: 74 },
          { size: 38, cm: 78 },
          { size: 40, cm: 82 },
          { size: 42, cm: 86 },
          { size: 44, cm: 90 }
        ];
        sizeHTML = `
          <div class="cart-size-section">
            <div class="size-label">TAMANHO</div>
            <div class="sizes">
              ${pants.map(p => `<button class="size-btn ${item.size == p.size ? 'active' : ''}" data-size="${p.size}" onclick="changeCartItemSize(${item.id}, '${item.size}', '${p.size}')">${p.size}<span style="font-weight:600;margin-left:6px;font-size:11px">(${p.cm}cm)</span></button>`).join('')}
            </div>
          </div>
        `;
      }
    } else {
      sizeHTML = item.size ? `<div class="item-size" style="font-size:12px;color:#666;margin-top:4px;">Tamanho: ${item.size}</div>` : '';
    }

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-price">R$ ${item.price.toFixed(2)}</div>
        ${sizeHTML}
      </div>
      <div class="item-quantity">
        <button class="qty-btn" onclick='updateQuantity(${item.id}, ${JSON.stringify(item.size)}, ${item.quantity - 1})'>−</button>
        <span style="min-width: 20px; text-align: center; font-weight: 600;">${item.quantity}</span>
        <button class="qty-btn" onclick='updateQuantity(${item.id}, ${JSON.stringify(item.size)}, ${item.quantity + 1})'>+</button>
      </div>
      <span style="font-weight: 700; min-width: 70px; text-align: right;">R$ ${itemTotal.toFixed(2)}</span>
      <button class="remove-btn" onclick='removeFromCart(${item.id}, ${JSON.stringify(item.size)})'>🗑️</button>
    `;
    cartItems.appendChild(itemEl);
  });
  
  totalPrice.textContent = `R$ ${total.toFixed(2)}`;
}

function changeCartItemSize(productId, oldSize, newSize) {
  if (oldSize === newSize) return; // No change needed

  const itemIndex = cart.findIndex(item => item.id === productId && String(item.size) === String(oldSize));
  if (itemIndex === -1) return;

  const item = cart[itemIndex];
  const existingItem = cart.find(i => i.id === productId && String(i.size) === String(newSize));

  if (existingItem) {
    // Merge quantities if same product and new size already exists
    existingItem.quantity += item.quantity;
    cart.splice(itemIndex, 1); // Remove the old item
  } else {
    // Just update the size
    item.size = newSize;
  }

  saveCart();
  updateBadge();
  renderCart();
}

function openCart() {
  document.getElementById('cartModal').classList.add('active');
  renderCart();
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
}

function checkout() {
  if (cart.length === 0) {
    alert('❌ Carrinho vazio!');
    return;
  }
  // Redirecionar para a página de checkout
  window.location.href = 'checkout.html';
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    cart = JSON.parse(saved);
    updateBadge();
  }
}

function clearCart() {
  cart = [];
  saveCart();
  updateBadge();
  renderCart();
}

// Fechar carrinho ao clicar fora
document.getElementById('cartModal').addEventListener('click', (e) => {
  if (e.target.id === 'cartModal') closeCart();
});

// Product modal functions
let currentProduct = null;

function openProductModal(product) {
  currentProduct = product;
  const modal = document.getElementById('productModal');
  const mainImage = document.getElementById('mainProductImage');
  const thumbnailGallery = document.getElementById('thumbnailGallery');
  const productName = document.getElementById('modalProductName');
  const productDescription = document.getElementById('modalProductDescription');
  const productPrice = document.getElementById('modalProductPrice');
  const sizeSection = document.getElementById('modalSizeSection');

  // Set product details
  productName.textContent = product.name;
  productDescription.textContent = product.description;
  productPrice.textContent = `R$ ${product.price.toFixed(2)}`;

  // Set up image gallery
  const allImages = [product.image, ...(product.additionalImages || [])];
  mainImage.src = product.image;

  thumbnailGallery.innerHTML = '';
  allImages.forEach((imgSrc, index) => {
    const thumb = document.createElement('img');
    thumb.src = imgSrc;
    thumb.className = 'thumbnail-image' + (index === 0 ? ' active' : '');
    thumb.onclick = () => changeMainImage(imgSrc, thumb);
    thumbnailGallery.appendChild(thumb);
  });

  // Set up size selection
  let sizeHTML = '';
  if (product.sizeType === 'shirt') {
    sizeHTML = `
      <div class="modal-size-chooser">
        <div class="size-label">TAMANHO</div>
        <div class="sizes">
          <button class="size-btn" data-size="S">S</button>
          <button class="size-btn" data-size="M">M</button>
          <button class="size-btn" data-size="L">L</button>
          <button class="size-btn" data-size="XL">XL</button>
        </div>
      </div>
    `;
  } else if (product.sizeType === 'shoe') {
    sizeHTML = `
      <div class="modal-size-chooser">
        <div class="size-label">TAMANHO</div>
        <div class="sizes">
          ${[36,37,38,39,40,41,42,43,44].map(s => `<button class="size-btn" data-size="${s}">${s}</button>`).join('')}
        </div>
      </div>
    `;
  } else if (product.sizeType === 'pants') {
    const pants = [
      { size: 36, cm: 74 },
      { size: 38, cm: 78 },
      { size: 40, cm: 82 },
      { size: 42, cm: 86 },
      { size: 44, cm: 90 }
    ];
    sizeHTML = `
      <div class="modal-size-chooser">
        <div class="size-label">TAMANHO</div>
        <div class="sizes">
          ${pants.map(p => `<button class="size-btn" data-size="${p.size}">${p.size}<span style="font-weight:600;margin-left:6px;font-size:11px">(${p.cm}cm)</span></button>`).join('')}
        </div>
      </div>
    `;
  }
  sizeSection.innerHTML = sizeHTML;

  // Add event listeners to size buttons in modal
  const modalSizeBtns = sizeSection.querySelectorAll('.size-btn');
  modalSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => selectSize(btn));
  });

  modal.classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  currentProduct = null;
}

function changeMainImage(src, thumbElement) {
  const mainImage = document.getElementById('mainProductImage');
  const thumbnails = document.querySelectorAll('.thumbnail-image');

  mainImage.src = src;
  thumbnails.forEach(thumb => thumb.classList.remove('active'));
  thumbElement.classList.add('active');
}

function addToCartFromModal() {
  if (!currentProduct) return;

  let selectedSize = null;
  const sizeBtn = document.querySelector('#modalSizeSection .size-btn.active');
  if (sizeBtn) selectedSize = sizeBtn.dataset.size;

  // Check if size selection is required
  if (currentProduct.sizeType && !selectedSize) {
    alert('Por favor selecione um tamanho antes de adicionar ao carrinho.');
    return;
  }

  const existingItem = cart.find(item => item.id === currentProduct.id && String(item.size) === String(selectedSize));

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...currentProduct, quantity: 1, size: selectedSize || null });
  }

  saveCart();
  updateBadge();
  renderCart();

  // Close modal after adding to cart
  closeProductModal();

  // Show success feedback
  alert('Produto adicionado ao carrinho!');
}

// Close modal when clicking outside
document.getElementById('productModal').addEventListener('click', (e) => {
  if (e.target.id === 'productModal') closeProductModal();
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('productModal').classList.contains('active')) {
    closeProductModal();
  }
});

// About modal handlers
(function () {
  const aboutLink = document.querySelector('.nav-link[href="#sobre"]');
  const aboutModal = document.getElementById('aboutModal');
  const closeBtn = aboutModal?.querySelector('.about-close');

  function openAbout(e) {
    if (e) e.preventDefault();
    if (!aboutModal) return;
    aboutModal.classList.add('active');
    aboutModal.setAttribute('aria-hidden', 'false');
    // foco no botão de fechar para acessibilidade
    setTimeout(() => closeBtn?.focus(), 120);
  }

  function closeAbout() {
    if (!aboutModal) return;
    aboutModal.classList.remove('active');
    aboutModal.setAttribute('aria-hidden', 'true');
  }

  if (aboutLink) aboutLink.addEventListener('click', openAbout);
  if (closeBtn) closeBtn.addEventListener('click', closeAbout);

  // fechar clicando fora do cartão
  if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) closeAbout();
    });
  }

  // fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAbout();
  });
})();
