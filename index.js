// index.js
const fs = require("fs");

async function run() {
    try {
        const wasmBuffer = fs.readFileSync("./zig-out/lib/math2.wasm");
        const { instance } = await WebAssembly.instantiate(wasmBuffer);
        
        // Debug: Log all exports to see what’s available
        console.log("Exports:", instance.exports);

        const { add } = instance.exports;
        if (typeof add !== "function") {
            throw new Error("add is not a function in exports");
        }

        console.log("2 + 3 =", add(2, 3));
    } catch (error) {
        console.error("Error:", error);
    }
}

run();