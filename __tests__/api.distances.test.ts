import { POST as distancesPOST } from "@/app/api/distances/route";

function req(body: any) {
  return new Request("http://test/api/distances", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("validates and sorts pairs", async () => {
  const r = await distancesPOST(req({ countries: ["SO", "KE", "ET", "DJ"] }));
  const data = await r.json();
  expect(data.count).toBe(6);
  expect(Array.isArray(data.pairs)).toBe(true);
  // ascending
  for (let i = 1; i < data.pairs.length; i++) {
    expect(data.pairs[i].km).toBeGreaterThanOrEqual(data.pairs[i - 1].km);
  }
});
