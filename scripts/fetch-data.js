const fs = require('fs');

const { url, dir } = process.env;

if (!url || !dir) {
  console.error("Error: 'url' and 'dir' environment variables must be set.");
  process.exit(1);
}

const file = `${dir}/src/data/playersData.json`;

console.log("Leyendo respuestas de jugadores desde ", url);

async function fetchPlayersData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const playersData = await response.json();
    const rest = playersData.map(({ nombre, ...rest }) => rest)
    rest.forEach(obj => delete obj["cuenta clabe"])
    const str = JSON.stringify(rest, null, 2)
      .replaceAll("apodo", "nombre")
    console.log(`\nEscribiendo respuesta en ${file}...`);
    fs.writeFileSync(file, str);
    console.log('\nRespuestas recibidas con exito.');
  } catch (e) {
    console.error(`\nHubo un error: ${e}`);
    process.exit(1);
  }
}

fetchPlayersData();
