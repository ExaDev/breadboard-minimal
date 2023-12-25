import {
	Board,
	BreadboardNode,
	GraphDescriptor,
	LogProbe,
} from "@google-labs/breadboard";
import { Core } from "@google-labs/core-kit";

const nestedBoard = new Board();
nestedBoard.input().wire(
	"*",
	nestedBoard.output({
		nestedBoard: "Hello from nested board!",
	})
);

////////////////////////////////////////

const board: Board = new Board();

const coreKit: Core = board.addKit(Core);

const invoke: BreadboardNode<any, any> = coreKit.invoke({
	graph: nestedBoard as unknown as GraphDescriptor,
});

board.input().wire(
	"*",
	invoke.wire(
		"*",
		board.output({
			mainBoard: "Hello from nested board!",
		})
	)
);

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
