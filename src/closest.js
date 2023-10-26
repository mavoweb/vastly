export default function closest (node, type) {
	let n = node;

	do {
		if (n.type === type) {
			return n;
		}
	} while (n = n.parent);

	return null;
}