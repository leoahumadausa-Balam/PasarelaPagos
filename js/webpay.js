// Lógica del simulador de Webpay Plus
document.addEventListener('DOMContentLoaded', () => {
    // Formateador de moneda para peso chileno (CLP)
    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(valor);
    };

    // Obtener datos del checkout
    const checkoutDataRaw = localStorage.getItem('a1click_checkout_data');
    if (!checkoutDataRaw) {
        // Redirigir si no hay datos
        window.location.href = 'index.html';
        return;
    }

    const checkoutData = JSON.parse(checkoutDataRaw);
    
    // Generar o asignar Número de Orden
    if (!checkoutData.orderNumber) {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        checkoutData.orderNumber = `A1C-${randomNum}`;
        localStorage.setItem('a1click_checkout_data', JSON.stringify(checkoutData));
    }

    // Elementos del DOM
    const payAmountEl = document.getElementById('pay-amount');
    const orderNumberEl = document.getElementById('order-number');
    const form = document.getElementById('webpay-form');
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');
    const cardBrandIcon = document.getElementById('card-brand-icon');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingStatus = document.getElementById('loading-status');

    // Errores
    const cardError = document.getElementById('card-error');
    const expiryError = document.getElementById('expiry-error');
    const cvvError = document.getElementById('cvv-error');

    // Cargar datos en la UI
    payAmountEl.textContent = formatearMoneda(checkoutData.total);
    orderNumberEl.textContent = checkoutData.orderNumber;

    // Formateador y validador de número de tarjeta en tiempo real
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        
        // Formatear en bloques de 4 dígitos
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        e.target.value = formatted;

        // Detección de marca de tarjeta por primer dígito
        if (value.startsWith('4')) {
            cardBrandIcon.className = 'fa-brands fa-cc-visa input-icon';
            cardBrandIcon.style.color = '#00579f'; // Azul Visa
        } else if (value.startsWith('5')) {
            cardBrandIcon.className = 'fa-brands fa-cc-mastercard input-icon';
            cardBrandIcon.style.color = '#ff5f00'; // Naranja Mastercard
        } else if (value.startsWith('3')) {
            cardBrandIcon.className = 'fa-brands fa-cc-amex input-icon';
            cardBrandIcon.style.color = '#007bc1'; // Azul Amex
        } else {
            cardBrandIcon.className = 'fa-regular fa-credit-card input-icon';
            cardBrandIcon.style.color = '#909399';
        }
    });

    // Formateador de fecha de expiración MM/AA
    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        } else {
            e.target.value = value;
        }
    });

    // Permitir solo números en el CVV
    cardCvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    // Validar los campos del formulario
    const validarFormulario = () => {
        let esValido = true;

        // Validar Tarjeta (16 dígitos sin contar espacios)
        const rawCard = cardNumberInput.value.replace(/\s+/g, '');
        if (rawCard.length !== 16) {
            cardNumberInput.closest('.form-group').classList.add('error');
            esValido = false;
        } else {
            cardNumberInput.closest('.form-group').classList.remove('error');
        }

        // Validar Expiración (formato MM/AA, mes 1-12, año >= actual)
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(cardExpiryInput.value)) {
            cardExpiryInput.closest('.form-group').classList.add('error');
            esValido = false;
        } else {
            cardExpiryInput.closest('.form-group').classList.remove('error');
        }

        // Validar CVV (3 dígitos)
        if (cardCvvInput.value.length !== 3) {
            cardCvvInput.closest('.form-group').classList.add('error');
            esValido = false;
        } else {
            cardCvvInput.closest('.form-group').classList.remove('error');
        }

        return esValido;
    };

    // Envío de Formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        // Si es válido, simular procesamiento
        loadingOverlay.classList.add('active');
        loadingStatus.textContent = "Conectando con Transbank...";

        // Secuencia de estados de carga
        setTimeout(() => {
            loadingStatus.textContent = "Autorizando pago con su banco...";
        }, 1000);

        setTimeout(() => {
            loadingStatus.textContent = "¡Pago Exitoso! Redirigiendo...";
            
            // Guardar confirmación en localStorage
            checkoutData.status = 'approved';
            checkoutData.date = new Date().toISOString();
            localStorage.setItem('a1click_checkout_data', JSON.stringify(checkoutData));
            
            // Vaciar el carrito base para la tienda
            localStorage.removeItem('a1click_cart');
        }, 2200);

        setTimeout(() => {
            window.location.href = 'voucher.html';
        }, 3200);
    });
});
