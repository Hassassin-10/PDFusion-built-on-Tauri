use lopdf::{Document, Object, Dictionary};
use serde::Serialize;
use std::collections::BTreeMap;

#[derive(Serialize)]
pub struct PdfMeta {
    pub pages: usize,
    pub title: Option<String>,
    pub author: Option<String>,
}

/* =====================
   MERGE PDFs (Pure Rust)
===================== */
pub fn merge_pdfs(files: Vec<String>, output: String) -> Result<(), String> {
    let mut documents: Vec<Document> = Vec::new();
    for file in files {
        let doc = Document::load(&file).map_err(|e| e.to_string())?;
        documents.push(doc);
    }

    // Start with an empty document (version 1.5)
    let mut max_id = 1;
    let mut final_doc = Document::with_version("1.5");
    
    // Minimal standard objects for a valid PDF
    // final_doc.resources_id = (max_id, 0); // Removed invalid field
    // max_id += 1;
    
    // We will collect all pages here
    let mut final_pages = BTreeMap::new();
    let mut page_count = 0;

    for mut doc in documents {
        doc.renumber_objects_with(max_id);
        max_id = doc.max_id + 1;

        // Get pages before consuming map
        let pages = doc.get_pages();

        // Add all objects to the final doc
        for (id, object) in doc.objects {
            final_doc.objects.insert(id, object);
        }
        
        // Add pages
        for (_, object_id) in pages {
            page_count += 1;
            final_pages.insert(page_count, object_id);
        }
    }

    // Create the Pages dictionary
    let pages_root_id = (max_id, 0);
    // max_id += 1; // Unused

    let mut pages_dict = Dictionary::new();
    pages_dict.set("Type", Object::Name(b"Pages".to_vec()));
    pages_dict.set("Count", Object::Integer(page_count as i64));
    
    let kids: Vec<Object> = final_pages.values().map(|&id| Object::Reference(id)).collect();
    pages_dict.set("Kids", Object::Array(kids));

    final_doc.objects.insert(pages_root_id, Object::Dictionary(pages_dict));
    
    // Setup catalog
    let catalog_id = (max_id + 1, 0);
    let mut catalog = Dictionary::new();
    catalog.set("Type", Object::Name(b"Catalog".to_vec()));
    catalog.set("Pages", Object::Reference(pages_root_id));
    final_doc.objects.insert(catalog_id, Object::Dictionary(catalog));

    // Entry point
    final_doc.trailer.set("Root", Object::Reference(catalog_id));
    
    // Save (Compression disabled for stability)
    // final_doc.compress(); 
    final_doc.save(&output).map_err(|e| e.to_string())?;

    // Verify file exists
    if !std::path::Path::new(&output).exists() {
        return Err("File failed to persist to disk".to_string());
    }

    Ok(())
}

/* =====================
   SPLIT PDF (Pure Rust)
===================== */
pub fn split_pdf(file: String, output_dir: String) -> Result<(), String> {
    let doc = Document::load(&file).map_err(|e| e.to_string())?;
    let pages = doc.get_pages();

    for (page_num, page_id) in pages {
        // Create a new document for this single page
        let mut new_doc = Document::with_version("1.5");
        
        // We fundamentally need to copy the page object and all its referenced resources.
        // Doing this robustly in pure Rust without qpdf requires deep graph traversal.
        // APPROXIMATION: We will copy the *entire* document's objects but only link ONE page in the page tree.
        // This results in larger files but ensures no missing resources.
        
        // 1. Copy all objects
        new_doc.objects = doc.objects.clone();
        
        // 2. Create a NEW Page Tree containing ONLY this page
        // Find a free ID. 
        let free_id = new_doc.max_id + 1;
        let pages_id = (free_id, 0);
        let catalog_id = (free_id + 1, 0);

        let mut pages_dict = Dictionary::new();
        pages_dict.set("Type", Object::Name(b"Pages".to_vec()));
        pages_dict.set("Count", Object::Integer(1));
        pages_dict.set("Kids", Object::Array(vec![Object::Reference(page_id)]));
        new_doc.objects.insert(pages_id, Object::Dictionary(pages_dict));

        // 3. Update Catalog
        let mut catalog = Dictionary::new();
        catalog.set("Type", Object::Name(b"Catalog".to_vec()));
        catalog.set("Pages", Object::Reference(pages_id));
        new_doc.objects.insert(catalog_id, Object::Dictionary(catalog));

        // 4. Set Root
        new_doc.trailer.set("Root", Object::Reference(catalog_id));

        // 5. Clean / Compress (Optional)
        new_doc.compress();

        let output_file = format!("{}/page_{}.pdf", output_dir, page_num);
        new_doc.save(output_file).map_err(|e| e.to_string())?;
    }

    Ok(())
}

/* =====================
   COMPRESS PDF (QPDF Req)
===================== */
pub fn compress_pdf(_input: String, _output: String) -> Result<(), String> {
    Err("Compression requires QPDF. Pure Rust implementation not available.".into())
}

/* =====================
   ROTATE PAGES (QPDF Req)
===================== */
pub fn rotate_pdf(_input: String, _output: String, _degrees: i32) -> Result<(), String> {
    Err("Rotation requires QPDF. Pure Rust implementation not available.".into())
}

/* =====================
   WATERMARK (QPDF Req)
===================== */
pub fn watermark_pdf(_input: String, _watermark: String, _output: String) -> Result<(), String> {
   Err("Watermarking requires QPDF. Pure Rust implementation not available.".into())
}

/* =====================
   ENCRYPT PDF (QPDF Req)
===================== */
pub fn encrypt_pdf(_input: String, _output: String, _password: String) -> Result<(), String> {
    Err("Encryption requires QPDF. Pure Rust implementation not available.".into())
}

/* =====================
   DECRYPT PDF (QPDF Req)
===================== */
pub fn decrypt_pdf(_input: String, _output: String, _password: String) -> Result<(), String> {
   Err("Decryption requires QPDF. Pure Rust implementation not available.".into())
}

/* =====================
   METADATA (Pure Rust)
===================== */
pub fn get_metadata(file: String) -> Result<PdfMeta, String> {
    let doc = Document::load(&file).map_err(|e| e.to_string())?;

    let mut title = None;
    let mut author = None;

    // Fix: Dictionary::get returns Result in lopdf 0.32
    if let Ok(info_obj) = doc.trailer.get(b"Info") {
        // Fix: resolve reference
        let resolved_obj_opt = match info_obj {
             lopdf::Object::Reference(id) => doc.get_object(*id).ok(), // id is ObjectId (Copy), so *id works if id is &ObjectId, or id if ObjectId. In match Reference(id), if id is by ref, *id is correct.
             _ => Some(info_obj),
        };

        if let Some(obj) = resolved_obj_opt {
             if let Ok(dict) = obj.as_dict() {
                // Fix: explicit typing or handling Result/Option mismatch
                 title = dict.get(b"Title")
                    .ok()
                    .and_then(|v| v.as_str().ok())
                    .map(|s| String::from_utf8_lossy(s).to_string());
                 author = dict.get(b"Author")
                    .ok()
                    .and_then(|v| v.as_str().ok())
                    .map(|s| String::from_utf8_lossy(s).to_string());
             }
        }
    }

    Ok(PdfMeta {
        pages: doc.get_pages().len(),
        title,
        author,
    })
}
