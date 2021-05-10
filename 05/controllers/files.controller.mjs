import { fileExplorer } from '../services/explorer.service.mjs';
import { urlParser } from '../services/explorer.service.mjs';

export default async (req, res) => {
  try {
    const parsedUrl = await urlParser(req.url);
    const {isFile, data} = await fileExplorer(parsedUrl);
    
    res.setHeader('Content-Type', 'text/html');
    return res.end(JSON.stringify({isFile, data}));
  } catch (err) {
    res.statusCode = 400;
    return res.end('Bad query');
  }
};
