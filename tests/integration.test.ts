import { validateCodes, computePairsSorted } from "@/lib/util";


it("4-country integration", () => {
const codes = validateCodes(["SO","KE","ET","DJ"]);
const { pairs, count } = computePairsSorted(codes);
expect(count).toBe(6);
// ensure the well-known shortest here is DJ↔SO in our dataset
expect(pairs[0].a === "DJ" && pairs[0].b === "SO" || pairs[0].a === "SO" && pairs[0].b === "DJ").toBe(true);
});