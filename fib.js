// run-fibonacci.js
const fs = require('fs');
const path = require('path');

// Path to your compiled WebAssembly file
// Assuming it's in the same directory and called fibonacci.wasm
const wasmPath = path.join(__dirname, 'zig-out/bin/fibonacci.wasm');

async function runWasm() {
  try {
    // Read the wasm file
    const wasmBuffer = fs.readFileSync(wasmPath);
    
    // Instantiate the WebAssembly module
    const wasmModule = await WebAssembly.instantiate(wasmBuffer, {});
    
    // Get the exported function
    const { fibonacci, add } = wasmModule.instance.exports;
    
    // Test the function with different values
    console.log("Fibonacci sequence calculations:");
    for (let i = 0; i <= 20; i++) {
      console.log(`Fibonacci(${i}) = ${fibonacci(i)}`);
      console.log(`add(${i}, ${i+1}) = ${add(i, i + 1)}`);
    }
    
    // Time the function for larger values
    console.log("\nPerformance test:");
    const start = performance.now();
    const result = fibonacci(40);
    const end = performance.now();
    
    console.log(`Fibonacci(40) = ${result}`);
    console.log(`Calculation took ${(end - start).toFixed(2)}ms`);
    
  } catch (error) {
    console.error("Error running WebAssembly module:", error);
  }
}

// Run the function
runWasm();