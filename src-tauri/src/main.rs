// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use extendhash::sha0;
use nix::sys::socket::Ipv4Addr;
use std::process::{Command};
use tauri::{AppHandle, Manager, SystemTray, SystemTrayEvent};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};
use sysinfo::{ProcessExt, System, SystemExt};
use rtnetlink::{RouteAddRequest, RouteHandle};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn sha(password: &str) -> String {
    println!("{}", password);
    println!("{}", base64::encode(sha0::compute_hash(password.as_bytes())));
    return base64::encode(sha0::compute_hash(password.as_bytes()));
}


#[tauri::command]
fn startclient(app_handle: tauri::AppHandle) {
    use sysinfo::{ProcessExt, System, SystemExt};
    let mut procCount = 0;

    let s = System::new_all();
    for process in s.processes_by_name("vpnclient") {
        println!("{:?}", process);
        procCount += 1;
    }

    if procCount > 0 {
        return;
    }

    let binding = app_handle.path_resolver().app_data_dir().unwrap();
    let app_data_path = binding.to_str().unwrap();

    println!("{}",app_data_path.to_owned() + "/vpnclient/vpnclient");

    let mut binding = Command::new("pkexec");
    let binding1 = binding.arg(app_data_path.to_owned() + "/vpnclient/vpnclient").arg("start").current_dir(app_data_path.to_string() + "/vpnclient/");
    let command = binding1.current_dir(app_data_path);

    
    println!("{}", String::from_utf8(command.spawn().unwrap().wait_with_output().unwrap().stdout).unwrap());
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
    .invoke_handler(tauri::generate_handler![sha, startclient])
    .system_tray(tray)
    .on_system_tray_event(|app, event| tray_event(app.clone(), event))
    .build(tauri::generate_context!()).unwrap();

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