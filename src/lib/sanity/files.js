import { groq } from "next-sanity";

export const clientLogosQuery = `
  *[_type == "clientLogo"] | order(order asc) {
    _id,
    clientName,
    url,
    "logoUrl": logo.asset->url,
  }
`;
