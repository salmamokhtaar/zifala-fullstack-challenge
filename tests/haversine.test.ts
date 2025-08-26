import { haversineKm } from "@/lib/geo";


// Known distances (approximate, allow tolerance ±5 km)
function approx(a: number, b: number, tol = 5) {
expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
}


it("Mogadishu (SO) ↔ Djibouti City (DJ)", () => {
const km = haversineKm(2.0469,45.3182, 11.588,43.1457);
approx(km, 1165.4, 25); // dataset rounding + earth radius variance
});


it("Nairobi (KE) ↔ Addis Ababa (ET)", () => {
const km = haversineKm(-1.2921,36.8219, 8.9806,38.7578);
approx(km, 1161, 25);
});