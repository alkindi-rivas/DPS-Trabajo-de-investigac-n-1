// Definición de clase Producto
class Producto {
  // Constructor
  constructor(id, nombre, precio, stock, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.imagen = imagen;
  }

  // Metodo para verificar disponibilidad
  enStock(cantidad) {
    return this.stock >= cantidad;
  }

  // Metodo para actualizar inventario
  actualizarStock(cantidad) {
    this.stock -= cantidad;
  }
}

// Stock de productos

const inventario = [
  new Producto(1,"Combo de pulseras de perlas", 15, 10, "images/articulo_1.jpeg",),
  new Producto(2, "Pulsera de perlas", 8.5, 15, "images/articulo_2.jpeg"),
  new Producto(3, "Combo de pulsera feliz", 13.5, 9, "images/articulo_3.jpeg"),
  new Producto(4, "Pulsera feliz", 7.5, 5, "images/articulo_4.jpeg"),
  new Producto(5, "Combo de pulsera de colores", 18.5, 13, "images/articulo_5.jpeg"),
  new Producto(6, "Pulsera de reina", 10.25, 7, "images/articulo_6.jpeg"),
  new Producto(7, "Combo de pulsera de amistad", 12, 5, "images/articulo_7.jpeg"),
  new Producto(8, "Combo de pulsera sencilla", 10.5, 8, "images/articulo_8.jpeg"),
  new Producto(9, "Pulsera de rey", 10.25, 6, "images/articulo_9.jpeg"),
  new Producto(10, "Pulsera de viaje", 10.25, 3, "images/articulo_10.jpeg"),
  new Producto(11, "Combo de pulsera amatista", 13.5, 17, "images/articulo_11.jpeg"),
];

// Carrito vacio
let carrito = [];

// Funcion para mostrar los carritos en la vista del usuario

function mostrarProductos() {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  inventario.forEach((producto) => {
    contenedor.innerHTML += `
            <article class="product-card">
                <div class="badge-stock">Stock: ${producto.stock}</div>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h4>${producto.nombre}</h4>
                <p class="product-price">$${producto.precio.toFixed(2)}</p>
                <button class="btn-add" onclick="agregarCarrito(${producto.id})" 
                    ${producto.stock === 0 ? "disabled" : ""}>
                    ${producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
                </button>
            </article>
        `;
  });
}

mostrarProductos();

// Funcion para agregar productos al carrito

function agregarCarrito(id){
    const producto = inventario.find(p => p.id === id); // Busqueda del producto en el inventario

    // Control de stock

    if(producto && producto.stock > 0){
        producto.stock--; // Resta al stock del producto

        const productoEnCarrito = carrito.find(item => item.id === id);

        if(productoEnCarrito){
            productoEnCarrito.cantidad++; // Si el producto ya esta en el carrito se suma la cantidad que desea comprar el usuario en 1
        }else{
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            })
        }

        actualizarInterfaz();
    } else {
        alert("Este artículo está agotado.")
    }
}

// Función para eliminar y actualizar datos

function eliminarCarrito(id){
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1){
        // Actualizo el producto cuando se elimina del carrito
        const cantidadOriginal = inventario.find(p => p.id === id);
        cantidadOriginal.stock += carrito[index].cantidad;

        carrito.splice(index, 1); // Vacio el carrito
        actualizarInterfaz();
    }
}

function actualizarInterfaz(){

    mostrarProductos(); // Actualizo el catalogo de productos

    const listaCarrito = document.getElementById('cart-items-container');
    listaCarrito.innerHTML = '';

    let subtotal = 0;

    // For each para que cada producto se imprima en el carrito
    carrito.forEach(item =>{
        const totalPorProducto = item.precio * item.cantidad;
        subtotal += totalPorProducto;

        listaCarrito.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.nombre}</strong><br>
                    ${item.cantidad} x $${item.precio.toFixed(2)}
                </div>
                <div class="aqua-text">$${totalPorProducto.toFixed(2)}</div>
                <span class="btn-remove" onclick="eliminarCarrito(${item.id})">X</span>
            </div>
        `;
    })

    // Calculo de IVA y total de compra
    const iva = subtotal * 0.13;
    const total = subtotal + iva;

    document.getElementById('subtotal-val').innerText = subtotal.toFixed(2);

    if(document.getElementById('tax-val')) document.getElementById('tax-val').innerText = iva.toFixed(2);
    document.getElementById('price-total').innerText = total.toFixed(2);
}


// Generar factura

function procesarCompra(){
    if(carrito.length == 0){
        alert("El carrito está vacio. Primero selecciona un producto.")
        return;
    }

    const seccionFactura = document.getElementById('factura-section');
    const detalleFactura = document.getElementById('factura-detalle');

    seccionFactura.style.display = 'flex';

    // Creando estructura de factura
    let tablaHtml = `
        <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="border-bottom: 2px solid var(--aqua); text-align: left;">
                    <th style="padding: 10px;">Producto</th>
                    <th>Cant.</th>
                    <th>P. Unit</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    let subtotalFinal = 0;

    // Recorriendo cada producto con su informacion
    carrito.forEach(item => {
        const totalProducto = item.precio * item.cantidad;
        subtotalFinal += totalProducto;
        tablaHtml += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>$${totalProducto.toFixed(2)}</td>
            </tr>
        `;
    });

    // Mostrando impuestos + total de factura
    const impuesto = subtotalFinal * 0.13;
    const totalGeneral = subtotalFinal + impuesto;
    tablaHtml += `
            </tbody>
        </table>
        <div style="margin-top: 20px; text-align: right; line-height: 1.8;">
            <p>Subtotal: <strong>$${subtotalFinal.toFixed(2)}</strong></p>
            <p>IVA (13%): <strong>$${impuesto.toFixed(2)}</strong></p>
            <h3 class="aqua-text" style="font-size: 24px;">Total a Pagar: $${totalGeneral.toFixed(2)}</h3>
        </div>
    `;

    detalleFactura.innerHTML = tablaHtml;
}

// Funcion para que el usuario siga comprando

function nuevaCompra(){
    carrito = []; // Vacio el carrito para una nueva compra

    document.getElementById('factura-section').style.display = 'none';
    actualizarInterfaz();

    alert("¡Gracias por su compra! Puede seguir comprando en Mimi Joyas.");
}