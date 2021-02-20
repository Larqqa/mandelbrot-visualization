use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(n1: i32, n2: i32) -> i32 {
    n1 + n2
}

#[wasm_bindgen]
pub fn substract(n1: i32, n2: i32) -> i32 {
    n1 - n2
}

#[wasm_bindgen]
pub fn multiply(n1: i32, n2: i32) -> i32 {
    n1 * n2
}

#[wasm_bindgen]
pub fn divide(n1: i32, n2: i32) -> i32 {
    n1 / n2
}

#[wasm_bindgen]
pub fn fib(n: u32) -> u32 {
    match n {
        0 => 1,
        1 => 1,
        _ => fib(n - 1) + fib(n - 2),
    }
}