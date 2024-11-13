const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fechar modal do carrinho
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

// Adicionar ao carrinho
menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Função que adiciona ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartModal();
}

// Atualizar o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="text-black font-medium">
                    <p class="text-black font-medium">Nome: ${item.name}</p>
                    <p class="text-black">Quantidade: ${item.quantity}</p>
                    <p class="text-black font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-btn" data-name="${item.name}">Remover</button>
            </div>`;

        total += item.price * item.quantity;
        itemCount += item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    cartCounter.innerHTML = itemCount;
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

// Converter endereço para maiúsculas e validar
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-500");
    }
    addressInput.value = addressInput.value.toUpperCase();
});

// ENVIAR PEDIDO PARA O WHATSAPP
checkoutBtn.addEventListener("click", function() {
   const isOpen = checkRest();
    if (!isOpen) {
        alert("Restaurante Fechado no momento!");
        return;
    }

    if (cart.length === 0) return;

    // Captura os valores de número e bairro no momento do clique
    const pessoa = document.getElementById('pessoa').value;
    const cep = document.getElementById('cep').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const address = document.getElementById('address').value; // Corrigido para .value



    if (addressInput.value === "" || payment.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Recalcular o total do pedido
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity; // Somando o preço total de todos os itens no carrinho
    });

    // Cria os itens do carrinho para a mensagem, agora com o preço total de cada item
    const cartItems = cart.map((item) => {
        const itemTotal = (item.price * item.quantity).toFixed(2); // Calculando o preço total por item
        return `*${item.name}*\n*Quantidade:* ${item.quantity} | *Preço Unitário: R$* ${item.price.toFixed(2)} \n | *Preço Total*: R$ ${itemTotal}\n`; // Exibindo o preço total de cada item em negrito
    }).join("\n");

    // Definir a mensagem inicial, incluindo o total do pedido
    let message = `*Pedido de:* ${pessoa}\n\n${cartItems}\n*Endereço de Entrega:*\n${address}, Nº ${numero}, Bairro: ${bairro}, CEP: ${cep}\n\n*Total a Pagar:* ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n*Método de Pagamento*: ${payment.value}\n\n\n`;
    // Adiciona o valor do troco se o método de pagamento for "Dinheiro"
if (payment.value === "Dinheiro") {
    const trocoValor = document.getElementById("troco-valor").value;
    
    // Verifica se um valor foi inserido para o troco
    if (trocoValor && parseFloat(trocoValor) > 0) {
        message += `\n*Troco para: R$* ${parseFloat(trocoValor).toFixed(2)}`;
    } else {
        message += `\n*Troco não especificado*`; // Mensagem caso o valor de troco não seja preenchido
    }
}
    const encodedMessage = encodeURIComponent(message);
    const phone = "+5521986473364"; // Altere para o número desejado

    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
});




// Verificar a hora de funcionamento
function checkRest() {
  const data = new Date();
   const hora = data.getHours();
    return hora >= 10 && hora <= 15;
 }

// Exibir status de funcionamento
const spanItem = document.getElementById("date-span");
const isOpen = checkRest();
if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-600");
}

// Aguarda o DOM ser carregado
const changeContainer = document.getElementById("change-container");

// Evento que verifica o método de pagamento selecionado
payment.addEventListener("change", function () {
    if (payment.value === "Dinheiro") {
        // Exibe o campo de troco se a opção "Dinheiro" for selecionada
        changeContainer.classList.remove("hidden");
    } else {
        // Oculta o campo de troco para outras opções
        changeContainer.classList.add("hidden");
    }
});

// CEP CARREGAR AUTOMÁTICO



const preencherForm = (endereco) => {
    if (endereco.erro) {
        alert("CEP não encontrado. Verifique e tente novamente.");
        return;
    }
    document.getElementById('address').value = endereco.logradouro || "";
    document.getElementById('bairro').value = endereco.bairro || "";

}
// Função para pesquisar o CEP e preencher o endereço automaticamente
const pesquisarCep = async() => {
    const cep = document.getElementById('cep').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length !== 8) {
        alert("Por favor, insira um CEP válido.");
        return;
    }
    
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    try {
        const dados = await fetch(url);
        const endereco = await dados.json();
        preencherForm(endereco);
    } catch (error) {
        alert("Erro ao buscar o CEP. Tente novamente.");
    }
};

// Evento para pesquisar CEP ao perder o foco do campo
document.getElementById('cep').addEventListener('focusout', pesquisarCep);

