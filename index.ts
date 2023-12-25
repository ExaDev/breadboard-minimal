import {
	Board,
	BreadboardNode,
	InputValues,
	LogProbe,
	OutputValues,
} from "@google-labs/breadboard";

const board: Board = new Board();

// discretely defining nodes
const input: BreadboardNode<InputValues, OutputValues> = board.input();
const output: BreadboardNode<InputValues, OutputValues> = board.output();

// defining an edge which passes all parameters between the the input and output node.
input.wire("*", output);

// also chaining a new input to a new output
board.input().wire("*", board.output());

console.log("=".repeat(80));
console.log(
	"const graphDescriptor: GraphDescriptor =",
	JSON.stringify(board, null, 2)
);
console.log("=".repeat(80));

const probe = {
	log: (...args: unknown[]) => {
		console.debug();
		console.debug("~".repeat(5) + " LogProbe " + "~".repeat(5));
		console.debug(...args);
		console.debug("~".repeat(20));
	},
};

for await (const runResult of board.run({
	probe: new LogProbe(),
	// probe
})) {
	console.debug("\n", "^ ~~~~~~~~~ LogProbe", "\n");
	console.log(`node:\t${runResult.node.id}`);
	console.log(`type:\t${runResult.type}`);
	console.log();

	if (runResult.type === "input") {
		runResult.inputs = {
			timestamp: new Date().toISOString(),
		};
	} else if (runResult.type === "output") {
		console.log(runResult.outputs);
	}
	console.log("=".repeat(80), "\n");
}
