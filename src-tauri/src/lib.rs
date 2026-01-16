mod pdf;
use pdf::*;

#[tauri::command]
fn merge(files: Vec<String>, output: String) -> Result<(), String> {
    if files.is_empty() {
        return Err("No files provided".to_string());
    }
    merge_pdfs(files, output)
}

#[tauri::command]
fn split(file: String, output_dir: String) -> Result<(), String> {
    split_pdf(file, output_dir)
}

#[tauri::command]
fn compress(input: String, output: String) -> Result<(), String> {
    compress_pdf(input, output)
}

#[tauri::command]
fn rotate(input: String, output: String, degrees: i32) -> Result<(), String> {
    rotate_pdf(input, output, degrees)
}

#[tauri::command]
fn watermark(input: String, watermark: String, output: String) -> Result<(), String> {
    watermark_pdf(input, watermark, output)
}

#[tauri::command]
fn encrypt(input: String, output: String, password: String) -> Result<(), String> {
    encrypt_pdf(input, output, password)
}

#[tauri::command]
fn decrypt(input: String, output: String, password: String) -> Result<(), String> {
    decrypt_pdf(input, output, password)
}

#[tauri::command]
fn metadata(file: String) -> Result<pdf::PdfMeta, String> {
    get_metadata(file)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            merge,
            split,
            compress,
            rotate,
            watermark,
            encrypt,
            decrypt,
            metadata
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
