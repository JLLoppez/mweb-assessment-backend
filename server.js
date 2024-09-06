const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); // Using axios instead of node-fetch

const app = express();

app.use(cors());

// Products JSON file
const products = require('./public/products.json');

const logoBaseURL = "https://www.mweb.co.za/media/images/providers";
const logoURL = "http://localhost:5000/img";

const providerInfo = [
  { code: 'centurycity', name: 'Century City Connect', url: `${logoBaseURL}/provider-century.png` },
  { code: 'evotel', name: 'Evotel', url: `${logoBaseURL}/provider-evotel.png` },
  { code: 'octotel', name: 'Octotel', url: `${logoBaseURL}/provider-octotel.png` },
  { code: 'vumatel', name: 'Vumatel', url: `${logoBaseURL}/provider-vuma.png` },
  { code: 'openserve', name: 'Openserve', url: `${logoBaseURL}/provider-openserve.png` },
  { code: 'frogfoot', name: 'Frogfoot', url: `${logoBaseURL}/provider-frogfoot.png` },
  { code: 'mfn', name: 'MFN', url: `${logoBaseURL}/provider-metrofibre.png` },
  { code: 'vodacom', name: 'Vodacom', url: `${logoBaseURL}/provider-vodacom.png` },
  { code: 'linkafrica', name: 'Link Africa', url: `${logoBaseURL}/provider-linkafrica.png` },
  { code: 'linklayer', name: 'Link Layer', url: `${logoBaseURL}/provider-link-layer.png` },
  { code: 'lightstruck', name: 'Lightstruck', url: `${logoBaseURL}/provider-lightstruck.png` },
  { code: 'mitchells', name: 'Mitchells Fibre', url: `${logoBaseURL}/provider-mitchells.png` },
  { code: 'vumareach', name: 'Vuma Reach', url: `${logoBaseURL}/provider-vuma.png` },
  { code: 'balwin', name: 'balwin', url: `${logoURL}/balwin-logo.png` },
  { code: 'webconnect', name: 'Web Connect', url: `${logoBaseURL}/provider-vuma.png` },
  { code: 'ttconnect', name: 'TT Connect', url: `${logoURL}/TTconnect.png` },
  { code: 'thinkspeed', name: 'Thinkspeed', url: `${logoURL}/thinkspeed.jpg?v=1` },
  { code: 'nova', name: 'NOVA', url: `${logoURL}/nova.png` },
  { code: 'air', name: 'Air', url: `${logoURL}/air.png` },
  { code: 'clearaccess', name: 'ClearAccess', url: `${logoURL}/clearaccess.png` },
  { code: 'zoomfibre', name: 'ZoomFibre', url: `${logoURL}/Zoom-Fibre.webp` },
];

// Serve static files from the 'img' directory
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/providers', (req, res) => {
  res.json(providerInfo);
});

app.get('/api/products/:provider', (req, res) => {
  const providerParam = req.params.provider.toLowerCase();

  // Find the provider in providerInfo by matching the code
  const matchedProvider = providerInfo.find(p => p.code.toLowerCase() === providerParam);

  if (!matchedProvider) {
    return res.status(404).json({ error: 'Provider not found' });
  }

  // Filter products based on the provider's name
  const providerName = matchedProvider.name.toLowerCase();
  const providerProducts = products.filter(product => product.provider.toLowerCase() === providerName);

  if (providerProducts.length > 0) {
    res.json(providerProducts);
  } else {
    res.status(404).json({ error: 'No products found for this provider' });
  }
});



// New endpoint for filtering products by price range
app.get('/api/products', (req, res) => {
  const { priceRanges } = req.query; // Expecting priceRanges as a comma-separated string

  if (!priceRanges) {
    return res.status(400).json({ error: 'Price ranges are required' });
  }

  const ranges = priceRanges.split(',');

  // Function to check if a product falls within the selected price ranges
  const isProductInRange = (product) => {
    return ranges.some((range) => {
      switch (range) {
        case 'R0 - R699':
          return product.productRate >= 0 && product.productRate <= 699;
        case 'R700 - R999':
          return product.productRate >= 700 && product.productRate <= 999;
        case 'R1000+':
          return product.productRate >= 1000;
        default:
          return false;
      }
    });
  };

  const filteredProducts = products.filter(isProductInRange);

  if (filteredProducts.length > 0) {
    res.json(filteredProducts);
  } else {
    res.status(404).json({ error: 'No products found for the selected price ranges' });
  }
});

app.get('/api/campaigns', async (req, res) => {
  const campaignsURL = 'https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public';
  
  try {
    const response = await axios.get(campaignsURL);
    res.json(response.data.campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
