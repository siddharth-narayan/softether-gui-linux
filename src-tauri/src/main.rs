// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{SystemTray, Manager, AppHandle, SystemTrayEvent};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let disconnect = CustomMenuItem::new("disconnect".to_string(), "Disconnect");
    let connect = CustomMenuItem::new("connect".to_string(), "Connect");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    
    let menu = SystemTrayMenu::new()
        .add_item(connect)
        .add_item(disconnect)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let tray = SystemTray::new().with_menu(menu);

    fn tray_event(app: AppHandle, event: SystemTrayEvent){
        match event {
            SystemTrayEvent::LeftClick {
              position: _,
              size: _,
              ..
            } => {
              println!("system tray received a left click");
            }
            SystemTrayEvent::RightClick {
              position: _,
              size: _,
              ..
            } => {
              println!("system tray received a right click");
            }
            SystemTrayEvent::DoubleClick {
              position: _,
              size: _,
              ..
            } => {
              println!("system tray received a double click");
              let window = app.get_window("main").unwrap();
              window.show().unwrap()
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
              match id.as_str() {
                "connect" => {

                }

                "disconnect" => {
                    
                }

                "quit" => {
                  std::process::exit(0);
                }
                _ => {}
              }
            }
            _ => {}
        }
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .system_tray(tray).on_system_tray_event(| app, event | tray_event(app.clone(), event))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
