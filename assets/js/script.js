document.addEventListener('DOMContentLoaded', () => {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let productosOriginales = [];

  function actualizarContador() {
    const contador = document.getElementById('carrito-contador');
    contador.textContent = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  }

  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    mostrarCarrito();
  }

  function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
  }

  function mostrarCarrito() {
    const carritoDiv = document.querySelector('.carrito-lista');
    carritoDiv.innerHTML = '';
    let total = 0;
    carrito.forEach(prod => {
      total += prod.price * prod.cantidad;
      const item = document.createElement('div');
      item.className = 'carrito-item';
      item.innerHTML = `
        <span>${prod.title}</span>
        <input type="number" min="1" value="${prod.cantidad}" style="width:40px;" data-id="${prod.id}">
        <span>$${(prod.price * prod.cantidad).toFixed(2)}</span>
        <button data-id="${prod.id}" class="eliminar">Eliminar</button>
      `;
      carritoDiv.appendChild(item);
    });
    const totalDiv = document.getElementById('carrito-total');
    totalDiv.textContent = `Total: $${total.toFixed(2)}`;
  }

  // Modal carrito
  const carritoBtn = document.getElementById('carrito-btn');
  const carritoModal = document.getElementById('carrito-modal');
  const cerrarModal = document.querySelector('.carrito-cerrar');

  carritoBtn.addEventListener('click', () => {
    carritoModal.style.display = 'flex';
    mostrarCarrito();
  });
  cerrarModal.addEventListener('click', () => {
    carritoModal.style.display = 'none';
  });
  window.addEventListener('click', e => {
    if (e.target === carritoModal) carritoModal.style.display = 'none';
  });

  document.body.addEventListener('change', e => {
    if (e.target.matches('.carrito-item input[type="number"]')) {
      const id = Number(e.target.dataset.id);
      const prod = carrito.find(p => p.id === id);
      prod.cantidad = Number(e.target.value);
      guardarCarrito();
    }
  });

  document.body.addEventListener('click', e => {
    if (e.target.classList.contains('eliminar')) {
      const id = Number(e.target.dataset.id);
      carrito = carrito.filter(p => p.id !== id);
      guardarCarrito();
    }
  });

  function renderizarProductos(productos) {
    const productosContainer = document.querySelector('.productos-container');
    productosContainer.innerHTML = '';
    productos.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${producto.image}" alt="${producto.title}" style="width:100%;height:auto;margin-bottom:10px;">
        <h3>${producto.title}</h3>
        <p>${producto.description}</p>
        <p><strong>$${producto.price}</strong></p>
        <button class="agregar-carrito">Agregar al carrito</button>
      `;
      card.querySelector('.agregar-carrito').addEventListener('click', () => agregarAlCarrito(producto));
      productosContainer.appendChild(card);
    });
  }

  // --- Productos desde API ---
  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(productos => {
      productosOriginales = productos;
      renderizarProductos(productosOriginales);

      // Barra de búsqueda
      const inputBusqueda = document.getElementById('busqueda-productos');
      inputBusqueda.addEventListener('input', e => {
        const texto = e.target.value.toLowerCase();
        const filtrados = productosOriginales.filter(p =>
          p.title.toLowerCase().includes(texto) ||
          p.description.toLowerCase().includes(texto)
        );
        renderizarProductos(filtrados);
      });
    });

  // --- Reseñas desde archivo local ---
  fetch('assets/data/data.json')
    .then(response => response.json())
    .then(data => {
      const reseñasGrid = document.querySelector('.reseñas-grid');
      data.reseñas.forEach(reseña => {
        const div = document.createElement('div');
        div.className = 'reseña';
        div.innerHTML = `
          <h4>${reseña.autor}</h4>
          <p>${reseña.texto}</p>
        `;
        reseñasGrid.appendChild(div);
      });
    });

  // Inicializar contador y carrito
  actualizarContador();

  document.getElementById('vaciar-carrito').addEventListener('click', () => {
  carrito = [];
  guardarCarrito();
});
});