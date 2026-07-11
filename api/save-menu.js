export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { password, menuData } = req.body;

  if (password !== 'PGdeivid') {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ 
      message: 'GITHUB_TOKEN no configurado en las variables de entorno de Vercel.',
      status: 'error'
    });
  }

  const owner = 'LUSO-code';
  const repo = 'pezgallo-menu';
  const path = 'src/data/menuData.js';
  const branch = 'master';

  try {
    // 1. Get the current file SHA from GitHub API
    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const getRes = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Pezgallo-Admin-API'
      }
    });

    let sha = '';
    if (getRes.status === 200) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    } else if (getRes.status !== 404) {
      const errText = await getRes.text();
      throw new Error(`Error al consultar GitHub: ${errText}`);
    }

    // 2. Format the new file contents
    const newContent = `export const menuData = ${JSON.stringify(menuData, null, 2)};\n`;
    const buffer = Buffer.from(newContent, 'utf-8');
    const contentBase64 = buffer.toString('base64');

    // 3. Update (or create) the file in GitHub
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
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Pezgallo-Admin-API'
      },
      body: JSON.stringify(putBody)
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`Error al subir a GitHub: ${errText}`);
    }

    return res.status(200).json({ status: 'ok', message: 'Menú actualizado y guardado en GitHub con éxito' });

  } catch (error) {
    console.error('Error saving menu to GitHub:', error);
    return res.status(500).json({ message: error.message });
  }
}
