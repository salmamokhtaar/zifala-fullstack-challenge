export type Country = {
iso2: string;
name: string;
capital: string;
lat: number;
lon: number;
};


export type Pair = { a: string; b: string; km: number };


const R_EARTH_KM = 6371.0088; // WGS84 mean radius


function toRad(d: number) { return (d * Math.PI) / 180; }


export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
const φ1 = toRad(lat1), φ2 = toRad(lat2);
const Δφ = toRad(lat2 - lat1);
const Δλ = toRad(lon2 - lon1);
const a = Math.sin(Δφ/2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) ** 2;
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return +(R_EARTH_KM * c).toFixed(1);
}


export function uniquePairs(codes: string[]): [string, string][] {
const res: [string, string][] = [];
for (let i = 0; i < codes.length; i++) {
for (let j = i + 1; j < codes.length; j++) {
res.push([codes[i], codes[j]]);
}
}
return res;
}