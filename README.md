# bifrost README

proxy,mock,local file web server

**only test on windows**

## Features

current:
* open workspace file in browser with local server
* proxy local file(or directory) to online url
* mock online api using nodejs and proxy

todo:
* auto download online content and proxy it
* global network panel

## open file in browser
![](http://7ximoo.com1.z0.glb.clouddn.com/a7mcesxa39olmc362cjo7it4nd.png)

## Proxy

First, you must click the system proxy toggle button in the statusbar,default is off  
![](http://7ximoo.com1.z0.glb.clouddn.com/06c57b0450g7r4ntddrpezjv2t.png)  


Then, create file `bifrost.json` in your workspace root to manage the proxyitems  
![](http://7ximoo.com1.z0.glb.clouddn.com/yhzk3au0paw6oncmwc7dmjvgc7.png)


**So,you can open the proxy link now(see the rule in bifrost.json):**  
common file  
![](http://7ximoo.com1.z0.glb.clouddn.com/6235szvlgrgrp5nx64bcqoo2mx.png)

run with node(useful for some api mock)  
![](http://7ximoo.com1.z0.glb.clouddn.com/y029m8bkjw34bbhtmiup669don.png)

proxy whole directory  
![](http://7ximoo.com1.z0.glb.clouddn.com/v32whau9x9z1ip0q2xm2lp3cy2.png)


## Extension Settings

This extension contributes the following settings:

![](http://7ximoo.com1.z0.glb.clouddn.com/itdpt479l3yuvqu0tok6yy8f72.png)


`bifrost.json`  
![](http://7ximoo.com1.z0.glb.clouddn.com/c471hzur34nrvbjo90ipk5d0a4.png)


## Known Issues

* multi vscode instance


## Release Notes




### 0.0.3

 open workspace file in browser with local server

### 0.0.10

 proxy {file,directory,mock}

### Other

Email: hmjlr123@gmail.com  
github: [骑兵程序员](https://github.com/benqy/Bifrost)



Thanks!
