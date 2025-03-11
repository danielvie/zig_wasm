// build.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{
        .default_target = .{
            .cpu_arch = .wasm32,
            .os_tag = .freestanding,
        },
    });
    const optimize = b.standardOptimizeOption(.{});

    const source = b.path("src/main.zig");
    std.debug.print("Building with source: {s}\n", .{source.getPath(b)});

    const exe = b.addExecutable(.{
        .name = "math",
        .root_source_file = source,
        .target = target,
        .optimize = optimize,
    });
    exe.rdynamic = true; // required for the wasm

    const install_step = b.addInstallFile(exe.getEmittedBin(), "lib/math.wasm");
    b.getInstallStep().dependOn(&install_step.step);
}
