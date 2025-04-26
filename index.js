import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = 3000;

app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      }
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const products = [];

    const productElements = document.querySelectorAll('[data-component-type="s-search-result"]');
    productElements.forEach(product => {
      const title = product.querySelector('h2 a span')?.textContent || 'Sem título';
      const rating = product.querySelector('.a-icon-star-small span')?.textContent || 'Sem avaliação';
      const reviews = product.querySelector('.a-size-base')?.textContent || 'Sem número de avaliações';
      const image = product.querySelector('img.s-image')?.src || '';

      products.push({ title, rating, reviews, image });
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

