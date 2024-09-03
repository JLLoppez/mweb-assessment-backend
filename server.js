const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors()); 

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
  { code: 'air',  name: 'Air', url: `${logoURL}/air.png` },
  { code: 'clearaccess', name: 'ClearAccess', url: `${logoURL}/clearaccess.png` },
  { code: 'zoomfibre', name: 'ZoomFibre', url: `${logoURL}/Zoom-Fibre.webp` },
];
  
  
console.log('__dirname:', __dirname);
console.log('Static file path:', path.join(__dirname, 'img'));

// Serve static files from the 'img' directory
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use( express.static(path.join(__dirname, 'public')));

app.get('/api/providers', (req, res) => {
  res.json(providerInfo);
});

app.get('/api/products', (req, res) => {
    res.json(products);
  });
  

app.get('/api/campaigns', async (req, res) => {
  const campaignsURL = 'https://apigw.mweb.co.za/prod/baas/proxy/marketing/campaigns/fibre?channels=120&visibility=public';
  
  try {
    const response = await fetch(campaignsURL);
    const data = await response.json();
    res.json(data.campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

