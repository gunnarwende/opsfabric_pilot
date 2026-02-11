export const runtime = "nodejs";
function twiml(xmlInner: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${xmlInner}</Response>`;
}
export async function POST() {
  const xml = twiml('<Say voice="alice">Hello from FlowSight. This is a test call.</Say><Hangup/>');
  return new Response(xml, { status: 200, headers: { "Content-Type": "text/xml; charset=utf-8" } });
}
export async function GET() { return new Response("Method Not Allowed", { status: 405 }); }