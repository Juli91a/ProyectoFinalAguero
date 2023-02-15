fetch("./productos.JSON")
    .then(respuesta => respuesta.json())
    .then(datos => ejecucionPrograma(datos))
    .catch(error => console.log(error))
function ejecucionPrograma(productos) {

    let cajaProductos = document.querySelector(".cajaProductos")
    let cajaCarrito = document.querySelector(".carrito")
    let inpBuscar = document.getElementById("inputBuscar")
    let btnRopa = document.getElementById("botonRopa")
    let btnTecnologia = document.getElementById("botonTecnologia")
    let btnLimpiar = document.getElementById("limpiar")
    let carrito = []
    let btnComprar = document.getElementById("comprar")

    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        renderizarCarrito(carrito)
    }

    renderizar(productos)

    inpBuscar.addEventListener('input', () => {
        let arrayProductos = productos.filter(producto =>
            producto.nombre.toLocaleLowerCase().includes(inpBuscar.value.toLocaleLowerCase()) ||
            producto.categoria.toLocaleLowerCase().includes(inpBuscar.value.toLocaleLowerCase()))
        renderizar(arrayProductos)
    })

    btnComprar.onclick = () => {
        localStorage.clear()
        carrito = []
        renderizarCarrito(carrito)
        Toastify({
            text: "Compra realizada",
            duration: 2000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
    }

    btnRopa.onclick = () => {
        let arrayRopa = productos.filter(producto =>
            producto.categoria.includes("Ropa"))
        renderizar(arrayRopa)
        inpBuscar.value = ""
    }
    btnTecnologia.onclick = () => {
        let arrayTecnologia = productos.filter(producto =>
            producto.categoria.includes("Tecnologia"))
        renderizar(arrayTecnologia)
        inpBuscar.value = ""
    }
    btnLimpiar.onclick = () => {
        renderizar(productos)
        inpBuscar.value = ""
    }


    function renderizar(productos) {
        cajaProductos.innerHTML = ""
        productos.forEach(producto => {
            let tarjetaProducto = document.createElement("div")
            tarjetaProducto.classList.add("tarjeta")
            tarjetaProducto.innerHTML = `
            <img src=${producto.imgUrl} />
            <h3>${producto.nombre}</h3>
            <h4>$${producto.precio}</p>
            <button id=${producto.id}>Agregar al carrito</button>
            `
            cajaProductos.append(tarjetaProducto)
            let btnAgregar = document.getElementById(producto.id)
            btnAgregar.onclick = agregarAlCarrito
        })

    }
    function agregarAlCarrito(e) {
        let id = e.target.id
        let productoBuscado = productos.find(producto => producto.id == id)
        let productoEnCarrito = carrito.find(producto => producto.id == productoBuscado.id)

        if (productoEnCarrito) {
            let posicionProducto = carrito.findIndex(producto => producto == productoEnCarrito)
            carrito[posicionProducto].unidades++
            carrito[posicionProducto].subtotal = carrito[posicionProducto].precio * carrito[posicionProducto].unidades
        } else {
            productoBuscado.unidades = 1
            productoBuscado.subtotal = productoBuscado.precio
            carrito.push(productoBuscado)
        }

        renderizarCarrito(carrito)
        guardarInfo(carrito)
        Toastify({
            text: "Agregado correctamente",
            duration: 1500,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
    }

    function renderizarCarrito(productosEnCarrito) {
        cajaCarrito.innerText = ""
        productosEnCarrito.forEach(producto => {
            let tarjetaProducto = document.createElement("div")
            tarjetaProducto.innerHTML += `
        <h3>${producto.nombre}</h3>
        <p>Unidades: ${producto.unidades}</p>
        <p>Sub total: ${producto.subtotal}</p>
        `
            cajaCarrito.appendChild(tarjetaProducto)
        })

    }
    function guardarInfo(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
}