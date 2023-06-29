import Hashids from "hashids";
const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHID_SALT, 16);
export default hashids;
