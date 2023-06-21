import Hashids from "hashids";
const hashids = new Hashids(process.env.HASHID_SALT, 16);
export default hashids;
