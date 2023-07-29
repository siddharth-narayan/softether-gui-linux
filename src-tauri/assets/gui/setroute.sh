#!/bin/bash

oldgateway="$1"
hostname="$2"

echo $(ip route del default via $oldgateway)
echo $(ip route show)
echo $(ip route add $hostname via $oldgateway)
echo space
echo $(ip route show)

sysctl -w net.ipv6.conf.all.disable_ipv6=1
sysctl -w net.ipv6.conf.default.disable_ipv6=1
sysctl -w net.ipv6.conf.lo.disable_ipv6=1
