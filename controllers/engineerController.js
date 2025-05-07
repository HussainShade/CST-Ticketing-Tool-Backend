exports.addEngineer = async (req, res) => {
  try {
    const engineer_id = await generateEngineerId(); // ✅ Await here
    const { name, phone_number, email, category } = req.body;

    const sql = `
      INSERT INTO service_engineers (
        engineer_id, name, phone_number, email, category
      ) VALUES ($1, $2, $3, $4, $5)
    `;

    await pool.query(sql, [engineer_id, name, phone_number, email, category]);
    res.status(201).json({ engineer_id });
  } catch (err) {
    console.error('Add engineer error:', err.message);
    res.status(500).json({ message: 'Insert failed' });
  }
};
