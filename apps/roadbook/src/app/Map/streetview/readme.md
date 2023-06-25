# 接口分析（20230530）
域名：mapsv{0,1}.bdimg.com
## 获取街景图片（qt=pr3d）
```
https://mapsv0.bdimg.com/?qt=pr3d&fovy=75&quality=80&panoid=1000220000150127153813271IN&heading=8&pitch=0&width=1024&height=640&from=PC&auth=uxLRHEBNTBNtFIUU%3DUY%3D%3DUDFCWc76Tx%3DOCXYgGA8HbdO0V9wWd4CCgS17vyMSIFCOUCOu3LckJ0IvkGcuVtvvhguVtvyheuVtvCMGuVtvCQMuVtvIPcuVtvYvjuVtcvY1SGpuxxtF0qUEb1v%40vcuVtvc3CuVtvcPPuVtveGvuVtveh3uVtvh3CuVtvhgMuxVVtvrMhuxt2dd9dvyuf0wd0vyMSIFCOUCO&seckey=7PnZiAZwUMt86DPteWcbSP5iE7U9CsbYcy7S5y4NHxU%3D%2C7PnZiAZwUMt86DPteWcbSFCUaY7_wph786BlWerwBeAuadPa5xtwn4DM6VdJEUxPwN0X7d3uS1GYpH_uKtB8HTnPxQqOGEixR6isfRj21alAqqX_RDLZnqUN9vtnuzYOPnRyC2bmEa198S3fwu4iwK5h5R2HYFJSxuMurZJv3jL8xP_00ssxFqUOFe-899Et
```
参数 | 必填 | 示例值 | 分析
--- | --- | --- | ---
qt | 是 | pr3d
panoid | 是 | 1000220000150127153813271IN
width | 是 | 1024
height | 是 | 640
fovy | 否 | 75
quality | 否 | 80
heading | 否 | 8
pitch | 否 | 0
from | 否 | PC
auth | 否 | xxx
seckey | 否 | xxx

## 获取街景图片（qt=pdata）
```
https://mapsv1.bdimg.com/?qt=pdata&sid=0900220012200306103339563HG&pos=1_5&z=4&udt=20200825&from=PC&auth=uxLRHEzRxENtzDPPWP6WWPwzWv9W76OPnHGaKQlZUeHoNOi0nVWPSIPeJm1G68PMH8a6HDxz6ZwJvAp30z8yvvhguVtvyheuBTLtJOYSIgHvCQMuTLtJU%40rIKHw8wkvC7SujDc3YMxCEEBF0qUEb1v%40vcuVtvc3CuVtvcPPuxBt2q52GIb%40dIFwfiKvAOuCoPHB9AvhgMuzVVtvrMhuExVENtLiidiB1Af0wd0vyMSIFAS7MA&seckey=7PnZiAZwUMt86DPteWcbSNsgN0bfYzblxuoKvKf1uBo%3D%2C7PnZiAZwUMt86DPteWcbSBeDzTFdRmQMFf8V1z4j4Mwb_d9iNwPjR3mdZFOjg7pE7l4aj63qXPjvd7Syc1qf3tdN4SI_3cJAl1kWoQ2TBfekT-7yBgoAPAnnc51PWwVuYovYnfgLtfAvL_virsTFLTomleq7M4Whxu--Eea3NFcUuuYpn-XfjZZAsD6LuRpY
```
参数 | 必填 | 示例值 | 分析
--- | --- | --- | ---
qt | 是 | pdata | 方法名
sid | 是 | 09002200001503210540263497E |
pos | 是 | 1_5 | 0_0(3d);1_5(左上);2_5(左下);1_6(右上);2_6(右下),需要遍历数字全部测下看看
z | 是 | 4 | 0_0(能设置0~5);四分图只能设置4
udt | 否 | 20200825
from | 否 | PC
auth | 否 | P696Cw1YQ@ccY54G2acbD@0ECWCbJLy@uxLRHEzTzHVt126696W996BFAxz6ZwJvAp30z8yvvhguVtvyheuBTNt3P86J0IcvY1SGpuNtCH7RB86A3V=sJLIw8wkvC7SuDenSC@Bv@vcuVtvc3CuVtvcPPuxBt2q52GIbbRdFEnrR1HVDCoPHB9AvhgMuzVVtvrMhuExBEVtGccZcuVtegvcguxLRHEzTzET | 1.页面初始化时html设置了window.AUTH;<br>2.加载js(map.baidu.com/?newmap=1&qt=image&type=1&auth=xxx&seckey=xxx)也会重新设置window.AUTH,但和html一致
seckey | 否 | 7PnZiAZwUMt86DPteWcbSLlZQBg9zHH7MmGvuPWvyQk=,7PnZiAZwUMt86DPteWcbSIRDp0woEFicjyYpE96-SfaF836Tx3CoLkF-EmAPXAbKyoB-u50RkxmsArvXSXYwEM3ZNYJzxOOeWL6XNTKna3cC_vWv0e-atsoQbleqnK0ESNpYv6_PRBU7u-NDAgaIHPwga5oOe1p38Q-8_FGWBxL1BVfzy6275_YDVGiQj0Pq | 逗号分隔的第一部分来自 abclite-20590s.js(window['\x5f\x5f\x5f\x61\x62\x76\x6b']=xxx)

## 获取道路信息(qt=sdata)
```
https://mapsv0.bdimg.com/?qt=sdata&sid=09002200001503210540263497E&pc=1&auth=P696Cw1YQ%40ccY54G2acbD%400ECWCbJLy%40uxLRHEBxNExtCFRR8RV88RzCywyS8v7uvkGcuVtvvhguVtvyheuVtvCMGuVtvCQMuVtvIPcuVtvYvjuVtcvY1SGpuxVtEgpT1aDv%40vcuVtvc3CuVtvcPPuVtveGvuVtveh3uVtvh3CuVtvhgMuxVVtvrMhuxt2dd9dvyu6Ow%3DVyzgGKWzGdV%3DSRyAC6%3DJaWf%40hAcTvyMSIFCyOFyuf0wd0vyMSIFCyOFy&seckey=7PnZiAZwUMt86DPteWcbSLlZQBg9zHH7MmGvuPWvyQk%3D%2C7PnZiAZwUMt86DPteWcbSIRDp0woEFicjyYpE96-SfaF836Tx3CoLkF-EmAPXAbKyoB-u50RkxmsArvXSXYwEM3ZNYJzxOOeWL6XNTKna3cC_vWv0e-atsoQbleqnK0ESNpYv6_PRBU7u-NDAgaIHPwga5oOe1p38Q-8_FGWBxL1BVfzy6275_YDVGiQj0Pq&udt=20200825&fn=jsonp.p61023762
```
参数 | 必填 | 示例值 | 分析
--- | --- | --- | ---
qt | 是 | sdata
sid | 是 | 09002200001503210540263497E
pc | 否 | 1
auth | 否 | xxx
seckey | 否 | xxx
udt | 否 | 20200825
fn | 否 | jsonp.p61023762
```
{"content":[{"Admission":"GS(2020)5231","Date":"20150321","DeviceHeight":2.32,"FileTag":"pano_cfg","HasDepth":1,"HasTopo":1,"Heading":328.56,"ID":"09002200001503210540263497E","ImgLayer":[{"BlockX":2,"BlockY":1,"ImgFormat":"jpg","ImgLevel":1},{"BlockX":4,"BlockY":2,"ImgFormat":"jpg","ImgLevel":2},{"BlockX":8,"BlockY":4,"ImgFormat":"jpg","ImgLevel":3},{"BlockX":16,"BlockY":8,"ImgFormat":"jpg","ImgLevel":4}],"LayerCount":4,"Links":[],"Mode":"day","MoveDir":328.562,"NorthDir":301.44,"Obsolete":0,"Pitch":-0.808,"Provider":9,"RX":1295322850,"RY":484254531,"Rname":"八达岭高速","Roads":[{"ID":"d803cf-8926-6fb3-6677-e5b64e","IsCurrent":1,"Name":"八达岭高速","Panos":[{"DIR":328,"Order":0,"PID":"09002200001503210539493377E","Type":"street","X":1295342219,"Y":484223345},{"DIR":328,"Order":1,"PID":"09002200001503210539508817E","Type":"street","X":1295341461,"Y":484224613},{"DIR":329,"Order":2,"PID":"09002200001503210539521877E","Type":"street","X":1295340804,"Y":484225701},{"DIR":328,"Order":3,"PID":"09002200001503210539534347E","Type":"street","X":1295340164,"Y":484226768},{"DIR":328,"Order":4,"PID":"09002200001503210539547367E","Type":"street","X":1295339480,"Y":484227890},{"DIR":328,"Order":5,"PID":"09002200001503210539560397E","Type":"street","X":1295338796,"Y":484228995},{"DIR":328,"Order":6,"PID":"09002200001503210539573417E","Type":"street","X":1295338128,"Y":484230095},{"DIR":328,"Order":7,"PID":"09002200001503210539586117E","Type":"street","X":1295337481,"Y":484231165},{"DIR":329,"Order":8,"PID":"09002200001503210539598847E","Type":"street","X":1295336815,"Y":484232245},{"DIR":329,"Order":9,"PID":"09002200001503210540011517E","Type":"street","X":1295336174,"Y":484233338},{"DIR":329,"Order":10,"PID":"09002200001503210540023957E","Type":"street","X":1295335554,"Y":484234396},{"DIR":329,"Order":11,"PID":"09002200001503210540037107E","Type":"street","X":1295334897,"Y":484235521},{"DIR":329,"Order":12,"PID":"09002200001503210540050337E","Type":"street","X":1295334224,"Y":484236652},{"DIR":329,"Order":13,"PID":"09002200001503210540063087E","Type":"street","X":1295333575,"Y":484237742},{"DIR":329,"Order":14,"PID":"09002200001503210540075767E","Type":"street","X":1295332934,"Y":484238823},{"DIR":328,"Order":15,"PID":"09002200001503210540087867E","Type":"street","X":1295332311,"Y":484239861},{"DIR":328,"Order":16,"PID":"09002200001503210540100287E","Type":"street","X":1295331661,"Y":484240931},{"DIR":328,"Order":17,"PID":"09002200001503210540112887E","Type":"street","X":1295331007,"Y":484242008},{"DIR":328,"Order":18,"PID":"09002200001503210540125357E","Type":"street","X":1295330372,"Y":484243054},{"DIR":328,"Order":19,"PID":"09002200001503210540137457E","Type":"street","X":1295329752,"Y":484244074},{"DIR":329,"Order":20,"PID":"09002200001503210540149987E","Type":"street","X":1295329117,"Y":484245124},{"DIR":329,"Order":21,"PID":"09002200001503210540162877E","Type":"street","X":1295328478,"Y":484246198},{"DIR":329,"Order":22,"PID":"09002200001503210540175557E","Type":"street","X":1295327833,"Y":484247284},{"DIR":329,"Order":23,"PID":"09002200001503210540188247E","Type":"street","X":1295327189,"Y":484248386},{"DIR":329,"Order":24,"PID":"09002200001503210540200517E","Type":"street","X":1295326562,"Y":484249431},{"DIR":328,"Order":25,"PID":"09002200001503210540213067E","Type":"street","X":1295325924,"Y":484250506},{"DIR":328,"Order":26,"PID":"09002200001503210540226137E","Type":"street","X":1295325250,"Y":484251626},{"DIR":328,"Order":27,"PID":"09002200001503210540238547E","Type":"street","X":1295324603,"Y":484252685},{"DIR":328,"Order":28,"PID":"09002200001503210540251217E","Type":"street","X":1295323942,"Y":484253762},{"DIR":328,"Order":29,"PID":"09002200001503210540263497E","Type":"street","X":1295323304,"Y":484254804},{"DIR":329,"Order":30,"PID":"09002200001503210540276027E","Type":"street","X":1295322653,"Y":484255867},{"DIR":329,"Order":31,"PID":"09002200001503210540288617E","Type":"street","X":1295322006,"Y":484256945},{"DIR":329,"Order":32,"PID":"09002200001503210540301657E","Type":"street","X":1295321347,"Y":484258063},{"DIR":329,"Order":33,"PID":"09002200001503210540315567E","Type":"street","X":1295320661,"Y":484259238},{"DIR":328,"Order":34,"PID":"09002200001503210540330007E","Type":"street","X":1295319943,"Y":484260441},{"DIR":0,"Order":35,"PID":"09002200001503210540342457E","Type":"street","X":1295319329,"Y":484261465}],"Width":550}],"Roll":0.689,"SwitchID":[],"Time":"201503","TimeLine":[{"ID":"09002200001503210540263497E","IsCurrent":1,"Time":"day","TimeDir":"","TimeLine":"201503","Year":"2015"},{"ID":"01002200001308300953534245Q","IsCurrent":0,"Time":"day","TimeDir":"obsolete","TimeLine":"201308","Year":"2013"}],"Type":"street","UserID":"","Version":"0","X":1295323304,"Y":484254804,"Z":34.68,"format_v":"0","optver":"000001","plane":"","procdate":"20211022"}],"result":{"error":0}}
```
猜测：
1. 在街景图里点击方向移动时会根据 Links 和 Roads 字段，当 Links 有值时，一定会有岔路出现，否则就只能前后移动
2. 在街景图里点击位置时会qt=qsdata查一下sid
## 获取sid(qt=qsdata)
```
https://mapsv0.bdimg.com/?udt=20200825&qt=qsdata&x=12953230&y=4842553&l=13&action=0&mode=day&auth=P696Cw1YQ%2540ccY54G2acbD%25400ECWCbJLy%2540uxLRHEBxNExtCFRR8RV88RzCywyS8v7uvkGcuVtvvhguVtvyheuVtvCMGuVtvCQMuVtvIPcuVtvYvjuVtcvY1SGpuxVtEgpT1aDv%2540vcuVtvc3CuVtvcPPuVtveGvuVtveh3uVtvh3CuVtvhgMuxVVtvrMhuxt2dd9dvyu6Ow%253DVyzgGKWzGdV%253DSRyAC6%253DJaWf%2540hAcTvyMSIFCyOFyuf0wd0vyMSIFCyOFy&seckey=7PnZiAZwUMt86DPteWcbSLlZQBg9zHH7MmGvuPWvyQk%253D%252C7PnZiAZwUMt86DPteWcbSIRDp0woEFicjyYpE96-SfaF836Tx3CoLkF-EmAPXAbKyoB-u50RkxmsArvXSXYwEM3ZNYJzxOOeWL6XNTKna3cC_vWv0e-atsoQbleqnK0ESNpYv6_PRBU7u-NDAgaIHPwga5oOe1p38Q-8_FGWBxL1BVfzy6275_YDVGiQj0Pq&t=1685431912037&pcevaname=pc4.1&newfrom=zhuzhan_webmap&fn=jsonp32468452
```
参数 | 必填 | 示例值 | 分析
--- | --- | --- | ---
qt | 是 | qsdata
x | 是 | 12953230
y | 是 | 4842553
l | 否 | 13
action | 否 | 0
mode | 否 | day
t | 否 | 1685431912037
pcevaname | 否 | pc4.1
newfrom | 否 | zhuzhan_webmap
fn | 否 | jsonp32468452
auth | 否 | xxx
seckey | 否 | xxx
udt | 否 | 20200825