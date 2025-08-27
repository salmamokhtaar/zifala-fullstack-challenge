export async function GET() {
  return Response.json({
    message: "Capital Distance Finder API",
    endpoints: {
      countries: "/api/countries",
      distances: "/api/distances",
      stream: "/api/distances/stream",
      custom: "/api/distances/custom"
    }
  });
}
