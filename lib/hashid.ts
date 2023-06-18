import Hashids from "hashids";
const hashids = new Hashids(process.env.HASHID_SALT, 8);
export default hashids;
