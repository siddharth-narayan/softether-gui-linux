// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::encode;
use extendhash::sha0;
use nix::unistd::Uid;
use std::process::Command;
use tauri::Env;
use tauri::{AppHandle, Manager, SystemTray, SystemTrayEvent};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn sha0(password: &str) -> String {
    println!("{}", password);
    return base64::encode(sha0::compute_hash(password.as_bytes()));
}

#[tauri::command]
fn start_vpn_server() {
  let appDataDir = Env::default().appdir.unwrap().to_str().unwrap().to_owned();
  let mut binding = Command::new(appDataDir.clone() + "vpnclient/vpnserver start");
  let mut command = binding.current_dir(appDataDir);
  command.spawn().unwrap();
}

fn main() {
    let output: String = String::from_utf8(
        Command::new("")
            .spawn()
            .unwrap()
            .wait_with_output()
            .unwrap()
            .stdout,
    )
    .unwrap();
    println!("{}", output);

    let disconnect = CustomMenuItem::new("disconnect".to_string(), "Disconnect");
    let connect = CustomMenuItem::new("connect".to_string(), "Connect");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    let menu = SystemTrayMenu::new()
        .add_item(connect)
        .add_item(disconnect)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let tray = SystemTray::new().with_menu(menu);

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

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![sha0])
        .invoke_handler(tauri::generate_handler![start_vpn_server])
        .system_tray(tray)
        .on_system_tray_event(|app, event| tray_event(app.clone(), event))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
