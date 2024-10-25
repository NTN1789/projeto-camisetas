const productUrl = "https://empreender.nyc3.cdn.digitaloceanspaces.com/static/teste-prod-1.json";

fetch(productUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON');
        }
        return response.json();
    })
    .then(data => {
        renderProduct(data);
    })
    .catch(error => console.log("Erro ao carregar o JSON: ", error));

function renderProduct(product) {
    document.querySelector("[data-componente='titulo']").textContent = product.title;
    document.querySelector("[data-componente='imagem']").src = product.image_url;
    document.querySelector("[data-componente='comparado']").textContent = `R$ ${product.variants[0].price}`;

    const variantsLayout = document.querySelector(".produtos-variantes");
    variantsLayout.innerHTML = ''; 

    product.options.forEach((option, index) => {
        const variantDiv = document.createElement('div');
        variantDiv.classList.add("produto-select");

        const label = document.createElement("span");
        label.textContent = `${option}: `;


        const select = document.createElement("select");
        select.setAttribute("data-variant-type", option.toLowerCase());

        const values = product.variants.map(variant => variant.values[index]);
        const uniqueValues = [...new Set(values.flat())]; 

        uniqueValues.forEach(value => {
            const optionElement = document.createElement("option");
            optionElement.value = value;
            optionElement.textContent = value;
            select.appendChild(optionElement);
        });

        variantDiv.appendChild(label);
        variantDiv.appendChild(select);
        variantsLayout.appendChild(variantDiv);
    });

 
    document.querySelector(".btn-comprar").addEventListener("click", () => checkout(product));
}

function checkout(product) {
    const selectedOptions = Array.from(document.querySelectorAll(".produto-select select")).map(select => select.value); 
    const variant = product.variants.find(v => 
        v.values.every((value, i) => value === selectedOptions[i])
    );

    if (variant && variant.inventory_quantity > 0) {
        alert(`Compra do produto ${product.title} realizada com sucesso!`);            
    } else {
        alert(`Produto ${product.title} não disponível para a opção selecionada.`);
    }
}
