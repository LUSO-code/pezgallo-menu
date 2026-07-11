export default async function handler(req, res) {
  // Set CORS headers for safe local testing
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

  // We use a unique key in the public kvdb.io namespace to ensure instant, free, zero-config storage
  const dbUrl = 'https://kvdb.io/public/pezgallo_menu_db_secret_key_8f7b';

  if (req.method === 'GET') {
    try {
      const response = await fetch(dbUrl);
      if (!response.ok) {
        return res.status(200).json([]); // Return empty array if not initialized yet
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching menu from DB:', error);
      return res.status(500).json({ message: 'Error al obtener el menú', error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { password, menuData } = req.body;

    if (password !== 'PGdeivid') {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    try {
      const response = await fetch(dbUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar la información en el almacenamiento en la nube.');
      }

      return res.status(200).json({ status: 'ok', message: 'Guardado con éxito' });
    } catch (error) {
      console.error('Error saving menu to DB:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Método no permitido' });
}
