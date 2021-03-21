import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import styles from "rollup-plugin-styles";
import { env } from "process";

export default {
    input: "src/main.ts",
    output: {
        format: "cjs",
        file: "main.js",
        exports: "default",
    },
    external: ["obsidian", "fs", "os", "path"],
    plugins: [
        typescript({ sourceMap: env.env === "DEV" }),
        styles(),
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs({
            include: "node_modules/**",
        }),
    ],
};