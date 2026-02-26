const btn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);

if (btn) {
    btn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

const form = document.getElementById('formCadastro');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            price: parseFloat(document.getElementById('price').value),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value
        };

        try {
            const res = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Produto salvo com sucesso!");
                window.location.href = '../produtos/produtos.html';
            } else {
                alert("Erro ao salvar o produto.");
            }
        } catch (error) {
            console.error("Erro no servidor:", error);
        }
    });
}

const lista = document.getElementById('listaProdutos');
if (lista) {
    async function fetchProducts() {
        try {
            const res = await fetch('http://localhost:3000/products');
            const products = await res.json();

            if (products.length === 0) {
                lista.innerHTML = '<p class="slogan">Nenhum produto encontrado no estoque.</p>';
                return;
            }

            lista.innerHTML = products.map(p => `
                <div class="card">
                    <h3>${p.name}</h3>
                    <p><strong>Categoria:</strong> ${p.category}</p>
                    <p>${p.description}</p>
                    <span class="price-tag">R$ ${p.price}</span>
                    <div class="actions">
                        <button class="btn-edit" onclick="goToEdit(${p.id})">Editar</button>
                        <button class="btn-delete" onclick="deleteProduct(${p.id})">Apagar</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            lista.innerHTML = '<p class="slogan">Erro ao conectar ao servidor.</p>';
            console.error("Erro na requisição:", error);
        }
    }
    fetchProducts();
}

function goToEdit(id) {
    window.location.href = `../edicao/edicao.html?id=${id}`;
}

const formEdicao = document.getElementById('formEdicao');
if (formEdicao) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    async function loadProductData() {
        if (!productId) return;
        try {
            const res = await fetch(`http://localhost:3000/products/${productId}`);
            if (res.ok) {
                const product = await res.json();
                document.getElementById('edit-name').value = product.name;
                document.getElementById('edit-price').value = product.price;
                document.getElementById('edit-category').value = product.category;
                document.getElementById('edit-description').value = product.description;
            } else {
                alert("Erro ao carregar dados do produto.");
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }

    loadProductData();

    formEdicao.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById('edit-name').value,
            price: parseFloat(document.getElementById('edit-price').value),
            category: document.getElementById('edit-category').value,
            description: document.getElementById('edit-description').value
        };

        try {
            const res = await fetch(`http://localhost:3000/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Produto atualizado com sucesso!");
                window.location.href = '../produtos/produtos.html';
            } else {
                alert("Erro ao atualizar o produto.");
            }
        } catch (error) {
            console.error("Erro no servidor:", error);
        }
    });
}

async function deleteProduct(id) {
    if (!confirm("Tem certeza que deseja apagar este produto?")) return;

    try {
        const res = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert("Produto deletado com sucesso!");
            location.reload(); // Refresh the list
        } else {
            const errorData = await res.json();
            alert("Erro ao deletar produto: " + (errorData.message || "Erro desconhecido"));
        }
    } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao conectar ao servidor.");
    }
}