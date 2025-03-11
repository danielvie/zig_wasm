import fs from "fs";

// Type definitions for the WASM exports
interface MathExports {
  add(a: number, b: number): number;
  double(a: number): number;
  fibonacci(n: number): number;
  hello(): number; // Returns a pointer to u8
  memory: WebAssembly.Memory; // WASM memory
}

async function loadWasm(): Promise<MathExports> {
  // load the wasm file
  const wasmBuffer = fs.readFileSync("./zig-out/lib/math.wasm");

  // instantiate the wasm module
  const wasmModule = await WebAssembly.instantiate(
    new Uint8Array(wasmBuffer),
    { env: {} } // no imports needed
  );

  return wasmModule.instance.exports as unknown as MathExports;
}

async function run() {
    const wasm = await loadWasm();

    console.log("2 + 3 =", wasm.add(2, 3));

    const out: number[] = []
    for (let i = 0; i < 10; i++) {
        out.push(wasm.fibonacci(i));
    }

    console.log('fib: ', out.join(', '));

    // reading string pointer
    const stringPtr = wasm.hello();
    const memory = new Uint8Array(wasm.memory.buffer);
    let endPtr = stringPtr;
    while (memory[endPtr] !== 0) endPtr++;

    // decoding string
    const decoder = new TextDecoder('utf-8')
    const str = decoder.decode(memory.subarray(stringPtr, endPtr))

    console.log(`str = '${str}'`);
} 

run().catch(console.error);