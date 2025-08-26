import capitals from "./capitals.json";
import type { Country } from "./geo";


export const COUNTRIES: Country[] = capitals as Country[];


const map2 = new Map(COUNTRIES.map(c => [c.iso2.toUpperCase(), c]));


export function getCountry(code: string): Country | undefined {
return map2.get(code.toUpperCase());
}


export function listCountries() {
// what the GET /api/countries returns
return COUNTRIES.map(({ iso2, name, capital, lat, lon }) => ({ iso2, name, capital, lat, lon }));
}