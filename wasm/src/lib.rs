use wasm_bindgen::prelude::*;
use js_sys::Uint8ClampedArray;

fn map_value(value: f32, in_min: f32, in_max: f32, out_min: f32, out_max: f32) -> f32{
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

#[wasm_bindgen]
pub fn generate_mandelbrot(
  buffer:Uint8ClampedArray,
  width: u32,
  height: u32,
  offset_x: f32,
  offset_y: f32,
  range: f32,
  iterations: i32,
  width_ratio: f32,
  height_ratio: f32,
  param_a: f32,
  param_b: f32,
) -> js_sys::Uint8ClampedArray {
  let off_x = offset_x / range;
  let off_y = offset_y / range;

  let x_range = range * width_ratio;
  let y_range = range * height_ratio;

  let mut old_a:f32;
  let mut old_b:f32;

  let mut a:f32;
  let mut b:f32;

  let mut n:i32;

  let mut temp:f32;

  let mut pos:u32;

  for x in 0..width {
    old_a = map_value(x as f32 - off_x, 0.0, width as f32, -x_range, x_range);
    for y in 0..height {
      a = old_a;
      b = map_value(y as f32 - off_y, 0.0, height as f32, -y_range, y_range);
      old_b = b;

      n = 0;
      while n < iterations {
        temp = a*a - b*b + old_a;
        b = 2.0 * (a * b) + old_b;
        a = temp;

        if a*a + b*b > 4.0 {
          break;
        }

        n = n + 1;
      }

      if n == iterations {
        n = 0;
      } else {
        n = map_value(n as f32, 0.0, iterations as f32, 0.0, 765.0) as i32;
      }
      pos = (y * width + x) * 4;
      buffer.set_index(pos + 0, n as u8);
      buffer.set_index(pos + 1, n as u8);
      buffer.set_index(pos + 2, n as u8);
      buffer.set_index(pos + 3, 255);
    }
  }

  buffer
}
