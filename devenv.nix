{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{
  languages.javascript = {
    enable = true;
    bun = {
      enable = true;
      install.enable = true;
    };
  };

  packages = [
    pkgs.azure-cli
  ];

  scripts.azure.exec = builtins.readFile ./scripts/azure.sh;

  # See full reference at https://devenv.sh/reference/options/
}
