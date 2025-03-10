// fibonacci.zig
// A simple WebAssembly module written in Zig that calculates Fibonacci numbers

// Export add
export fn add(a: i32, b: i32) i32 {
    return a + b * 10;
}

// Export our fibonacci function so it can be called from JavaScript
export fn fibonacci(n: u32) u32 {
    if (n <= 1) return n;

    var a: u32 = 0;
    var b: u32 = 1;
    var i: u32 = 2;

    while (i <= n) : (i += 1) {
        const next = a + b;
        a = b;
        b = next;
    }

    return b;
}

// WebAssembly entry point
pub fn main() void {}

// Memory allocation functions required for WebAssembly
export fn malloc(size: usize) ?[*]u8 {
    _ = size; // Mark parameter as intentionally unused
    return null;
}

export fn free(ptr: [*]u8) void {
    _ = ptr; // Mark parameter as intentionally unused
}
