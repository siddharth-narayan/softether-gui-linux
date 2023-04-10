cp assets/* " + appDataDirPath + "config.json
cd " + appDataDirPat
wget $(curl -s https://api.github.com/repos/SoftEtherVPN/SoftEtherVPN_Stable/releases/latest | grep 'browser_' | cut -d\\\" -f4 | " + awk + "')
gzip -d $(ls | grep soft | cut -d ' ' -f9)
tar -xvf $(ls | grep soft | cut -d ' ' -f9)
rm $(ls | grep soft | cut -d ' ' -f9)
cd ./vpnclient/
cat $(ls | cut -d ' ' -f9 | awk '/License/ && /en/')
make main
whoami
history
cd ..
java -jar passhash.jar abcdefg