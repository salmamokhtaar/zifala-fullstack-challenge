import { GET as countriesGET } from "@/app/api/countries/route";

test("returns countries list", async () => {
  const r = await countriesGET();
  const data = await r.json();
  expect(Array.isArray(data.countries)).toBe(true);
  expect(data.countries.length).toBeGreaterThan(0);
});
