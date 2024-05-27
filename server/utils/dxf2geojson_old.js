const fs = require('fs');
const dxfParser = require('dxf-parser');

async function dxf2geojson(dxf_file, block, toward) {
  const dxfContent = await fs.promises.readFile(`./public/uploads/DXF/${dxf_file}`, 'utf-8');
  const parser = new dxfParser();
  const dxf_data = parser.parseSync(dxfContent);

  // fs.promises.writeFile(`./public/uploads/DXF/json.json`, JSON.stringify(dxf_data), 'utf-8')
  //   .then(() => console.log('GeoJSON file has been saved.'))
  //   .catch(err => console.error('Error writing GeoJSON file:', err));

  const geojson = {
    type: 'FeatureCollection',
    features: []
  };
  dxf_data.entities.forEach(entity => {
    // const coordinates = entity.vertices && entity.vertices.map(vertex => [vertex.x, vertex.y]);
    const coordinates = entity.vertices?.map(vertex => [vertex.x, vertex.y]);

    let geometry = null;
    switch (entity.type) {
      case 'LWPOLYLINE':
      case 'POLYLINE':
        if (coordinates) {
          coordinates.push(coordinates[0]); // 封闭多边形
          geometry = { type: 'Polygon', coordinates: [coordinates] };
        }
        break;
      case 'LINE':
        if (coordinates.length >= 2) {
          geometry = {
            type: 'LineString',
            coordinates: [coordinates[0], coordinates[1]]
          };
        }
        break;
      // case 'INSERT':
      //   if (coordinates && coordinates.length > 0) {
      //     geometry = { type: 'Point', coordinates: coordinates[0] };
      //   }
      //   break; 
      default:
        console.log('Unsupported entity type:', entity.type);
    }

    if (geometry !== null) {
      geojson.features.push({
        type: 'Feature',
        properties: { layer: block }, // 保存实体所在的图层信息
        geometry: geometry
      });
    }
  });

  return processJSON(geojson, toward);
}

function processJSON(geojson, toward) {
  const pvmInfo = [];
  const diff = 1.15;
  const towardNumber = Number(toward);

  const fixedDiff = diff.toFixed(2);

  geojson.features.forEach((item, id) => {
    const dot = item.geometry.coordinates[0];
    const center = [
      (dot[0][0] + dot[2][0]) / 2,
      (dot[0][1] + dot[2][1]) / 2,
    ];
    const block = item.properties.layer;

    Object.assign(item.properties, { center, id });
    pvmInfo.push({ id, position: dot, center, block });
  });

  const newObj = {};
  for (const { center, ...rest } of pvmInfo) {
    const key = towardNumber ? center[1].toFixed(8) : center[0].toFixed(8);
    if (newObj[key]) {
      newObj[key].push({ center, ...rest });
    } else {
      newObj[key] = [{ center, ...rest }];
    }
  }

  const entries = Object.entries(newObj);
  const sortedEntries = towardNumber
    ? entries.sort(([a], [b]) => parseFloat(b) - parseFloat(a))
    : entries.sort(([a], [b]) => parseFloat(a) - parseFloat(b));
  const sortedNewObj = Object.fromEntries(sortedEntries);

  const newArrSegmented = [];
  for (const arr of Object.values(sortedNewObj)) {
    let lastArray = [];
    const resultArray = [];
    for (const obj of arr) {
      const diffValue = towardNumber
        ? Math.abs(lastArray.at(-1)?.center[0] - obj.center[0]).toFixed(2)
        : Math.abs(lastArray.at(-1)?.center[1] - obj.center[1]).toFixed(2);
      if (!lastArray.length || diffValue <= fixedDiff) {
        lastArray.push(obj);
      } else {
        resultArray.push(lastArray);
        lastArray = [obj];
      }
    }
    if (lastArray.length) resultArray.push(lastArray);
    newArrSegmented.push(resultArray); // Push segmented arrays
  }

  var newArrSorted = newArrSegmented.map(subArray =>
    subArray.sort((a, b) => {
      let deltaPrimary = towardNumber ? a[0].center[0] - b[0].center[0] : b[0].center[1] - a[0].center[1];
      if (deltaPrimary !== 0) return deltaPrimary;
      return towardNumber ? a.center[0] - b.center[0] : b.center[1] - a.center[1];
    })
  );

  newArrSorted.forEach((subArray, i) => {
    subArray.forEach((item, j) => {
      item.forEach((obj, k) => {
        Object.assign(obj, {
          row: `R${i + 1}`,
          section: `S${j + 1}`,
          num: `${k + 1}`,
          PVMID: `${obj.block}_R${i + 1}_S${j + 1}_${k + 1}`,
        });
      });
    });
  });

  const flatArr = newArrSorted.flat(2);
  const PVMIDMap = new Map(flatArr.map(obj => [obj.id, obj.PVMID]));
  geojson.features.forEach(item => {
    item.properties.PVMID = PVMIDMap.get(item.properties.id);
  });
  const mapCenter = flatArr[Math.floor(flatArr.length / 2)].center;

  return { geojson, flatArr, mapCenter: [mapCenter[1], mapCenter[0]] };
}

module.exports = { dxf2geojson, processJSON } 