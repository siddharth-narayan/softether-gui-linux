{
  inputs = {
    nixpkgs.url = "nixpkgs";

    softether.url = "path:/home/siddharth/projects/github/SoftEtherVPN-fork";
    softether.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { nixpkgs, softether, self }:
    let
      pkgs = import nixpkgs { system = "x86_64-linux"; };
      pa = with pkgs; [ 
        hello

        pkg-config
        dbus
        glib
        gtk3
        libsoup
        webkitgtk
        appimagekit
        librsvg
        rustc
        rustup
        cargo
        nodejs_22
        tailwindcss
        softether.packages.x86_64-linux.default
      ];

      libraries = with pkgs; [ 
        # Libraries
        webkitgtk
        gtk3
        cairo
        gdk-pixbuf
        glib
        dbus
        librsvg
        libayatana-appindicator
      ];
    in
    {
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages = pa;
        
        shellHook =
          ''
            export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
            export XDG_DATA_DIRS=${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:$XDG_DATA_DIRS
          '';
      };
    };
}
