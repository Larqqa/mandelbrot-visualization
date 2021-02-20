export function getById(id) {
  return document.getElementById(id);
}

export async function fetchWasm(wasm) {
  try {
    const req = await fetch(wasm);
    const res = await req.arrayBuffer();
    const results = await WebAssembly.instantiate(res);

    return results.instance.exports;
  } catch(e) {
    throw new Error(e);
  }
}