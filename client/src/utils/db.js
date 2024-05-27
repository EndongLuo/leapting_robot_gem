import Dexie from "dexie";

export const db = new Dexie("map");

db.version(1).stores({
  maps: "++id, siteId, sitename, center, map, tree",
  // maptree:"++id,sitename,tree"
});