// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::encode;
use extendhash::sha0;
use tauri::api::path::app_data_dir;
use std::path::PathBuf;
use nix::unistd::Uid;
use std::process::Command;
use tauri::{Env, PathResolver, Config};
use tauri::{AppHandle, Manager, SystemTray, SystemTrayEvent};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn sha(password: &str) -> String {
    println!("{}", password);
    return base64::encode(sha0::compute_hash(password.as_bytes()));
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
    
    let app = tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![sha])
    .system_tray(tray)
    .on_system_tray_event(|app, event| tray_event(app.clone(), event))
    .build(tauri::generate_context!()).unwrap();

    let binding = app.path_resolver().app_data_dir().unwrap();
    let app_data_path = binding.to_str().unwrap();

    println!("App data path: {:?}", app_data_path.to_owned() + "/vpnclient/vpnclient" );

    let mut binding = Command::new("vpnclient/vpnclient");
    let binding1 = binding.arg("start").current_dir(app_data_path);
    let command = binding1.current_dir(app_data_path);
    command.spawn().unwrap();

    app.run(|_app_handle, event| match event {
        tauri::RunEvent::ExitRequested { api, .. } => {
          api.prevent_exit();
        }
        _ => {}
      })

}

fn tray_event(app: AppHandle, event: SystemTrayEvent) {
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
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "connect" => {}

            "disconnect" => {}

            "quit" => {
                std::process::exit(0);
            }
            _ => {}
        },
        _ => {}
    }
}