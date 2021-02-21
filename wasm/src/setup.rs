use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;
use web_sys::*;
use web_sys::CanvasRenderingContext2d;

#[wasm_bindgen]
pub fn init_webgl_context() -> Result<CanvasRenderingContext2d, JsValue> {
  let window = window().unwrap();
  let document = window.document().unwrap();
  let canvas = document.get_element_by_id("rCanvas").unwrap();
  let can: web_sys::HtmlCanvasElement = canvas.dyn_into::<web_sys::HtmlCanvasElement>()?;
  let gl:CanvasRenderingContext2d = can.get_context("2d")?.unwrap().dyn_into()?;

  Ok(gl)
}
