import { cookies } from "next/headers";

export async function getSessionId() {
  const cookieStore = await cookies();
  let sid = cookieStore.get("sid")?.value;
  
  if (!sid) {
    sid = crypto.randomUUID();
    cookieStore.set("sid", sid, { 
      httpOnly: true, 
      sameSite: "lax", 
      path: "/" 
    });
  }
  
  return sid;
}