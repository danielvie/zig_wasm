const std = @import("std");

pub fn build(b: *std.Build) void {
    // Standard target options
    const target = b.standardTargetOptions(.{
        // Default to WebAssembly
        .default_target = .{
            .cpu_arch = .wasm32,
            .os_tag = .freestanding,
        },
    });

    // Standard optimization options
    const optimize = b.standardOptimizeOption(.{});

    // Create an executable
    const exe = b.addExecutable(.{
        .name = "fibonacci",
        .root_source_file = b.path("src/fibonacci.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Make the executable dynamic so functions are properly exported
    exe.rdynamic = true;

    // Add the install step
    b.installArtifact(exe);

    // Create a run step
    const run_cmd = b.addRunArtifact(exe);
    run_cmd.step.dependOn(b.getInstallStep());

    // Add a run step, only if appropriate
    // In Zig 0.13.0, we need to access the target info differently
    const is_wasm = target.result.cpu.arch == .wasm32 and target.result.os.tag == .freestanding;
    if (!is_wasm) {
        const run_step = b.step("run", "Run the app");
        run_step.dependOn(&run_cmd.step);
    }

    // Add a special step just for building the wasm
    const wasm_step = b.step("wasm", "Build the WebAssembly module");
    wasm_step.dependOn(b.getInstallStep());
}
