const fs = require('fs');
const dxfParser = require('dxf-parser');

async function dxf2geojson(dxf_file, P, toward) {
  const dxfContent = await fs.promises.readFile(`./public/uploads/DXF/${dxf_file}`, 'utf-8');
  const parser = new dxfParser();
  const dxf_data = parser.parseSync(dxfContent);

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
        properties: { layer: entity.layer },
        geometry
      });
    }
  });

  return processJSON(geojson, P, toward);
}

function processJSON(geojson, P, toward) {
  const pvmInfo = [];
  const diff = 1.15;
  // const diff = 1.68;
  const towardNumber = Number(toward); // 1:横向 0:纵向
  const blocks = ["All"];

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

  // 处理block
  const objBl = pvmInfo.reduce((acc, { block, ...rest }) => {
    if (!acc[block]) {
      acc[block] = [];
      blocks.push(block);
    }
    acc[block].push({ block, ...rest });
    return acc;
  }, {});

  const arrBl = Object.values(objBl);
  const brs = [];

  arrBl.forEach(item => {
    const newObj = item.reduce((acc, { center, ...rest }) => {
      const key = towardNumber ? center[1].toFixed(8) : center[0].toFixed(8);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ center, ...rest });
      return acc;
    }, {});

    const sortedEntries = Object.entries(newObj).sort(([a], [b]) =>
      towardNumber ? parseFloat(b) - parseFloat(a) : parseFloat(a) - parseFloat(b)
    );

    const newArrSegmented = sortedEntries.reduce((acc, [_, arr]) => {
      let lastArray = [];
      const resultArray = arr.reduce((subAcc, obj) => {
        const diffValue = towardNumber
          ? Math.abs(lastArray.at(-1)?.center[0] - obj.center[0]).toFixed(2)
          : Math.abs(lastArray.at(-1)?.center[1] - obj.center[1]).toFixed(2);
        if (!lastArray.length || diffValue <= diff.toFixed(2)) {
          lastArray.push(obj);
        } else {
          subAcc.push(lastArray);
          lastArray = [obj];
        }
        return subAcc;
      }, []);
      if (lastArray.length) resultArray.push(lastArray);
      acc.push(resultArray);
      return acc;
    }, []);

    const compareItems = (a, b) => {
      const primaryDelta = towardNumber ? a.center[0] - b.center[0] : b.center[1] - a.center[1];
      return primaryDelta !== 0 ? primaryDelta : (towardNumber ? a.center[0] - b.center[0] : b.center[1] - a.center[1]);
    };

    const newArrSorted = newArrSegmented.map(subArray => {
      subArray.sort((a, b) => compareItems(a[0], b[0]));
      subArray.forEach(item => item.sort((a, b) => compareItems(a, b)));
      return subArray;
    });

    newArrSorted.forEach((subArray, i) => {
      subArray.forEach((item, j) => {
        item.forEach((obj, k) => {
          const newRow = Math.floor(i / P) + 1; // 每P个区域分配一个新的R编号
          const col = Math.ceil(i - P * (newRow - 1)); // 计算num的新分组编号
          Object.assign(obj, {
            row: `R${newRow}`,
            section: `S${j + 1}`,
            num: `${k + 1}`,
            col: `${col + 1}`,
            PVMID: `${obj.block}_R${newRow}_S${j + 1}_${k + 1}_${col + 1}`,
          });
        });
      });
    });

    brs.push(newArrSorted);
  });
  // console.log(brs);

  const flatArr = brs.flat(3);
  const PVMIDMap = new Map(flatArr.map(obj => [obj.id, obj.PVMID]));

  geojson.features.forEach(item => item.properties.PVMID = PVMIDMap.get(item.properties.id));

  const geojsons = {"All":{"type": "FeatureCollection", "features": []}};
  blocks.sort((a, b) => {
    const numA = parseInt(a.replace('4S-', ''), 10);
    const numB = parseInt(b.replace('4S-', ''), 10);
    return numA - numB;
  });
  blocks.forEach(block => {
    const blockGeojson = {
      type: 'FeatureCollection',
      features: geojson.features.filter(feature => feature.properties.layer === block)
    };

    // geojsons[block] =JSON.stringify(blockGeojson);
    geojsons[block] = blockGeojson;
  });

  const mapCenter = flatArr[Math.floor(flatArr.length / 2)].center;

  return { geojsons, flatArr, blocks, mapCenter: [mapCenter[1], mapCenter[0]] };
}

module.exports = { dxf2geojson, processJSON } 
