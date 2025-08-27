import { haversineKm } from "@/lib/geo";

test("zero distance for same point", () => {
  expect(haversineKm(0, 0, 0, 0)).toBeCloseTo(0, 5);
});

test("symmetry", () => {
  const a = haversineKm(2.0469, 45.3182, -1.2921, 36.8219); // Mogadishu↔Nairobi
  const b = haversineKm(-1.2921, 36.8219, 2.0469, 45.3182);
  expect(a).toBeCloseTo(b, 5);
});
