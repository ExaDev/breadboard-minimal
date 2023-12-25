import { Board, LogProbe } from "@google-labs/breadboard";

const board = new Board();

const input = board.input();
const output = board.output();
input.wire("*", output);

board.input().wire("*", board.output());
board.input().wire("*", board.output());


for await (const runResult of board.run({
	probe: new LogProbe({
		log: (...args: unknown[]) => {
			console.debug();
			console.debug("~".repeat(5) + " LogProbe " + "~".repeat(5));
			console.debug(...args);
			console.debug("~".repeat(20));
		}
	})
})) {
	console.log("=".repeat(80));
	console.log(`node:\t${runResult.node.id}`);
	console.log(`type:\t${runResult.type}`);
	console.log();

	if (runResult.type === "input") {
		const inputs = {
			timestamp: new Date().toISOString(),
		};
		runResult.inputs = inputs;
	} else if (runResult.type === "output") {
		console.log(runResult.outputs);
	}
}
