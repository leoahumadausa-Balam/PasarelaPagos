// Lógica del Comprobante / Voucher de Pago
document.addEventListener('DOMContentLoaded', () => {
    // Formateador de moneda para peso chileno (CLP)
    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(valor);
    };

    // Obtener datos del checkout desde localStorage
    const checkoutDataRaw = localStorage.getItem('a1click_checkout_data');
    if (!checkoutDataRaw) {
        // Redirigir si no hay datos de transacción
        window.location.href = 'index.html';
        return;
    }

    const checkoutData = JSON.parse(checkoutDataRaw);

    // Elementos del DOM
    const orderNumberVal = document.getElementById('order-number-val');
    const dateVal = document.getElementById('date-val');
    const itemsBody = document.getElementById('voucher-items-body');
    const subtotalVal = document.getElementById('subtotal-val');
    const ivaVal = document.getElementById('iva-val');
    const totalVal = document.getElementById('total-val');
    const verifCodeVal = document.getElementById('verif-code-val');
    const btnPrint = document.getElementById('btn-print');
    const btnHome = document.getElementById('btn-home');

    // Rellenar metadatos
    orderNumberVal.textContent = checkoutData.orderNumber || 'A1C-XXXXXX';
    if (verifCodeVal) {
        verifCodeVal.textContent = Math.floor(10000000 + Math.random() * 90000000);
    }
    
    // Formatear fecha
    if (checkoutData.date) {
        const fechaCompra = new Date(checkoutData.date);
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false
        };
        dateVal.textContent = fechaCompra.toLocaleDateString('es-CL', opciones);
    } else {
        dateVal.textContent = new Date().toLocaleDateString('es-CL');
    }

    // Rellenar tabla de productos
    if (checkoutData.items && checkoutData.items.length > 0) {
        itemsBody.innerHTML = checkoutData.items.map(item => {
            const totalFila = item.price * item.quantity;
            return `
                <tr>
                    <td>${item.quantity}x</td>
                    <td>${item.name}</td>
                    <td class="text-right font-mono">${formatearMoneda(item.price)}</td>
                    <td class="text-right font-mono">${formatearMoneda(totalFila)}</td>
                </tr>
            `;
        }).join('');
    } else {
        itemsBody.innerHTML = `<tr><td colspan="4" class="text-center">No hay productos en esta transacción.</td></tr>`;
    }

    // Rellenar subtotales y total
    subtotalVal.textContent = formatearMoneda(checkoutData.subtotal || 0);
    ivaVal.textContent = formatearMoneda(checkoutData.iva || 0);
    totalVal.textContent = formatearMoneda(checkoutData.total || 0);

    // Acción de Imprimir Comprobante
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // Acción de Volver al Inicio
    btnHome.addEventListener('click', () => {
        // Limpiar los datos del checkout pero conservar el catálogo para la próxima compra
        localStorage.removeItem('a1click_checkout_data');
        localStorage.removeItem('a1click_cart');
        window.location.href = 'index.html';
    });
});
