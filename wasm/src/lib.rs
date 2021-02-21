extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
use web_sys::*;
use web_sys::CanvasRenderingContext2d;

mod setup;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub struct Client {
    gl: CanvasRenderingContext2d,
    width: i32,
    height: i32,
}

fn map_value(value: f32, in_min: f32, in_max: f32, out_min: f32, out_max: f32) -> f32{
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

#[wasm_bindgen]
impl Client {
    #[wasm_bindgen(constructor)]
    pub fn new(w: i32, h:i32) -> Self {
        console_error_panic_hook::set_once();
        let gl = setup::init_webgl_context().unwrap();

        Self {
            gl: gl,
            width: w,
            height: h
        }
    }

    pub fn render(&self) {
        let mut a:f32;
        let mut b:f32;
        let mut term_one:f32;
        let mut term_two:f32;
        let mut old_a:f32;
        let mut old_b:f32;
        let mut alpha:f32;
        let mut n:i32;
        let iterations = 100;

        for x in 0..self.width {
            for y in 0..self.height {
                a = map_value(x as f32, 0.0, self.width as f32, -2.0, 2.0);
                b = map_value(y as f32, 0.0, self.height as f32, -2.0, 2.0);

                old_a = a;
                old_b = b;

                n = 0;
                while n < iterations {
                    term_one = a * a - b * b;
                    term_two = 2.0 * (a * b);

                    a = term_one + old_a;
                    b = term_two + old_b;

                    if a * a + b * b > iterations as f32 {
                        break;
                    }

                    n = n + 1;

                    if n == iterations {
                        alpha = 0.0;
                    } else {
                        alpha = map_value(n as f32, 0.0, iterations as f32, 0.0, 255.0) as f32;
                    }

                    // pixels.set_index((y * width + x) as u32, alpha);
                    let mut str = format!("{:.2}", alpha);
                    str = format!("rgba({},{},{}, 255)", str, str, str);
                    self.gl.set_fill_style(&str.into());
                    self.gl.fill_rect(x as f64, y as f64, 1.0, 1.0)
                }
            }
        }
    }
}