import { validateCodes, computePairsSorted } from "@/lib/util";


it("rejects unknown codes", () => {
expect(() => validateCodes(["SO","XX"])) .toThrow(/Unknown code/);
});


it("sorts ascending by km", () => {
const { pairs } = computePairsSorted(["SO","KE","ET","DJ"]);
for (let i=1;i<pairs.length;i++) {
expect(pairs[i].km).toBeGreaterThanOrEqual(pairs[i-1].km);
}
});