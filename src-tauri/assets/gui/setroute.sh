# #!/bin/bash

# # Check if all three arguments are provided
# if [[ $# -ne 2 ]]; then
#   echo "Usage: $0 <newgateway> <oldgateway> <hostname>"
#   exit 1
# fi

# # Extract the arguments
# #newgateway="$1"
# oldgateway="$1"
# hostname="$2"

# # Delete the default gateway to the oldgateway
# ip route del default via "$oldgateway"

# # Add a new default gateway using newgateway
# #ip route add default via "$newgateway"

# # Add a specific route for the hostname to the oldgateway
# ip route add "$hostname" via "$oldgateway"

# echo "IP route configuration updated successfully."
#!/bin/bash

echo $(whoami)

# # Check if all three arguments are provided
# if [[ $# -ne 2 ]]; then
#   echo "Usage: $0 <newgateway> <oldgateway> <hostname>"
#   exit 1
# fi

# # Extract the arguments
# newgateway="$1"
# oldgateway="$2"
# hostname="$3"

# # Delete the default gateway to the oldgateway
# ip route del default
# ip route del default
# ip route del default
# ip route del default
# ip route del default
# ip route del default
# ip route del default

# echo ip route del default via "$oldgateway"
# echo $(ip route show)
# # Add a new default gateway using newgateway
# ip route add default via "$newgateway"

# # Add a specific route for the hostname to the oldgateway
# ip route add "$hostname" via "$oldgateway"
# echo ip route del default via "$oldgateway"
# echo $(ip route show)
# echo "IP route configuration updated successfully."
echo $(ip route del default)
echo $(ip route show)
echo $(ip route add 96.237.248.142 via 172.30.0.1)



