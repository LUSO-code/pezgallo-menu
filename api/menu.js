export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
  const hasGitHub = process.env.GITHUB_TOKEN;

  if (req.method === 'GET') {
    if (hasKV) {
      try {
        const response = await fetch(process.env.KV_REST_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['GET', 'pezgallo_menu'])
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.result) {
            const parsed = JSON.parse(resData.result);
            return res.status(200).json(parsed);
          }
        }
      } catch (e) {
        console.error('Error reading from Vercel KV:', e);
      }
    }

    // Fallback: If no KV data yet or not connected, return empty array so client uses static data
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    const { password, menuData } = req.body;

    if (password !== 'PGdeivid') {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // 1. Try Vercel KV if connected (RECOMMENDED - Instant sync)
    if (hasKV) {
      try {
        const response = await fetch(process.env.KV_REST_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['SET', 'pezgallo_menu', JSON.stringify(menuData)])
        });

        if (response.ok) {
          return res.status(200).json({ status: 'ok', message: 'Sincronizado con Vercel KV con éxito' });
        }
        
        const errText = await response.text();
        throw new Error(`Vercel KV respondió con error: ${errText}`);
      } catch (e) {
        console.error('Error saving to Vercel KV:', e);
        return res.status(500).json({ message: `Vercel KV falló: ${e.message}` });
      }
    }

    // 2. Try GitHub Auto-Commit as a fallback
    if (hasGitHub) {
      try {
        const owner = 'LUSO-code';
        const repo = 'pezgallo-menu';
        const path = 'src/data/menuData.js';
        const branch = 'master';

        const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
        const getRes = await fetch(getUrl, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Pezgallo-Admin-API'
          }
        });

        let sha = '';
        if (getRes.status === 200) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }

        const newContent = `export const menuData = ${JSON.stringify(menuData, null, 2)};\n`;
        const buffer = Buffer.from(newContent, 'utf-8');
        const contentBase64 = buffer.toString('base64');

        const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const putBody = {
          message: 'feat(admin): update menu data via admin dashboard',
          content: contentBase64,
          branch
        };
        if (sha) {
          putBody.sha = sha;
        }

        const putRes = await fetch(putUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Pezgallo-Admin-API'
          },
          body: JSON.stringify(putBody)
        });

        if (putRes.ok) {
          return res.status(200).json({ status: 'ok', message: 'Sincronizado con GitHub con éxito. El sitio se reconstruirá.' });
        }
        const errText = await putRes.text();
        throw new Error(`GitHub error: ${errText}`);

      } catch (error) {
        console.error('Failed saving to GitHub:', error);
        return res.status(500).json({ message: `GitHub falló: ${error.message}` });
      }
    }

    // 3. No cloud storage connected
    return res.status(400).json({ 
      message: 'Base de datos no conectada. Para sincronizar tus cambios en todos los dispositivos de tus clientes, por favor conecta Vercel KV (Storage) en tu panel de Vercel.' 
    });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}
