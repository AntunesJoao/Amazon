const searchBtn = document.getElementById('searchBtn');
const keywordInput = document.getElementById('keyword');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    alert('Por favor, digite uma palavra-chave!');
    return;
  }

  resultsDiv.innerHTML = 'Buscando...';

  try {
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const products = await response.json();

    resultsDiv.innerHTML = '';

    products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <h3>${product.title}</h3>
        <p>Classificação: ${product.rating}</p>
        <p>Avaliações: ${product.reviews}</p>
        <img src="${product.image}" alt="Imagem do produto">
      `;
      resultsDiv.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = 'Erro ao buscar produtos.';
  }
});