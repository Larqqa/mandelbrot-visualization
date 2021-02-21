use wasm_bindgen::prelude::*;

fn map_value(value: f32, in_min: f32, in_max: f32, out_min: f32, out_max: f32) -> f32{
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

#[wasm_bindgen]
pub fn find_mandelbrot(x:f32, y:f32, x_off:f32, y_off:f32, width:f32, height:f32, min_range:f32, max_range:f32, iterations:i32) -> f32 {
  let mut a = map_value(x - x_off, 0.0, width as f32, -min_range, max_range);
  let mut b = map_value(y - y_off, 0.0, height as f32, -min_range, max_range);

  let old_a = a;
  let old_b = b;

  let mut term_one:f32;
  let mut term_two:f32;

  let mut n = 0;
  while n < iterations {
    term_one = a * a - b * b;
    term_two = 2.0 * (a * b);

    a = term_one + old_a;
    b = term_two + old_b;

    if a * a + b * b > 16.0 {
      break;
    }

    n = n + 1;
  }

  if n == iterations {
    return 0.0;
  } else {
    return map_value(n as f32, 0.0, iterations as f32, 0.0, 255.0);
  }
}





















// use js_sys::Float32Array;
/*
fn map_value(value: f32, in_min: f32, in_max: f32, out_min: f32, out_max: f32) -> f32{
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

#[wasm_bindgen]
pub fn thing() {
  for x in 0..1000000 {
  }
}

#[wasm_bindgen]
pub fn generate_mandelbrot(width: i32, height: i32, offset_x: f32, offset_y: f32, min_range: f32, max_range: f32, iterations: i32) ->  js_sys::Float32Array  {
  let mut n:i32;
  let mut a:f32;
  let mut b:f32;
  let mut term_one:f32;
  let mut term_two:f32;
  let mut old_a:f32;
  let mut old_b:f32;
  let mut alpha:f32;

  let pixels = js_sys::Float32Array::new_with_length((width * height) as u32);

  for x in 0..width {
      for y in 0..height {
          a = map_value(x as f32 - offset_x, 0.0, width as f32, -min_range, max_range);
          b = map_value(y as f32 - offset_y, 0.0, height as f32, -min_range, max_range);

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

              pixels.set_index((y * width + x) as u32, alpha);
          }
      }
  }

  return pixels;
}
*/