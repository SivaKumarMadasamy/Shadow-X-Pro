fn main() {
    // Workaround for tauri-build 1.5.x on newer Cargo versions:
    // tauri-build calculates target_dir using 3 parent() calls instead of 4,
    // resulting in target/debug/build. It then attempts to read target_dir.join("build").
    // We create a directory junction if it does not exist so tauri-build succeeds seamlessly.
    if let Ok(out_dir) = std::env::var("OUT_DIR") {
        let p = std::path::PathBuf::from(out_dir);
        if let Some(target_build) = p.parent().and_then(|p| p.parent()).and_then(|p| p.parent()) {
            let nested = target_build.join("build");
            if !nested.exists() {
                #[cfg(windows)]
                {
                    let _ = std::process::Command::new("cmd")
                        .args(&[
                            "/c",
                            "mklink",
                            "/J",
                            nested.to_str().unwrap_or(""),
                            target_build.to_str().unwrap_or(""),
                        ])
                        .output();
                }
            }
        }
    }

    tauri_build::build();
}
