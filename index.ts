import {
	Board,
	BreadboardNode,
	InputValues,
	LogProbe,
	OutputValues,
} from "@google-labs/breadboard";

const board: Board = new Board();

// discretely defining nodes
const input: BreadboardNode<InputValues, OutputValues> = board.input({
	$id: "anInput",
});
const output: BreadboardNode<InputValues, OutputValues> = board.output({
	$id: "anOutput",
});

// defining an edge which passes all parameters between the the input and output node.
input.wire("inputMessage->outputMessage", output);
input.wire("timeStamp", output);
input.wire("*", output);

// show the graph description
console.log("=".repeat(80));
console.log(
	"const graphDescriptor: GraphDescriptor =",
	JSON.stringify(board, null, 2)
);
console.log(("=".repeat(80) + "\n").repeat(3));

let probe: LogProbe;
const minimalProbe: LogProbe = new LogProbe();
probe = minimalProbe;
const fancyProbe: LogProbe = new LogProbe({
	log: (...args: unknown[]) => {
		console.debug();
		console.debug("~".repeat(5) + " LogProbe " + "~".repeat(5));
		console.debug(...args);
		console.debug("~".repeat(20));
		console.debug();
	},
});
probe = fancyProbe; // comment out this line to use the default log probe

for await (const runResult of board.run({
	probe, // comment out to disable logger entirely
})) {
	console.log(runResult.type.toUpperCase());
	console.log(runResult.node.id);
	console.log();

	if (runResult.type === "input") {
		const inputs = {
			timeStamp: new Date().toISOString(),
			inputMessage: "Hello World",
			anotherMessage: "Hello World again",
		};
		console.log({ inputs });
		runResult.inputs = inputs;
	} else if (runResult.type === "output") {
		const outputs = runResult.outputs;
		console.log({ outputs });
	}
	console.log();
	console.log("=".repeat(80));
}
