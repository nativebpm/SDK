import { WASI } from 'node:wasi';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultSchemaWasmPath = path.resolve(__dirname, 'jsonschema.wasm');
async function loadWasm(wasmPath) {
    const nullDevice = process.platform === 'win32' ? 'NUL' : '/dev/null';
    const fd = fs.openSync(nullDevice, 'r');
    const wasi = new WASI({
        version: 'preview1',
        args: [],
        env: {},
        preopens: {},
        stdin: fd
    });
    const wasmBuffer = fs.readFileSync(wasmPath);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    const instance = await WebAssembly.instantiate(wasmModule, {
        wasi_snapshot_preview1: wasi.wasiImport
    });
    wasi.start(instance);
    fs.closeSync(fd);
    return { instance, wasi };
}
export async function validateJSON(schema, data, wasmPath) {
    const resolvedPath = wasmPath || defaultSchemaWasmPath;
    const { instance } = await loadWasm(resolvedPath);
    const exports = instance.exports;
    const allocate = exports.allocate;
    const deallocate = exports.deallocate;
    const validateJSONWasm = exports.validateJSON;
    const memory = exports.memory;
    const schemaJson = typeof schema === 'string' ? schema : JSON.stringify(schema);
    const dataJson = typeof data === 'string' ? data : JSON.stringify(data);
    const encoder = new TextEncoder();
    const schemaBytes = encoder.encode(schemaJson);
    const dataBytes = encoder.encode(dataJson);
    const schemaPtr = allocate(schemaBytes.length);
    const memView1 = new Uint8Array(memory.buffer);
    memView1.set(schemaBytes, schemaPtr);
    const dataPtr = allocate(dataBytes.length);
    const memView2 = new Uint8Array(memory.buffer);
    memView2.set(dataBytes, dataPtr);
    const resultPacked = validateJSONWasm(schemaPtr, schemaBytes.length, dataPtr, dataBytes.length);
    const resultPtr = Number(resultPacked >> 32n);
    const resultSize = Number(resultPacked & 0xffffffffn);
    const resultBytes = new Uint8Array(memory.buffer, resultPtr, resultSize);
    const decoder = new TextDecoder();
    const resultJson = decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    deallocate(schemaPtr, schemaBytes.length);
    deallocate(dataPtr, dataBytes.length);
    deallocate(resultPtr, resultSize);
    return {
        valid: !!result.valid,
        errors: result.errors || []
    };
}
export async function parseSchema(schema, variables, wasmPath) {
    const resolvedPath = wasmPath || defaultSchemaWasmPath;
    const { instance } = await loadWasm(resolvedPath);
    const exports = instance.exports;
    const allocate = exports.allocate;
    const deallocate = exports.deallocate;
    const parseSchemaWasm = exports.parseSchema;
    const memory = exports.memory;
    const schemaJson = typeof schema === 'string' ? schema : JSON.stringify(schema);
    const variablesJson = variables ? JSON.stringify(variables) : '';
    const encoder = new TextEncoder();
    const schemaBytes = encoder.encode(schemaJson);
    const variablesBytes = encoder.encode(variablesJson);
    const schemaPtr = allocate(schemaBytes.length);
    const memView1 = new Uint8Array(memory.buffer);
    memView1.set(schemaBytes, schemaPtr);
    let variablesPtr = 0;
    if (variablesBytes.length > 0) {
        variablesPtr = allocate(variablesBytes.length);
        const memView2 = new Uint8Array(memory.buffer);
        memView2.set(variablesBytes, variablesPtr);
    }
    const resultPacked = parseSchemaWasm(schemaPtr, schemaBytes.length, variablesPtr, variablesBytes.length);
    const resultPtr = Number(resultPacked >> 32n);
    const resultSize = Number(resultPacked & 0xffffffffn);
    const resultBytes = new Uint8Array(memory.buffer, resultPtr, resultSize);
    const decoder = new TextDecoder();
    const resultJson = decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    deallocate(schemaPtr, schemaBytes.length);
    if (variablesPtr > 0) {
        deallocate(variablesPtr, variablesBytes.length);
    }
    deallocate(resultPtr, resultSize);
    if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0]);
    }
    return result.widgets || [];
}
