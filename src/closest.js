import "./treecle-setup.js";
import treecleClosest from "../lib/treecle/src/closest.js";

export default function closest (node, type) {
	return treecleClosest(node, n => n.type === type);
}
