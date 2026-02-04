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
                </div>
            `).join('');
        } catch (error) {
            lista.innerHTML = '<p class="slogan">Erro ao conectar ao servidor.</p>';
            console.error("Erro na requisição:", error);
        }
    }
    fetchProducts();
}